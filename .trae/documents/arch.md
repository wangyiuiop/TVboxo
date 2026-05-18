## 1. Architecture Design
```mermaid
graph TB
    subgraph Frontend
        A[React 18] --> B[Three.js]
        A --> C[@react-three/fiber]
        A --> D[@react-three/drei]
        A --> E[Tailwind CSS]
        C --> F[3D Scene]
        D --> F
    end
    subgraph Components
        G[PipelineRenderer]
        H[ControlPanel]
        I[NodeComponents]
        J[LightingSetup]
    end
    F --> G
    F --> H
    F --> I
    F --> J
```

## 2. Technology Description
- **Frontend**: React@18 + tailwindcss@3 + vite
- **Initialization Tool**: vite-init
- **Backend**: None (纯前端应用)
- **3D Libraries**: three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **Database**: None

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 主页 - 3D流程图渲染器 |

## 4. API Definitions (if backend exists)
不适用 - 纯前端应用

## 5. Server Architecture Diagram (if backend exists)
不适用

## 6. Data Model (if applicable)
不适用

### 核心数据结构定义
```typescript
// 节点类型定义
interface FlowNode {
  id: string;
  position: [number, number, number];
  type: 'tank' | 'pump' | 'valve' | 'sensor' | 'reactor';
  label: string;
}

// 连接类型定义
interface FlowConnection {
  id: string;
  from: string;
  to: string;
  points?: [number, number, number][];
}

// 流程图表数据
interface FlowDiagram {
  nodes: FlowNode[];
  connections: FlowConnection[];
}
```
