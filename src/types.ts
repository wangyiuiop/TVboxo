// 节点类型定义
export interface FlowNode {
  id: string;
  position: [number, number, number];
  type: 'tank' | 'pump' | 'valve' | 'sensor' | 'reactor' | 'filter';
  label: string;
}

// 连接类型定义
export interface FlowConnection {
  id: string;
  from: string;
  to: string;
  points?: [number, number, number][];
}

// 流程图表数据
export interface FlowDiagram {
  nodes: FlowNode[];
  connections: FlowConnection[];
}

// 预设模板
export const TEMPLATES: Record<string, { name: string; data: FlowDiagram }> = {
  waterTreatment: {
    name: '水处理系统',
    data: {
      nodes: [
        { id: 'inlet', position: [-8, 0, 0], type: 'tank', label: '进水池' },
        { id: 'pump1', position: [-5, 0, 0], type: 'pump', label: '输送泵' },
        { id: 'filter', position: [-2, 0, 0], type: 'filter', label: '过滤器' },
        { id: 'reactor', position: [1, 0, 0], type: 'reactor', label: '反应罐' },
        { id: 'valve', position: [4, 0, 0], type: 'valve', label: '控制阀' },
        { id: 'sensor', position: [6, 0, 0], type: 'sensor', label: '水质检测' },
        { id: 'outlet', position: [9, 0, 0], type: 'tank', label: '清水池' },
      ],
      connections: [
        { id: 'c1', from: 'inlet', to: 'pump1' },
        { id: 'c2', from: 'pump1', to: 'filter' },
        { id: 'c3', from: 'filter', to: 'reactor' },
        { id: 'c4', from: 'reactor', to: 'valve' },
        { id: 'c5', from: 'valve', to: 'sensor' },
        { id: 'c6', from: 'sensor', to: 'outlet' },
      ],
    },
  },
  chemicalProcess: {
    name: '化工生产',
    data: {
      nodes: [
        { id: 'tank1', position: [-7, 2, 0], type: 'tank', label: '原料A' },
        { id: 'tank2', position: [-7, -2, 0], type: 'tank', label: '原料B' },
        { id: 'pump1', position: [-4, 2, 0], type: 'pump', label: '泵A' },
        { id: 'pump2', position: [-4, -2, 0], type: 'pump', label: '泵B' },
        { id: 'mixer', position: [-1, 0, 0], type: 'reactor', label: '混合器' },
        { id: 'reactor', position: [2, 0, 0], type: 'reactor', label: '反应器' },
        { id: 'valve', position: [5, 0, 0], type: 'valve', label: '出料阀' },
        { id: 'product', position: [8, 0, 0], type: 'tank', label: '成品罐' },
      ],
      connections: [
        { id: 'c1', from: 'tank1', to: 'pump1' },
        { id: 'c2', from: 'tank2', to: 'pump2' },
        { id: 'c3', from: 'pump1', to: 'mixer' },
        { id: 'c4', from: 'pump2', to: 'mixer' },
        { id: 'c5', from: 'mixer', to: 'reactor' },
        { id: 'c6', from: 'reactor', to: 'valve' },
        { id: 'c7', from: 'valve', to: 'product' },
      ],
    },
  },
  industrialLine: {
    name: '工业流水线',
    data: {
      nodes: [
        { id: 'raw', position: [-9, 0, 0], type: 'tank', label: '原料' },
        { id: 'prep', position: [-6, 0, 0], type: 'filter', label: '预处理' },
        { id: 'proc1', position: [-3, 0, 0], type: 'reactor', label: '加工1' },
        { id: 'proc2', position: [0, 0, 0], type: 'reactor', label: '加工2' },
        { id: 'qual', position: [3, 0, 0], type: 'sensor', label: '质检' },
        { id: 'pack', position: [6, 0, 0], type: 'reactor', label: '包装' },
        { id: 'ship', position: [9, 0, 0], type: 'tank', label: '出货' },
      ],
      connections: [
        { id: 'c1', from: 'raw', to: 'prep' },
        { id: 'c2', from: 'prep', to: 'proc1' },
        { id: 'c3', from: 'proc1', to: 'proc2' },
        { id: 'c4', from: 'proc2', to: 'qual' },
        { id: 'c5', from: 'qual', to: 'pack' },
        { id: 'c6', from: 'pack', to: 'ship' },
      ],
    },
  },
};