import React from 'react';
import { Home, CalendarCheck, Sparkles, MapPin, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';
import { BUSINESS_INFO } from '../data/salonData';

interface HomeServiceSectionProps {
  onOpenCalculator: () => void;
}

export const HomeServiceSection: React.FC<HomeServiceSectionProps> = ({ onOpenCalculator }) => {
  const steps = [
    {
      num: "01",
      title: "Choose Your Services",
      desc: "Select hair rebonding, family mani-pedi, waxing, or event makeup from our catalog or pamper calculator."
    },
    {
      num: "02",
      title: "Set Your QC Address & Time",
      desc: "Send us your preferred date and residential location within Quezon City or neighboring Metro Manila areas."
    },
    {
      num: "03",
      title: "Salon-Grade Pampering at Home",
      desc: "Our sanitized, experienced senior stylists arrive with all portable equipment and materials ready to go."
    }
  ];

  const benefits = [
    "Ideal for mothers with infants & young children who cannot visit the mall",
    "Family bonding: simultaneous group mani-pedis & foot spa in your living room",
    "Stress-free event preparation for weddings, graduations, and reunions",
    "Hygienic single-use towels, sterilized tools, and salon-grade professional products"
  ];

  return (
    <section id="home-service" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-12 lg:p-16 overflow-hidden relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
                <Home className="w-3.5 h-3.5" />
                Featured In Proposal · Home Service
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
                Can&apos;t Make It to the Mall? We Bring the Salon to You.
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                As detailed in our proposal, Salon MD provides full on-location home service options for clients who prefer relaxing in the privacy and comfort of their own homes.
              </p>

              {/* Benefits Checklist */}
              <div className="space-y-3 pt-2">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onOpenCalculator}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-rose-300" />
                  <span>Build Home Service Package</span>
                </button>

                <a
                  href={`sms:${BUSINESS_INFO.contact.mobile}?body=${encodeURIComponent(
                    "Hello Salon MD! I would like to inquire regarding your Home Service availability and transportation fee for my area in Quezon City. Thanks!"
                  )}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-semibold text-xs sm:text-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-rose-700" />
                  <span>Send SMS Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right: Steps & Coverage Map Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-5">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  How Home Service Works
                </h3>

                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.num} className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {step.num}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 text-xs sm:text-sm">{step.title}</div>
                        <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coverage Notice */}
                <div className="pt-4 border-t border-stone-200 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-700" />
                    <span>Quezon City Coverage Areas:</span>
                  </div>
                  <p className="text-stone-500 leading-relaxed">
                    Project 8, Congressional Ave, Mindanao Ave, Bahay Toro, Tandang Sora, Visayas Ave, Muñoz, North EDSA, and nearby districts. Modest transpo subsidy applies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
