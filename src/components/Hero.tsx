import React from 'react';
import { ArrowDown, MapPin, Sparkles, Star, Calendar, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BUSINESS_INFO } from '../data/salonData';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenCalculator: () => void;
  onOpenBooking?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onOpenCalculator, onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-stone-200">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(244,114,182,0.12),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Information & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Location & Heritage Note */}
            <div className="inline-flex items-center gap-2 text-stone-600 text-xs sm:text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              <span className="text-stone-900 font-semibold">Circle C Mall, Quezon City</span>
              <span className="text-stone-400">·</span>
              <span>2nd Floor Atrium</span>
              <span className="text-stone-400">·</span>
              <span>5 Years of Excellence</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
              Affordable Luxury & Complete Beauty Care in Quezon City
            </h1>

            {/* Description matching Proposal's Problem & Scope */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to the official catalog of <strong className="font-semibold text-stone-900">Salon MD</strong>. 
              Explore our full menu of hair transformations, nail spas, lash extensions, waxing for men and women, full body massages, and convenient home service packages.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              {onOpenBooking && (
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-sm sm:text-base transition-colors shadow-md"
                >
                  <span>Book Appointment Now</span>
                </button>
              )}

              <a
                href="#catalog"
                onClick={onExploreCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm sm:text-base transition-colors shadow-sm"
              >
                <span>Browse Menu</span>
                <ArrowDown className="w-4 h-4 text-stone-300" />
              </a>

              <button
                onClick={onOpenCalculator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-semibold text-sm sm:text-base transition-colors"
              >
                <Sparkles className="w-4 h-4 text-rose-700" />
                <span>Estimate Package</span>
              </button>
            </div>

            {/* Subtle Domain Stats & Trust Points */}
            <div className="pt-6 sm:pt-8 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="font-serif text-2xl font-bold text-stone-900">24+</div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">Specialized Services</div>
              </div>

              <div>
                <div className="font-serif text-2xl font-bold text-stone-900">5 Yrs</div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">At Circle C Mall</div>
              </div>

              <div>
                <div className="font-serif text-2xl font-bold text-stone-900">₱120+</div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">Budget-Friendly Rates</div>
              </div>

              <div>
                <div className="font-serif text-2xl font-bold text-stone-900">QC</div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">Salon & Home Service</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 relative group">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                  alt="Salon MD Hair and Beauty Styling"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Badge */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent text-white">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span className="text-white ml-1">5-Star Community Favorite</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                    Salon MD · Circle C Mall
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    2nd Floor, Congressional Ave, Project 8, Quezon City
                  </p>
                </div>
              </div>

              {/* Floating Highlight Card 1: Rebond Special */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/80 max-w-[210px] hidden sm:block animate-float">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Monthly Highlight</div>
                <div className="text-xs font-bold text-stone-900 mt-0.5">Silk Rebond + Hair Spa</div>
                <div className="text-xs text-stone-500 font-medium">Promo ₱1,499 (Save ₱600)</div>
              </div>

              {/* Floating Highlight Card 2: Mall Location */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl border border-stone-800 max-w-[210px] hidden sm:block">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>2nd Floor Circle C</span>
                </div>
                <div className="text-xs text-stone-300 mt-0.5">Beside Central Escalator</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Daily 10:00 AM – 8:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
