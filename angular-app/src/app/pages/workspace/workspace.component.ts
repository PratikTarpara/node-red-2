// =============================================================================
// WorkspaceComponent — main editor layout shell (lazy-loaded page)
// =============================================================================
import { Component } from '@angular/core';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FlowCanvasComponent } from '../../components/flow-canvas/flow-canvas.component';
import { ConfigPanelComponent } from '../../components/config-panel/config-panel.component';
import { ConsoleComponent } from '../../components/console/console.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    ToolbarComponent,
    SidebarComponent,
    FlowCanvasComponent,
    ConfigPanelComponent,
    ConsoleComponent,
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent {}
