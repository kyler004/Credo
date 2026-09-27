'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Credo3DScene from '@/components/Credo3DScene';
import BenefitsSection from '@/components/BenefitsSection';
import CoursesSection, { CourseItem, COURSES_DATA } from '@/components/CoursesSection';
import ValuesSection from '@/components/ValuesSection';
import SubscribeFooterSection from '@/components/SubscribeFooterSection';
import CourseDetailModal from '@/components/CourseDetailModal';
import GetStartedModal from '@/components/GetStartedModal';
import StageScrubber from '@/components/StageScrubber';
import { ArrowDown } from 'lucide-react';

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [selectedCourseModal, setSelectedCourseModal] = useState<CourseItem | null>(null);
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  // Measure scroll progress and active section dynamically
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);

      // Section identification by viewport positions
      const sectionElements = [
        { id: 'hero-section', name: 'hero' },
        { id: 'elevate-section', name: 'elevate' },
        { id: 'discover-section', name: 'discover' },
        { id: 'path-section', name: 'path' },
        { id: 'benefits-section', name: 'benefits' },
        { id: 'courses-section', name: 'courses' },
        { id: 'values-section', name: 'values' },
        { id: 'footer-section', name: 'footer' },
      ];

      const vhMid = window.innerHeight * 0.45;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionElements[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= vhMid) {
            setActiveSection(sectionElements[i].name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to stage handler
  const handleJumpStage = (stageId: string) => {
    setActiveSection(stageId);
    const targetMap: Record<string, string> = {
      hero: 'hero-section',
      elevate: 'elevate-section',
      discover: 'discover-section',
      path: 'path-section',
      benefits: 'benefits-section',
      courses: 'courses-section',
      values: 'values-section',
      footer: 'footer-section',
    };
    const elId = targetMap[stageId];
    if (elId) {
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleEnroll = (course: CourseItem) => {
    setSelectedCourseModal(null);
    setEnrollSuccessMessage(`You have enrolled in ${course.title}!`);
    setTimeout(() => setEnrollSuccessMessage(null), 4000);
  };

  return (
    <main className="relative min-h-screen bg-[#141414] text-white selection:bg-[#FF4D37] selection:text-white">
      {/* 3D Three.js WebGL Scene Canvas Background */}
      <Credo3DScene
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        activeCourseIndex={activeCourseIndex}
        interactive={true}
      />

      {/* Navigation Header */}
      <Navbar
        onSelectCourse={(idx) => {
          setActiveCourseIndex(idx);
          const el = document.getElementById('courses-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenGetStarted={() => setGetStartedModalOpen(true)}
      />

      {/* Enrollment Toast Notification */}
      {enrollSuccessMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#FF4D37] text-white text-xs font-semibold px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {enrollSuccessMessage}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION ("CREDO") - Frame 00:00                        */}
      {/* ------------------------------------------------------------- */}
      <section
        id="hero-section"
        className="relative min-h-screen flex flex-col items-center justify-between pt-36 pb-12 px-6 text-center z-20"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white mb-4 uppercase select-none">
            CREDO
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#9A9A9A] max-w-xl font-normal leading-relaxed">
            Take control of your finances with ease, empowering yourself to navigate
            decisions confidently.
          </p>
        </div>

        {/* Spatial anchor for the 3D model in center */}
        <div className="w-full h-48 md:h-64 pointer-events-none" />

        {/* Scroll Cue */}
        <div
          onClick={() => handleJumpStage('elevate')}
          className="flex flex-col items-center gap-2 text-xs text-[#707070] hover:text-white cursor-pointer transition-colors group pb-4"
        >
          <span className="tracking-widest uppercase text-[11px] font-mono">
            Scroll to discover
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#FF4D37]" />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. ELEVATE SECTION (Shell Explodes) - Frames 00:01 - 00:04    */}
      {/* ------------------------------------------------------------- */}
      <section
        id="elevate-section"
        className="relative min-h-screen flex items-center justify-center px-6 z-20 pointer-events-none"
      >
        <div className="max-w-7xl w-full text-center">
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase leading-none opacity-90 select-none">
            Elevate Your <br className="hidden sm:inline" /> Finances
          </h2>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. DISCOVER SECTION (Glass Shatters) - Frames 00:05 - 00:07   */}
      {/* ------------------------------------------------------------- */}
      <section
        id="discover-section"
        className="relative min-h-screen flex items-center justify-center px-6 z-20 pointer-events-none"
      >
        <div className="max-w-5xl w-full text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-tight select-none">
            Discover and choose <br /> your ideal course
          </h2>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FINANCIAL PATH SECTION - Frames 00:08 - 00:09              */}
      {/* ------------------------------------------------------------- */}
      <section
        id="path-section"
        className="relative min-h-[90vh] flex flex-col items-center justify-start pt-24 pb-48 px-6 text-center z-20 pointer-events-none"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase mb-4">
            Find Your Perfect <br /> Financial Path
          </h2>
          <p className="text-sm sm:text-base text-[#9A9A9A] max-w-md mx-auto leading-relaxed">
            Explore tailored courses designed to match your financial goals and
            learning style.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. BENEFITS SECTION (Interactive Gauge) - Frames 00:10 - 00:12 */}
      {/* ------------------------------------------------------------- */}
      <BenefitsSection onOpenGetStarted={() => setGetStartedModalOpen(true)} />

      {/* ------------------------------------------------------------- */}
      {/* 6. COURSES SECTION (3D Core Anchor) - Frames 00:13 - 00:17    */}
      {/* ------------------------------------------------------------- */}
      <CoursesSection
        activeCourse={activeCourseIndex}
        onSelectCourse={(idx) => setActiveCourseIndex(idx)}
        onOpenCourseModal={(course) => setSelectedCourseModal(course)}
      />

      {/* ------------------------------------------------------------- */}
      {/* 7. VALUES SECTION (Orbiting Core) - Frames 00:18 - 00:20      */}
      {/* ------------------------------------------------------------- */}
      <ValuesSection />

      {/* ------------------------------------------------------------- */}
      {/* 8. SUBSCRIBE & FOOTER - Frames 00:21 - 00:23                  */}
      {/* ------------------------------------------------------------- */}
      <SubscribeFooterSection
        onSelectCourse={(idx) => {
          setActiveCourseIndex(idx);
          const el = document.getElementById('courses-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Interactive Stage Scrubber / Timeline Controller */}
      <StageScrubber
        currentStage={activeSection}
        onJumpStage={handleJumpStage}
        scrollProgress={scrollProgress}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourseModal}
        onClose={() => setSelectedCourseModal(null)}
        onEnroll={handleEnroll}
      />

      {/* Get Started Onboarding Modal */}
      <GetStartedModal
        isOpen={getStartedModalOpen}
        onClose={() => setGetStartedModalOpen(false)}
        onSelectCourse={(idx) => {
          setActiveCourseIndex(idx);
          const el = document.getElementById('courses-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </main>
  );
}
