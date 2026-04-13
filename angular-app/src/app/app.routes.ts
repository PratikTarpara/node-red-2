import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/workspace/workspace.component').then(
        (m) => m.WorkspaceComponent,
      ),
  },
  {
    // Catch-all redirect
    path: '**',
    redirectTo: '',
  },
];
