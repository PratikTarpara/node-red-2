// =============================================================================
// FlowService — all HTTP communication via HttpClient
// No API calls exist in components — this service is the single gateway
// =============================================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import type {
  FlowRunRequest,
  FlowRunResponse,
  SaveFlowRequest,
  SaveFlowResponse,
  FlowListItem,
  LoadFlowResponse,
} from '../models/flow-execution.model';

@Injectable({ providedIn: 'root' })
export class FlowService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  // ── Flow execution ─────────────────────────────────────────────────────────

  runFlow(payload: FlowRunRequest): Observable<FlowRunResponse> {
    return this.http
      .post<FlowRunResponse>(`${this.base}/api/flow/run`, payload)
      .pipe(catchError(this.handleError));
  }

  // ── Persistence ────────────────────────────────────────────────────────────

  saveFlow(payload: SaveFlowRequest): Observable<SaveFlowResponse> {
    return this.http
      .post<SaveFlowResponse>(`${this.base}/api/flow/save`, payload)
      .pipe(catchError(this.handleError));
  }

  loadFlow(id: string): Observable<LoadFlowResponse> {
    return this.http
      .get<LoadFlowResponse>(`${this.base}/api/flow/load/${encodeURIComponent(id)}`)
      .pipe(catchError(this.handleError));
  }

  listFlows(): Observable<FlowListItem[]> {
    return this.http
      .get<FlowListItem[]>(`${this.base}/api/flow/list`)
      .pipe(
        map((items) => items ?? []),
        catchError(this.handleError),
      );
  }

  // ── Health ─────────────────────────────────────────────────────────────────

  checkHealth(): Observable<{ status: string; timestamp: string }> {
    return this.http
      .get<{ status: string; timestamp: string }>(`${this.base}/api/health`)
      .pipe(catchError(this.handleError));
  }

  // ── Error handling ─────────────────────────────────────────────────────────

  private handleError(err: HttpErrorResponse): Observable<never> {
    const message =
      (err.error as { error?: string })?.error ??
      err.message ??
      'Unknown server error';
    return throwError(() => new Error(message));
  }
}
