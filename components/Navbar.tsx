'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  onSelectCourse?: (index: number) => void;
  onOpenGetStarted?: () => void;
}

export default function Navbar({ onSelectCourse, onOpenGetStarted }: NavbarProps) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const courses = [
    { title: 'Wealth Builder', desc: 'Long-term strategies & portfolio architecture', id: 0 },
    { title: 'Smart Investing', desc: 'Market analysis & informed capital allocation', id: 1 },
    { title: 'Budget Mastery', desc: 'Cashflow control & expenditure optimization', id: 2 },
    { title: 'Financial Freedom', desc: 'Independent wealth & retirement trajectory', id: 3 },
  ];

  const handleCourseClick = (index: number) => {
    setCoursesOpen(false);
    setMobileMenuOpen(false);
    if (onSelectCourse) onSelectCourse(index);
    const el = document.getElementById('courses-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#141414]/85 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Zone */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center hover:opacity-90 transition-opacity"
        >
          <span>CREDO</span>
          <span className="text-[#FF4D37]">.</span>
        </a>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-[#A0A0A0]">
          {/* Courses with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCoursesOpen(true)}
            onMouseLeave={() => setCoursesOpen(false)}
          >
            <button
              onClick={() => scrollTo('courses-section')}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1"
            >
              <span>Courses</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  coursesOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {coursesOpen && (
              <div className="absolute top-full -left-4 w-72 bg-[#1C1C1C] border border-white/10 rounded-xl p-2 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-white/5 mb-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#737373] font-semibold">
                    Curated Curriculum
                  </span>
                </div>
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/5 transition-colors flex flex-col group cursor-pointer"
                  >
                    <span className="text-sm font-medium text-white group-hover:text-[#FF4D37] transition-colors">
                      {course.title}
                    </span>
                    <span className="text-xs text-[#808080] line-clamp-1">
                      {course.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => scrollTo('benefits-section')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Resources
          </button>
          <button
            onClick={() => scrollTo('values-section')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Support
          </button>
          <button
            onClick={() => scrollTo('footer-section')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About us
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenGetStarted}
            className="bg-[#FF4D37] hover:bg-[#ff3720] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-[#FF4D37]/25 cursor-pointer whitespace-nowrap"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181818] border-b border-white/10 px-6 py-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4">
            <div className="pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider text-[#737373] font-semibold">
                Courses
              </span>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCourseClick(c.id)}
                    className="text-left text-sm text-white/90 hover:text-[#FF4D37] py-1.5"
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollTo('benefits-section')}
              className="text-left text-sm text-[#A0A0A0] hover:text-white py-1"
            >
              Resources & Benefits
            </button>
            <button
              onClick={() => scrollTo('values-section')}
              className="text-left text-sm text-[#A0A0A0] hover:text-white py-1"
            >
              Support & Values
            </button>
            <button
              onClick={() => scrollTo('footer-section')}
              className="text-left text-sm text-[#A0A0A0] hover:text-white py-1"
            >
              About us & Community
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenGetStarted) onOpenGetStarted();
              }}
              className="w-full bg-[#FF4D37] text-white text-sm font-semibold py-3 rounded-full mt-2 shadow-lg shadow-[#FF4D37]/30"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
