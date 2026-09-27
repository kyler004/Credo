'use client';

import React from 'react';
import { X, Check, Clock, BarChart3, Award, ArrowRight } from 'lucide-react';
import { CourseItem } from './CoursesSection';

interface CourseDetailModalProps {
  course: CourseItem | null;
  onClose: () => void;
  onEnroll: (course: CourseItem) => void;
}

export default function CourseDetailModal({
  course,
  onClose,
  onEnroll,
}: CourseDetailModalProps) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-[#FF4D37]">{course.code}</span>
              <span className="text-xs text-[#888888] uppercase tracking-wider">
                Professional Certificate
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {course.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Overview Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-white/5 text-center text-xs">
          <div className="flex flex-col items-center gap-1">
            <Clock className="w-4 h-4 text-[#FF4D37]" />
            <span className="text-white font-medium">{course.duration}</span>
            <span className="text-[#888888]">Paced Learning</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BarChart3 className="w-4 h-4 text-[#FF4D37]" />
            <span className="text-white font-medium">{course.level}</span>
            <span className="text-[#888888]">Skill Tier</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Award className="w-4 h-4 text-[#FF4D37]" />
            <span className="text-white font-medium">Credo Certified</span>
            <span className="text-[#888888]">Credentials</span>
          </div>
        </div>

        <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
          {course.description} Designed by premier financial architects to deliver hands-on
          frameworks, automated tooling, and high-confidence decision making.
        </p>

        {/* Modules List */}
        <div className="mb-8">
          <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-3">
            Core Learning Modules
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {course.modules.map((mod, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-[#202020] border border-white/5 text-xs text-white"
              >
                <div className="w-4 h-4 rounded-full bg-[#FF4D37]/20 text-[#FF4D37] flex items-center justify-center text-[10px] shrink-0 font-bold">
                  {idx + 1}
                </div>
                <span className="truncate">{mod}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onEnroll(course)}
            className="bg-[#FF4D37] hover:bg-[#ff3720] text-white text-xs font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FF4D37]/30"
          >
            <span>Enroll Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
