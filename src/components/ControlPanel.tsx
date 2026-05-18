import React from 'react';
import { TEMPLATES } from '../types';

interface ControlPanelProps {
  currentTemplate: string;
  setCurrentTemplate: (id: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentTemplate,
  setCurrentTemplate,
}) => {
  return (
    <div className="absolute top-4 left-4 bg-dark-gray/90 backdrop-blur-md rounded-xl p-4 shadow-2xl z-10">
      <h2 className="text-xl font-bold text-light-blue mb-4">工业流程图 3D 渲染器</h2>
      
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-metal-silver mb-2">选择模板</h3>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(TEMPLATES).map(([id, template]) => (
            <button
              key={id}
              onClick={() => setCurrentTemplate(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTemplate === id
                  ? 'bg-industrial-blue text-white shadow-lg shadow-industrial-blue/50'
                  : 'bg-dark-gray text-light-blue hover:bg-industrial-blue/20'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-metal-silver/30 pt-4">
        <h3 className="text-sm font-semibold text-metal-silver mb-2">操作说明</h3>
        <ul className="text-xs text-light-blue/70 space-y-1">
          <li>🖱️ 拖动旋转视角</li>
          <li>🔍 滚轮缩放</li>
          <li>⌨️ 右键平移</li>
        </ul>
      </div>
    </div>
  );
};