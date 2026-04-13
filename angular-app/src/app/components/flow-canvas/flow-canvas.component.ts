// =============================================================================
// FlowCanvasComponent — wraps the <aas-flow-canvas> React Web Component
//
// The canvas-wc.js script is loaded BEFORE Angular via angular.json scripts[],
// so customElements.get('aas-flow-canvas') is always defined by the time this
// component initialises. We still guard with whenDefined() for safety.
//
// Data flow:
//   Angular state → JSON attributes → AASFlowCanvasElement.attributeChangedCallback
//   User interactions → CustomEvents (bubbles: true) → Angular event listeners
// =============================================================================
import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
  NgZone,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Subscription, combineLatest } from 'rxjs';
import { FlowStateService } from '../../services/flow-state.service';
import type { FlowNode, FlowEdge } from '../../models/flow-node.model';

/** Typed wrappers for the events fired by <aas-flow-canvas> */
interface CanvasNodeSelectedEvent extends CustomEvent {
  detail: { nodeId: string | null };
}
interface CanvasNodesChangedEvent extends CustomEvent {
  detail: { nodes: unknown[] };
}
interface CanvasEdgesChangedEvent extends CustomEvent {
  detail: { edges: unknown[] };
}
interface CanvasNodeDroppedEvent extends CustomEvent {
  detail: { node: FlowNode };
}
interface CanvasConnectEvent extends CustomEvent {
  detail: { source: string; target: string };
}

@Component({
  selector: 'app-flow-canvas',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './flow-canvas.component.html',
  styleUrl: './flow-canvas.component.scss',
})
export class FlowCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvasWC', { static: true })
  private readonly canvasRef!: ElementRef<HTMLElement>;

  protected readonly state = inject(FlowStateService);
  private readonly zone = inject(NgZone);

  private readonly subs = new Subscription();

  ngOnInit(): void {
    // Guard: wait for the custom element to be defined before interacting with it.
    // Since canvas-wc.js is loaded via angular.json scripts[], this resolves
    // immediately in normal operation.
    void customElements.whenDefined('aas-flow-canvas').then(() => {
      this.zone.run(() => this.setupCanvas());
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private setupCanvas(): void {
    const el = this.canvasRef.nativeElement;

    // ── Push Angular state → WC attributes ───────────────────────────────────
    // No debounceTime — we want immediate attribute updates so ReactFlow
    // always shows the latest nodes/edges without a render gap.
    this.subs.add(
      combineLatest([this.state.nodes$, this.state.edges$, this.state.isRunning$]).subscribe(
        ([nodes, edges, running]) => {
          // Run outside Angular zone to avoid unnecessary change detection cycles
          this.zone.runOutsideAngular(() => {
            el.setAttribute('nodes', JSON.stringify(nodes));
            el.setAttribute('edges', JSON.stringify(edges));
            el.setAttribute('running', String(running));
          });
        },
      ),
    );

    // ── WC custom events → Angular state ─────────────────────────────────────
    el.addEventListener('nodeselected', (e) => {
      this.zone.run(() => {
        this.state.selectNode((e as CanvasNodeSelectedEvent).detail.nodeId);
      });
    });

    el.addEventListener('nodeschanged', (e) => {
      this.zone.run(() => {
        this.state.setNodes((e as CanvasNodesChangedEvent).detail.nodes as FlowNode[]);
      });
    });

    el.addEventListener('edgeschanged', (e) => {
      this.zone.run(() => {
        this.state.setEdges((e as CanvasEdgesChangedEvent).detail.edges as FlowEdge[]);
      });
    });

    el.addEventListener('nodedropped', (e) => {
      this.zone.run(() => {
        this.state.addNode((e as CanvasNodeDroppedEvent).detail.node);
      });
    });

    el.addEventListener('connect', (e) => {
      this.zone.run(() => {
        const { source, target } = (e as CanvasConnectEvent).detail;
        this.state.addEdge(source, target);
      });
    });
  }
}
