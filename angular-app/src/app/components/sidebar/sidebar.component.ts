// =============================================================================
// SidebarComponent — node palette with drag-and-drop support
// =============================================================================
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NODE_PALETTE, type NodePaletteEntry } from '../../models/node-palette.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly palette = NODE_PALETTE;

  onDragStart(event: DragEvent, entry: NodePaletteEntry): void {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow-type', entry.type);
    event.dataTransfer.setData(
      'application/reactflow-data',
      JSON.stringify(entry.defaultData),
    );
  }

  trackByType(_: number, entry: NodePaletteEntry): string {
    return entry.type;
  }
}
