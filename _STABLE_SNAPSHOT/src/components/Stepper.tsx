import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full" id="stepper">
      {/* Stepper numbers & titles bar */}
      <div className="flex justify-between items-center relative">
        {/* Connector line behind */}
        <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2 -z-10" />
        <div 
          className="absolute left-0 h-0.5 bg-gradient-to-r from-accent-coral to-accent-pink top-1/2 transform -translate-y-1/2 -z-10 transition-all duration-500" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          
          return (
            <div key={idx} className="flex flex-col items-center space-y-1.5 relative">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isDone 
                    ? 'bg-accent-coral text-white scale-102 shadow-md shadow-accent-coral/20' 
                    : isActive 
                      ? 'bg-gradient-to-br from-accent-coral to-accent-pink text-white scale-110 shadow-lg shadow-accent-coral/30 border border-white' 
                      : 'bg-white text-gray-400 border border-gray-200'
                }`}
              >
                {idx + 1}
              </div>
              <span 
                className={`hidden md:block text-[10px] uppercase font-bold tracking-wider ${
                  isActive ? 'text-accent-coral' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
















