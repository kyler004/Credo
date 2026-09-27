'use client';

import React, { useState } from 'react';
import { Play, Pause, ChevronUp, ChevronDown, RotateCcw, Eye } from 'lucide-react';

interface StageScrubberProps {
  currentStage: string;
  onJumpStage: (stage: string) => void;
  scrollProgress: number;
}

export const STAGES = [
  { id: 'hero', label: '01. Credo Hero' },
  { id: 'elevate', label: '02. Shell Explode' },
  { id: 'discover', label: '03. Glass Shatter' },
  { id: 'path', label: '04. Financial Path' },
  { id: 'benefits', label: '05. Benefits Gauge' },
  { id: 'courses', label: '06. Courses Focus' },
  { id: 'values', label: '07. Values Orbit' },
  { id: 'footer', label: '08. Subscribe' },
];

export default function StageScrubber({
  currentStage,
  onJumpStage,
  scrollProgress,
}: StageScrubberProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Mini Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="bg-[#1C1C1C]/90 backdrop-blur-md border border-white/10 hover:border-white/20 text-white text-xs px-3.5 py-2 rounded-full flex items-center gap-2 shadow-2xl cursor-pointer mb-2 transition-all hover:scale-105"
      >
        <span className="w-2 h-2 rounded-full bg-[#FF4D37] animate-pulse" />
        <span className="font-mono text-[11px] text-[#A0A0A0]">
          Stage: {STAGES.find((s) => s.id === currentStage)?.label.slice(4) || 'Credo'}
        </span>
        {collapsed ? (
          <ChevronUp className="w-3.5 h-3.5 text-white/70" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-white/70" />
        )}
      </button>

      {/* Expanded Control Panel */}
      {!collapsed && (
        <div className="bg-[#1C1C1C]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl text-xs w-64 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#888888]">
              3D Animation Storyline
            </span>
            <span className="text-[10px] font-mono text-[#FF4D37]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1 max-h-56 overflow-y-auto pr-1">
            {STAGES.map((stg) => {
              const isActive = currentStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => onJumpStage(stg.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer text-[11px] ${
                    isActive
                      ? 'bg-[#FF4D37] text-white font-semibold shadow-sm'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{stg.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#707070]">
            <span>Scroll or click to view</span>
            <button
              onClick={() => onJumpStage('hero')}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
