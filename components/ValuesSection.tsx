'use client';

import React from 'react';

export default function ValuesSection() {
  const values = [
    {
      tag: 'Supportive',
      title: 'Client-Centric Approach',
      description:
        'Our focus is on your success, offering personalized support and resources tailored to help you achieve your financial goals efficiently.',
      position: 'top-left',
    },
    {
      tag: 'Pioneering',
      title: 'Innovation and Excellence',
      description:
        'We are dedicated to pioneering new solutions and delivering the highest quality in financial education, constantly evolving to meet your needs.',
      position: 'top-right',
    },
    {
      tag: 'Accessibility',
      title: 'Affordable Excellence',
      description:
        'We believe in making financial education accessible to all, equipping you with the tools to take control of your future.',
      position: 'bottom-left',
    },
    {
      tag: 'Knowledge is power',
      title: 'Integrity and Growth',
      description:
        'Our commitment to honesty and excellence drives us to help you achieve sustainable financial success.',
      position: 'bottom-right',
    },
  ];

  return (
    <section
      id="values-section"
      className="relative min-h-screen py-24 px-6 md:px-12 flex items-center justify-center z-20"
    >
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FF4D37]" />
            <span className="text-xs uppercase tracking-widest text-[#FF4D37] font-semibold">
              Core Principles
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
            Values That Drive Credo
          </h2>
        </div>

        {/* 2x2 Grid with central 3D space */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24 relative">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-[#1C1C1C]/90 backdrop-blur-md border border-white/5 rounded-2xl p-7 hover:border-white/15 transition-all duration-300 group hover:translate-y-[-2px] shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D37]" />
                <span className="text-xs font-medium text-[#FF4D37] uppercase tracking-wide">
                  {v.tag}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                {v.title}
              </h3>
              <p className="text-sm text-[#8E8E8E] leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
