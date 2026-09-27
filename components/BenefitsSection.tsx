'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BenefitsSectionProps {
  onOpenGetStarted: () => void;
}

export default function BenefitsSection({ onOpenGetStarted }: BenefitsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      id: 0,
      title: 'FINANCIAL FREEDOM IS AHEAD',
      description:
        "Learn from seasoned experts who simplify complex topics, so you can confidently plan for your goals, whether it's buying a home, growing your wealth, or preparing for retirement.",
      step: '01',
    },
    {
      id: 1,
      title: 'UNLOCK FINANCIAL MASTERY',
      description:
        'Gain practical skills from industry experts and transform your financial strategies into actionable plans for success.',
      step: '02',
    },
    {
      id: 2,
      title: 'ACHIEVE FINANCIAL CONFIDENCE',
      description:
        'Learn at your own pace with concise, actionable content designed to boost your understanding and empower your financial decisions.',
      step: '03',
    },
  ];

  // Auto-cycle optionally if not hovered, but allow full manual control
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % benefits.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [benefits.length]);

  return (
    <section
      id="benefits-section"
      className="relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 z-20"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Vertical ruler / gauge indicator */}
        <div className="lg:col-span-3 flex lg:flex-row items-center gap-6 select-none">
          <div className="relative flex flex-col items-center">
            {/* Scrubber Badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1C1C] border border-white/10 text-white text-xs font-medium cursor-pointer shadow-md mb-4 hover:border-white/20 transition-colors"
              onClick={() => setActiveTab((prev) => (prev + 1) % 3)}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D37] animate-pulse" />
              <span>Our benefits</span>
            </div>

            {/* Vertical tick marks ruler */}
            <div className="relative h-64 w-8 flex flex-col justify-between py-2 items-center">
              {Array.from({ length: 24 }).map((_, i) => {
                const isMajor = i % 8 === 0;
                const stepIndex = Math.floor(i / 8);
                const isActive = stepIndex === activeTab;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveTab(Math.min(2, Math.floor(i / 8)))}
                    className="flex items-center gap-1.5 w-full cursor-pointer group"
                  >
                    <div
                      className={`transition-all duration-300 ${
                        isMajor
                          ? isActive
                            ? 'w-7 h-[2px] bg-[#FF4D37]'
                            : 'w-5 h-[1.5px] bg-white/40 group-hover:bg-white/70'
                          : 'w-3 h-[1px] bg-white/20 group-hover:bg-white/40'
                      }`}
                    />
                  </div>
                );
              })}

              {/* Moving needle / active marker */}
              <div
                className="absolute left-0 w-8 h-8 rounded-full border border-[#FF4D37]/50 flex items-center justify-center pointer-events-none transition-all duration-500"
                style={{
                  top: `${(activeTab / (benefits.length - 1)) * 82}%`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#FF4D37]" />
              </div>
            </div>

            {/* Step Selector Buttons */}
            <div className="flex gap-2 mt-4">
              {benefits.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setActiveTab(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-mono flex items-center justify-center transition-all cursor-pointer ${
                    activeTab === idx
                      ? 'bg-[#FF4D37] text-white font-bold'
                      : 'bg-[#1C1C1C] text-[#808080] hover:text-white border border-white/5'
                  }`}
                >
                  {b.step}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center column: Empty space for 3D red star model */}
        <div className="lg:col-span-4 min-h-[320px] lg:min-h-[460px] flex items-center justify-center pointer-events-none">
          {/* Spatial buffer for 3D model canvas */}
        </div>

        {/* Right column: Content presentation */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF4D37]" />
            <span className="text-xs uppercase tracking-widest text-[#FF4D37] font-semibold">
              Our benefits
            </span>
          </div>

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase leading-[1.1] mb-6">
                  {benefits[activeTab].title}
                </h3>
                <p className="text-base text-[#9E9E9E] leading-relaxed max-w-lg mb-8">
                  {benefits[activeTab].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenGetStarted}
              className="bg-white hover:bg-neutral-200 text-[#141414] text-xs font-semibold px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-[1.02] shadow-lg cursor-pointer"
            >
              Get Started
            </button>
            <div className="flex items-center gap-2">
              {benefits.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTab === i ? 'w-8 bg-[#FF4D37]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
