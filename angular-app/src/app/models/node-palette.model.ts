// =============================================================================
// Node Palette Model — static definitions for sidebar node types
// =============================================================================
import type { AASServerData, SubmodelData, ConverterData, ActionData } from './flow-node.model';

export interface NodePaletteEntry {
  type: string;
  label: string;
  description: string;
  /** Hex accent color */
  color: string;
  /** CSS gradient for icon background */
  iconBg: string;
  /** SVG path data for the icon */
  iconPath: string;
  defaultData: AASServerData | SubmodelData | ConverterData | ActionData;
}

export const NODE_PALETTE: NodePaletteEntry[] = [
  {
    type: 'aasServer',
    label: 'AAS Server',
    description: 'Connect to an AAS server endpoint',
    color: '#3b82f6',
    iconBg: 'linear-gradient(135deg, #1e3a6e, #152d5a)',
    // Server icon paths
    iconPath:
      'M20 5H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm1 5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3zm-1 4H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2zm1 5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3zM8 8H6v2h2V8zm0 8H6v2h2v-2z',
    defaultData: {
      kind: 'aasServer',
      label: 'AAS Server',
      endpoint: 'http://localhost:4000',
      authType: 'none',
      status: 'idle',
    },
  },
  {
    type: 'submodel',
    label: 'Submodel',
    description: 'AAS Submodel (e.g. DPP)',
    color: '#10b981',
    iconBg: 'linear-gradient(135deg, #064e3b, #065f46)',
    // Layers icon
    iconPath:
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    defaultData: {
      kind: 'submodel',
      label: 'DPP Submodel',
      semanticId: '0173-1#01-AHF578#001',
      submodelIdShort: 'DigitalProductPassport',
      schemaType: 'DPP',
      status: 'idle',
    },
  },
  {
    type: 'converter',
    label: 'Converter',
    description: 'Transform data between formats',
    color: '#f59e0b',
    iconBg: 'linear-gradient(135deg, #78350f, #92400e)',
    // ArrowLeftRight icon
    iconPath:
      'M21 16H3m18 0-4-4m4 4-4 4M3 8h18M3 8l4-4M3 8l4 4',
    defaultData: {
      kind: 'converter',
      label: 'AAS → DPP',
      inputFormat: 'AAS JSON',
      outputFormat: 'DPP JSON',
      mapping: '{}',
      status: 'idle',
    },
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Read / Write / Validate / Transform',
    color: '#8b5cf6',
    iconBg: 'linear-gradient(135deg, #3b0764, #4c1d95)',
    // Zap icon
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    defaultData: {
      kind: 'action',
      label: 'Read Action',
      actionType: 'read',
      target: '',
      parameters: '{}',
      status: 'idle',
    },
  },
];
