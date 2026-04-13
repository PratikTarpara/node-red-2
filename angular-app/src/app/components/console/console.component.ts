// =============================================================================
// ConsoleComponent — reactive log display
// =============================================================================
import { Component, inject, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlowStateService } from '../../services/flow-state.service';
import type { LogEntry, LogLevel } from '../../models/flow-node.model';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, NgClass],
  templateUrl: './console.component.html',
  styleUrl: './console.component.scss',
})
export class ConsoleComponent implements OnInit, OnDestroy {
  protected readonly state = inject(FlowStateService);

  @ViewChild('logContainer') logContainer?: ElementRef<HTMLElement>;

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.state.logs$.subscribe(() => {
      // Auto-scroll placeholder
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onToggle(): void {
    this.state.toggleConsole();
  }

  onClear(event: Event): void {
    event.stopPropagation();
    this.state.clearLogs();
  }

  levelClass(level: LogLevel): string {
    return `log-line--${level}`;
  }

  formatTime(iso: string): string {
    try {
      return new Date(iso).toLocaleTimeString();
    } catch {
      return iso;
    }
  }

  hasError(logs: LogEntry[] | null): boolean {
    return logs?.some((l) => l.level === 'error') ?? false;
  }

  hasSuccess(logs: LogEntry[] | null): boolean {
    return !this.hasError(logs) && (logs?.some((l) => l.level === 'success') ?? false);
  }

  reverseLogs(logs: LogEntry[] | null): LogEntry[] {
    return logs ? [...logs].reverse() : [];
  }

  trackById(_: number, log: LogEntry): string {
    return log.id;
  }
}
