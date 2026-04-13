// =============================================================================
// ToolbarComponent — run/save/load/clear actions, no HTTP calls in template
// =============================================================================
import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FlowStateService } from '../../services/flow-state.service';
import { FlowService } from '../../services/flow.service';
import type { FlowNode, FlowEdge } from '../../models/flow-node.model';
import type { FlowRunLogItem, FlowRunResultItem, LoadFlowResponse } from '../../models/flow-execution.model';

let flowIdCounter = Date.now();

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  protected readonly state = inject(FlowStateService);
  private readonly flowService = inject(FlowService);

  // ── Run ────────────────────────────────────────────────────────────────────

  async onRun(): Promise<void> {
    if (this.state.isRunning || this.state.nodes.length === 0) return;

    this.state.setIsRunning(true);
    this.state.clearLogs();
    this.state.nodes.forEach((n) => this.state.updateNodeStatus(n.id, 'idle'));

    this.state.addSystemLog(
      'info',
      `Starting flow execution with ${this.state.nodes.length} nodes and ${this.state.edges.length} edges...`,
    );

    try {
      const response = await firstValueFrom(
        this.flowService.runFlow({
          nodes: this.state.nodes.map((n) => ({
            id: n.id,
            type: n.type,
            data: n.data as unknown as Record<string, unknown>,
          })),
          edges: this.state.edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
          })),
        }),
      );

      response.results?.forEach((r: FlowRunResultItem) =>
        this.state.updateNodeStatus(r.nodeId, r.status),
      );

      response.logs?.forEach((log: FlowRunLogItem) =>
        this.state.addLog({ ...log, data: log.data }),
      );

      this.state.addSystemLog('success', '✅ Flow execution completed successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.state.addSystemLog('error', `❌ Flow execution failed: ${message}`);
    } finally {
      this.state.setIsRunning(false);
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async onSave(): Promise<void> {
    const id = `flow-${flowIdCounter++}`;

    try {
      await firstValueFrom(
        this.flowService.saveFlow({
          id,
          nodes: this.state.nodes.map((n) => ({
            id: n.id,
            type: n.type,
            data: n.data as unknown as Record<string, unknown>,
            position: n.position,
          })),
          edges: this.state.edges,
        }),
      );
      this.state.addSystemLog('success', `💾 Flow saved as "${id}"`);
    } catch {
      // Fallback: download as JSON
      this.downloadFlowAsJson(id);
    }
  }

  // ── Load ───────────────────────────────────────────────────────────────────

  onLoad(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const flow = JSON.parse(ev.target?.result as string) as LoadFlowResponse;
          if (flow.nodes) {
            this.state.setNodes(flow.nodes as unknown as FlowNode[]);
          }
          if (flow.edges) {
            this.state.setEdges(flow.edges as unknown as FlowEdge[]);
          }
          this.state.addSystemLog('info', `📂 Flow loaded: ${file.name}`);
        } catch {
          this.state.addSystemLog('error', 'Invalid flow JSON file');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  // ── Clear ──────────────────────────────────────────────────────────────────

  onClear(): void {
    this.state.clearFlow();
  }

  // ── Toggle console ────────────────────────────────────────────────────────

  onToggleConsole(): void {
    this.state.toggleConsole();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private downloadFlowAsJson(id: string): void {
    const blob = new Blob(
      [JSON.stringify({ id, nodes: this.state.nodes, edges: this.state.edges }, null, 2)],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
