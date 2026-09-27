'use client';

import React, { useState } from 'react';
import { Instagram, Facebook, Github, Linkedin, CheckCircle2, ArrowRight } from 'lucide-react';

interface SubscribeFooterProps {
  onSelectCourse: (index: number) => void;
}

export default function SubscribeFooterSection({ onSelectCourse }: SubscribeFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <footer id="footer-section" className="relative pt-24 pb-16 px-6 md:px-12 z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20">
          {/* Left Column: Subscribe */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05] mb-8">
                Subscribe <br />
                for updates
              </h2>

              {subscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-[#FF4D37]/40 text-white max-w-md animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#FF4D37] shrink-0" />
                  <span className="text-sm font-medium">
                    Thank you! You are now subscribed to Credo insights.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your e-mail"
                      className="w-full bg-[#1C1C1C] border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-[#707070] focus:outline-none focus:border-[#FF4D37] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#FF4D37] hover:bg-[#ff3720] text-white text-xs font-semibold px-6 py-3 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap shadow-lg shadow-[#FF4D37]/25"
                  >
                    Get Updates
                  </button>
                </form>
              )}
              {error && <p className="text-xs text-red-400 mt-2 ml-4">{error}</p>}
            </div>
          </div>

          {/* Right Column: Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
                Courses
              </h4>
              <ul className="space-y-2.5 text-[#888888]">
                <li>
                  <button
                    onClick={() => onSelectCourse(0)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Wealth Builder
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectCourse(1)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Smart Investing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectCourse(2)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Budget Mastery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectCourse(3)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Financial Freedom
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2.5 text-[#888888]">
                <li>
                  <a href="#benefits-section" className="hover:text-white transition-colors">
                    Case studies
                  </a>
                </li>
                <li>
                  <a href="#benefits-section" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#benefits-section" className="hover:text-white transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#benefits-section" className="hover:text-white transition-colors">
                    Calculators
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-2.5 text-[#888888]">
                <li>
                  <a href="#values-section" className="hover:text-white transition-colors">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#values-section" className="hover:text-white transition-colors">
                    Help center
                  </a>
                </li>
                <li>
                  <a href="#values-section" className="hover:text-white transition-colors">
                    Community forum
                  </a>
                </li>
                <li>
                  <a href="#values-section" className="hover:text-white transition-colors">
                    Mentorship
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
                About us
              </h4>
              <ul className="space-y-2.5 text-[#888888]">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press kit
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar: Copyright & Socials */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707070]">
          <div>© 2024 Credo. All rights reserved.</div>

          <div className="flex items-center space-x-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
