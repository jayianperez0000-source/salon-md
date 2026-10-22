import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  GraduationCap, 
  Facebook, 
  Heart,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BUSINESS_INFO, PROPOSAL_META } from '../data/salonData';

interface FooterProps {
  onOpenProposal: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProposal, onOpenAdmin }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & About Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-500/30 flex items-center justify-center text-rose-200 font-serif font-bold text-lg">
                MD
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white block">
                  Salon MD
                </span>
                <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold">
                  Circle C Mall · 2nd Floor
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Hair, nails, lashes, waxing, massage, and home beauty service business operating for 5 years at Circle C Mall, Congressional Avenue, Project 8, Quezon City.
            </p>

            <div className="pt-2 flex items-center gap-3 text-stone-400 text-xs">
              <span className="font-semibold text-stone-200">Payment Accepted:</span>
              <span>Cash · GCash · Maya · Bank Transfer</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Menu & Showcase
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#catalog" className="hover:text-rose-300 transition-colors">
                  Hair & Rebonding
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-rose-300 transition-colors">
                  Nails & Foot Spa
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-rose-300 transition-colors">
                  Lashes & Brows
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-rose-300 transition-colors">
                  Waxing (Men & Women)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-rose-300 transition-colors">
                  Full Body Massage
                </a>
              </li>
              <li>
                <a href="#home-service" className="hover:text-rose-300 transition-colors">
                  QC Home Service
                </a>
              </li>
            </ul>
          </div>

          {/* Visit & Connect Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Location & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>2nd Floor, Circle C Mall, Congressional Ave, Project 8, Quezon City</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span>10:00 AM – 8:00 PM Daily (Mall Hours)</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>(02) 8920-5542 · {BUSINESS_INFO.contact.mobile}</span>
              </div>
            </div>

            {/* Social Media Link */}
            <div className="pt-3">
              <a
                href={BUSINESS_INFO.contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-semibold transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                <span>Visit Facebook Page</span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </a>
            </div>
          </div>

          {/* Academic Capstone Project Box */}
          <div className="lg:col-span-3 space-y-3">
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>BSIT Capstone Proposal</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Developed for <strong>{PROPOSAL_META.course}</strong> under instructor <strong>{PROPOSAL_META.instructor}</strong>.
              </p>
              <div className="text-[11px] text-stone-400 space-y-0.5">
                <div>• Perez, Jay-Ian</div>
                <div>• Garcia, Danica</div>
                <div>• Lanugan, Lizyl</div>
              </div>
              <button
                onClick={onOpenProposal}
                className="w-full text-center py-2 px-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                View Full Proposal Specs
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} Salon MD. All rights reserved. Circle C Mall, Quezon City.</span>
            {onOpenAdmin && (
              <>
                <span className="hidden sm:inline text-stone-700">|</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-rose-400 text-stone-400 transition-colors flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                  <span>Admin & Database Portal</span>
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Built with care for BSIT LFSA411A034</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
