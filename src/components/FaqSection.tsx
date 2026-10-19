import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { FREQUENT_QUESTIONS, BUSINESS_INFO } from '../data/salonData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Customer Questions & Policies
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Everything you need to know about our services, Circle C Mall location, and booking process.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3.5">
          {FREQUENT_QUESTIONS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleQuestion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-stone-900">
                    {item.q}
                  </span>
                  <span className={`p-1 rounded-lg ${isOpen ? 'bg-rose-50 text-rose-700' : 'text-stone-400'}`}>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-stone-600 leading-relaxed border-t border-stone-100 mt-2 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Box */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-stone-200 text-center space-y-3">
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Have a question not listed here?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Feel free to give us a call or send a quick SMS to our salon mobile. Our stylists are happy to assist you!
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${BUSINESS_INFO.contact.phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Call (02) 8920-5542
            </a>
            <a
              href={`sms:${BUSINESS_INFO.contact.mobile}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS {BUSINESS_INFO.contact.mobile}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
