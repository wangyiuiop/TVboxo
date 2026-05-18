import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { ControlPanel } from './components/ControlPanel';
import { TEMPLATES } from './types';

export const App: React.FC = () => {
  const [currentTemplate, setCurrentTemplate] = useState('waterTreatment');

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Scene diagram={TEMPLATES[currentTemplate].data} />
      <ControlPanel
        currentTemplate={currentTemplate}
        setCurrentTemplate={setCurrentTemplate}
      />
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-dark-gray/90 backdrop-blur-md rounded-xl px-6 py-3 shadow-2xl z-10">
        <p className="text-light-blue/80 text-sm text-center">
          当前模板: <span className="text-industrial-blue font-semibold">{TEMPLATES[currentTemplate].name}</span>
        </p>
      </div>
    </div>
  );
};