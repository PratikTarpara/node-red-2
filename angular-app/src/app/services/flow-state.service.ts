// =============================================================================
// FlowStateService — replaces Zustand flowStore with RxJS BehaviorSubjects
// Provides centralised, reactive state for the entire flow editor
// =============================================================================
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { FlowNode, FlowEdge, LogEntry, LogLevel } from '../models/flow-node.model';

let edgeIdCounter = 0;

@Injectable({ providedIn: 'root' })
export class FlowStateService {
  // ── State streams ──────────────────────────────────────────────────────────

  readonly nodes$ = new BehaviorSubject<FlowNode[]>([]);
  readonly edges$ = new BehaviorSubject<FlowEdge[]>([]);
  readonly selectedNodeId$ = new BehaviorSubject<string | null>(null);
  readonly logs$ = new BehaviorSubject<LogEntry[]>([]);
  readonly isRunning$ = new BehaviorSubject<boolean>(false);
  readonly consoleOpen$ = new BehaviorSubject<boolean>(true);

  // ── Convenience snapshot getters ───────────────────────────────────────────

  get nodes(): FlowNode[] {
    return this.nodes$.getValue();
  }

  get edges(): FlowEdge[] {
    return this.edges$.getValue();
  }

  get isRunning(): boolean {
    return this.isRunning$.getValue();
  }

  // ── Node management ────────────────────────────────────────────────────────

  setNodes(nodes: FlowNode[]): void {
    this.nodes$.next(nodes);
  }

  setEdges(edges: FlowEdge[]): void {
    this.edges$.next(edges);
  }

  addNode(node: FlowNode): void {
    this.nodes$.next([...this.nodes, node]);
  }

  addEdge(source: string, target: string): void {
    const id = `e-${++edgeIdCounter}`;
    const edge: FlowEdge = { id, source, target, animated: true };
    this.edges$.next([...this.edges, edge]);
  }

  selectNode(id: string | null): void {
    this.selectedNodeId$.next(id);
  }

  updateNodeData(id: string, patch: Record<string, unknown>): void {
    const updated = this.nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
    );
    this.nodes$.next(updated);
  }

  updateNodeStatus(
    id: string,
    status: 'idle' | 'running' | 'success' | 'error',
  ): void {
    this.updateNodeData(id, { status });
  }

  removeNode(id: string): void {
    this.nodes$.next(this.nodes.filter((n) => n.id !== id));
    this.edges$.next(
      this.edges.filter((e) => e.source !== id && e.target !== id),
    );
    if (this.selectedNodeId$.getValue() === id) {
      this.selectedNodeId$.next(null);
    }
  }

  // ── Flow-level operations ──────────────────────────────────────────────────

  clearFlow(): void {
    this.nodes$.next([]);
    this.edges$.next([]);
    this.selectedNodeId$.next(null);
    this.logs$.next([]);
  }

  // ── Execution state ────────────────────────────────────────────────────────

  setIsRunning(v: boolean): void {
    this.isRunning$.next(v);
  }

  // ── Console / logging ──────────────────────────────────────────────────────

  addLog(entry: LogEntry): void {
    const current = this.logs$.getValue();
    // Keep last 500 entries
    this.logs$.next([...current.slice(-499), entry]);
  }

  addSystemLog(level: LogLevel, message: string): void {
    this.addLog({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nodeId: '__system__',
      nodeLabel: 'System',
      level,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  clearLogs(): void {
    this.logs$.next([]);
  }

  toggleConsole(): void {
    this.consoleOpen$.next(!this.consoleOpen$.getValue());
  }
}
