// =============================================================================
// ConfigPanelComponent — per-node-type reactive configuration forms
// =============================================================================
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { FlowStateService } from '../../services/flow-state.service';
import type {
  AASServerData,
  SubmodelData,
  ConverterData,
  ActionData,
} from '../../models/flow-node.model';

@Component({
  selector: 'app-config-panel',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, FormsModule],
  templateUrl: './config-panel.component.html',
  styleUrl: './config-panel.component.scss',
})
export class ConfigPanelComponent {
  protected readonly state = inject(FlowStateService);

  readonly selectedNode$ = this.state.selectedNodeId$.pipe(
    map((id) => (id ? this.state.nodes.find((n) => n.id === id) ?? null : null)),
  );

  readonly nodeTypeColors: Record<string, string> = {
    aasServer: '#3b82f6',
    submodel: '#10b981',
    converter: '#f59e0b',
    action: '#8b5cf6',
  };

  readonly nodeTypeLabels: Record<string, string> = {
    aasServer: 'AAS Server',
    submodel: 'Submodel',
    converter: 'Converter',
    action: 'Action',
  };

  asAASServer(data: unknown): AASServerData {
    return data as AASServerData;
  }

  asSubmodel(data: unknown): SubmodelData {
    return data as SubmodelData;
  }

  asConverter(data: unknown): ConverterData {
    return data as ConverterData;
  }

  asAction(data: unknown): ActionData {
    return data as ActionData;
  }

  updateField(id: string, field: string, value: unknown): void {
    this.state.updateNodeData(id, { [field]: value });
  }

  onClose(): void {
    this.state.selectNode(null);
  }

  trackById(_: number, item: unknown): unknown {
    return item;
  }
}
