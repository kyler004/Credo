'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface CourseItem {
  id: number;
  code: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  modules: string[];
}

interface CoursesSectionProps {
  activeCourse: number;
  onSelectCourse: (index: number) => void;
  onOpenCourseModal: (course: CourseItem) => void;
}

export const COURSES_DATA: CourseItem[] = [
  {
    id: 0,
    code: '(01)',
    title: 'Wealth Builder',
    description: 'Learn proven strategies to grow and manage your wealth effectively over time.',
    duration: '8 Weeks',
    level: 'Comprehensive',
    modules: [
      'Asset Allocation & Portfolio Design',
      'Compound Growth Mechanisms',
      'Tax-Advantaged Investment Vehicles',
      'Risk Diversification & Hedging',
    ],
  },
  {
    id: 1,
    code: '(02)',
    title: 'Smart Investing',
    description: 'Master the fundamentals of investing to make informed decisions and maximize returns.',
    duration: '6 Weeks',
    level: 'Intermediate',
    modules: [
      'Equity Valuation & Fundamental Analysis',
      'Index Funds, ETFs & Sector Dynamics',
      'Market Cycle Navigation',
      'Behavioral Economics & Bias Control',
    ],
  },
  {
    id: 2,
    code: '(03)',
    title: 'Budget Mastery',
    description: 'Gain control over your finances by learning how to create and maintain a successful budget.',
    duration: '4 Weeks',
    level: 'Foundational',
    modules: [
      'Dynamic Zero-Based Budgeting',
      'High-Yield Cash Management',
      'Debt Elimination Protocols',
      'Automated Expense Auditing',
    ],
  },
  {
    id: 3,
    code: '(04)',
    title: 'Financial Freedom',
    description: 'Explore strategies to gain financial independence, empowering you to secure your future.',
    duration: '10 Weeks',
    level: 'Advanced',
    modules: [
      'The FIRE Roadmap & Safe Withdrawal Rates',
      'Passive Income Stream Engineering',
      'Real Estate & Alternative Yields',
      'Estate Planning & Generational Wealth',
    ],
  },
];

export default function CoursesSection({
  activeCourse,
  onSelectCourse,
  onOpenCourseModal,
}: CoursesSectionProps) {
  return (
    <section id="courses-section" className="relative min-h-screen py-28 px-6 md:px-12 z-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF4D37]" />
              <span className="text-xs uppercase tracking-widest text-[#FF4D37] font-semibold">
                Curated Curriculum
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
              Financial Programs
            </h2>
          </div>
          <p className="text-sm text-[#888888] max-w-xs mt-3 md:mt-0">
            Hover or select any course to see its interactive 3D focus and deep dive into the curriculum.
          </p>
        </div>

        {/* Course Cards Stack */}
        <div className="flex flex-col gap-4">
          {COURSES_DATA.map((course, index) => {
            const isActive = activeCourse === index;

            return (
              <div
                key={course.id}
                onMouseEnter={() => onSelectCourse(index)}
                onClick={() => onSelectCourse(index)}
                className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive
                    ? 'bg-[#E83D24] shadow-2xl shadow-[#E83D24]/30 scale-[1.01]'
                    : 'bg-[#1C1C1C] hover:bg-[#222222] border border-white/5'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  {/* Left: Code & Title */}
                  <div className="flex items-center gap-5 sm:gap-8 min-w-[280px]">
                    <span
                      className={`text-sm sm:text-base font-mono transition-colors ${
                        isActive ? 'text-white/80' : 'text-[#707070]'
                      }`}
                    >
                      {course.code}
                    </span>
                    <h3
                      className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                        isActive ? 'text-white' : 'text-white group-hover:text-white'
                      }`}
                    >
                      {course.title}
                    </h3>

                    {/* Placeholder space where the 3D spiky red star sits in active state */}
                    <div className="w-16 h-12 hidden sm:block shrink-0 pointer-events-none" />
                  </div>

                  {/* Center: Description */}
                  <div className="flex-1 max-w-xl">
                    <p
                      className={`text-sm sm:text-base leading-relaxed transition-colors ${
                        isActive ? 'text-white/90' : 'text-[#8E8E8E]'
                      }`}
                    >
                      {course.description}
                    </p>
                  </div>

                  {/* Right: Go to course CTA */}
                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCourseModal(course);
                      }}
                      className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#141414] hover:bg-neutral-100 shadow-md'
                          : 'bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5'
                      }`}
                    >
                      <span>Go to course</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
