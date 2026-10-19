import React from 'react';
import { X, GraduationCap, CheckCircle2, User, Calendar, BookOpen, Building2 } from 'lucide-react';
import { PROPOSAL_META, BUSINESS_INFO } from '../data/salonData';

interface ProposalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalInfoModal: React.FC<ProposalInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold tracking-wide border border-rose-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                ACADEMIC PROPOSAL SHOWCASE
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Website / Application Proposal
              </h2>
              <p className="text-stone-300 text-sm">
                Project for Salon MD · Circle C Mall, Quezon City
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm">
            <div>
              <span className="text-stone-400 block text-xs uppercase tracking-wider">Class / Course</span>
              <span className="font-semibold text-rose-200">{PROPOSAL_META.course}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-xs uppercase tracking-wider">Date Submitted</span>
              <span className="font-semibold text-stone-200">{PROPOSAL_META.submissionDate}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-xs uppercase tracking-wider">Course Instructor</span>
              <span className="font-semibold text-stone-200">{PROPOSAL_META.instructor}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-xs uppercase tracking-wider">Application Type</span>
              <span className="font-semibold text-stone-200">Web Showcase / Catalog</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Student Proponents */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-700" />
              Student Proponents
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {PROPOSAL_META.students.map((student, i) => (
                <div key={i} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="font-bold text-stone-900 text-sm">{student.name}</div>
                  <div className="text-xs text-rose-800 font-medium mt-0.5">{student.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Problem Statement */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-700" />
              The Business Problem (Section 2)
            </h4>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              &quot;Salon MD currently has a Facebook page, but it is inactive and no longer serves as an effective platform for reaching customers. As a result, the business lacks sufficient online exposure to showcase its services, ongoing promotions, and contact information. This limits the ability of potential customers to discover what Salon MD offers.&quot;
            </p>
          </div>

          {/* Solution & Implementation Features */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Proposal Feature Matrix Implemented (Section 4)
            </h3>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <div className="p-3 bg-stone-50 font-semibold text-stone-700 grid grid-cols-12 gap-2">
                <span className="col-span-4">Feature Name</span>
                <span className="col-span-6">Implementation Details</span>
                <span className="col-span-2 text-right">Priority</span>
              </div>
              
              <div className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-stone-50/50">
                <span className="col-span-4 font-semibold text-stone-900">Categorized Service Catalog</span>
                <span className="col-span-6 text-stone-600">Hair, nails, lashes, waxing, massage, makeup & home service with search & filters</span>
                <span className="col-span-2 text-right font-bold text-emerald-700">Must (100%)</span>
              </div>

              <div className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-stone-50/50">
                <span className="col-span-4 font-semibold text-stone-900">Promotions Display</span>
                <span className="col-span-6 text-stone-600">Monthly package deals with clear savings & included services</span>
                <span className="col-span-2 text-right font-bold text-emerald-700">Must (100%)</span>
              </div>

              <div className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-stone-50/50">
                <span className="col-span-4 font-semibold text-stone-900">Contact & Location Info</span>
                <span className="col-span-6 text-stone-600">Circle C Mall 2nd Floor guide, floor map directions, landline & mobile CTAs</span>
                <span className="col-span-2 text-right font-bold text-emerald-700">Must (100%)</span>
              </div>

              <div className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-stone-50/50">
                <span className="col-span-4 font-semibold text-stone-900">Photo Gallery</span>
                <span className="col-span-6 text-stone-600">High-resolution showcase of hair, nail art, lash looks & salon interior</span>
                <span className="col-span-2 text-right font-bold text-blue-700">Should (100%)</span>
              </div>

              <div className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-stone-50/50">
                <span className="col-span-4 font-semibold text-stone-900">Social Media & Direct Connect</span>
                <span className="col-span-6 text-stone-600">Facebook links, Viber quick messaging & interactive Pamper Package Estimator</span>
                <span className="col-span-2 text-right font-bold text-purple-700">Nice + Bonus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div>
            LFSA411A034 Capstone · Ready for presentation & demonstration
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors w-full sm:w-auto"
          >
            Explore Live Salon MD Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
