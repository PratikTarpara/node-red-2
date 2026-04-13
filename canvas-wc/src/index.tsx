// =============================================================================
// Custom Element registration — <aas-flow-canvas>
//
// Loaded via angular.json scripts[] BEFORE Angular bootstraps.
//
// Protocol:
//   • Receives: attributes  nodes="[...]" edges="[...]" running="true|false"
//   • Emits:    nodeselected  { nodeId }
//               nodeschanged  { nodes }
//               edgeschanged  { edges }
//               nodedropped   { node }
//               connect       { source, target }
// =============================================================================
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowCanvasWC } from './FlowCanvasWC';
import type { FlowNode, FlowEdge } from './types';

const CONTAINER_STYLE: Partial<CSSStyleDeclaration> = {
  display: 'block',
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
};

class AASFlowCanvasElement extends HTMLElement {
  private root: Root | null = null;

  static get observedAttributes(): string[] {
    return ['nodes', 'edges', 'running'];
  }

  connectedCallback(): void {
    // Apply host styles — ensures the element fills its flex container
    Object.assign(this.style, CONTAINER_STYLE);

    if (!this.root) {
      this.root = createRoot(this);
    }
    this.renderCanvas();
  }

  disconnectedCallback(): void {
    // Defer unmount to next microtask so React can finish any in-flight updates
    Promise.resolve().then(() => {
      this.root?.unmount();
      this.root = null;
    });
  }

  attributeChangedCallback(): void {
    if (this.root) {
      this.renderCanvas();
    }
  }

  private parseAttr<T>(name: string, fallback: T): T {
    const raw = this.getAttribute(name);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private emit(type: string, detail: unknown): void {
    this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true }),
    );
  }

  private renderCanvas(): void {
    const nodes = this.parseAttr<FlowNode[]>('nodes', []);
    const edges = this.parseAttr<FlowEdge[]>('edges', []);

    this.root?.render(
      <React.StrictMode>
        <ReactFlowProvider>
          <FlowCanvasWC
            nodes={nodes}
            edges={edges}
            dispatch={(type, detail) => this.emit(type, detail)}
          />
        </ReactFlowProvider>
      </React.StrictMode>,
    );
  }
}

if (!customElements.get('aas-flow-canvas')) {
  customElements.define('aas-flow-canvas', AASFlowCanvasElement);
}
