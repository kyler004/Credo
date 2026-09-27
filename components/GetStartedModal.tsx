'use client';

import React, { useState } from 'react';
import { X, Check, Sparkles, ArrowRight } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (index: number) => void;
}

export default function GetStartedModal({
  isOpen,
  onClose,
  onSelectCourse,
}: GetStartedModalProps) {
  const [goal, setGoal] = useState<string>('investing');
  const [experience, setExperience] = useState<string>('beginner');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Map goal to course index
      const mapping: Record<string, number> = {
        wealth: 0,
        investing: 1,
        budget: 2,
        freedom: 3,
      };
      const targetIndex = mapping[goal] ?? 0;
      onSelectCourse(targetIndex);
      setSubmitted(false);
      onClose();
      const el = document.getElementById('courses-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4D37]" />
            <h3 className="text-xl font-bold text-white">Find Your Financial Path</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 rounded-full cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FF4D37]/20 border border-[#FF4D37] flex items-center justify-center text-[#FF4D37] mb-4 animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Tailoring Your Program</h4>
            <p className="text-xs text-[#888888] max-w-xs">
              Matching your financial profile to the optimal Credo curriculum...
            </p>
          </div>
        ) : (
          <form onSubmit={handleFinish} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-semibold mb-3">
                1. What is your primary financial focus?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'wealth', label: 'Wealth Accumulation' },
                  { id: 'investing', label: 'Stock & Market Investing' },
                  { id: 'budget', label: 'Budget & Cashflow' },
                  { id: 'freedom', label: 'Early Financial Independence' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`p-3 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                      goal === item.id
                        ? 'bg-[#FF4D37] text-white border-[#FF4D37] shadow-lg shadow-[#FF4D37]/20'
                        : 'bg-[#222222] text-[#A0A0A0] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-semibold mb-3">
                2. Your current experience level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Foundational' },
                  { id: 'intermediate', label: 'Intermediate' },
                  { id: 'advanced', label: 'Advanced' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperience(lvl.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer ${
                      experience === lvl.id
                        ? 'bg-white text-[#141414] border-white font-semibold'
                        : 'bg-[#222222] text-[#888888] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#888888] hover:text-white cursor-pointer"
              >
                Skip for now
              </button>
              <button
                type="submit"
                className="bg-[#FF4D37] hover:bg-[#ff3720] text-white text-xs font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF4D37]/30"
              >
                <span>Generate Path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
