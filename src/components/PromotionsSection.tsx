import React from 'react';
import { Sparkles, Check, Clock, Tag, MessageSquare, ArrowRight } from 'lucide-react';
import { MONTHLY_PROMOTIONS, BUSINESS_INFO } from '../data/salonData';

interface PromotionsSectionProps {
  onSelectPromo: (promoId: string) => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ onSelectPromo }) => {
  return (
    <section id="promos" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            Priority Feature · Monthly Promotions
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Special Monthly Deals & Beauty Packages
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Exclusive bundled savings at Salon MD Circle C Mall. Enjoy premium salon quality at friendly prices designed for mothers, students, and budget-conscious residents.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {MONTHLY_PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#FAF7F2] rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Image & Ribbon */}
              <div className="relative aspect-[16/9] overflow-hidden bg-stone-200">
                <img
                  src={promo.featuredImage}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-rose-700 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg shadow">
                  {promo.tag}
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white font-medium text-xs px-2.5 py-1 rounded-lg">
                  {promo.validity}
                </div>
              </div>

              {/* Promo Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-rose-700 tracking-wider uppercase block">
                      {promo.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                      {promo.title}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {promo.description}
                  </p>

                  {/* Included Services Checklist */}
                  <div className="space-y-2 pt-2 border-t border-stone-200/80">
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                      Package Inclusions:
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700">
                      {promo.includedServices.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                        ₱{promo.promoPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-stone-400 line-through">
                        ₱{promo.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">
                      You save ₱{promo.savings.toLocaleString()}!
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onSelectPromo(promo.id)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
                    >
                      <span>Book Promo</span>
                    </button>

                    <a
                      href={`sms:${BUSINESS_INFO.contact.mobile}?body=${encodeURIComponent(
                        `Hi Salon MD Circle C Mall! I'm inquiring about the "${promo.title}" promo for ₱${promo.promoPrice.toLocaleString()}. Please let me know available slots. Thanks!`
                      )}`}
                      className="inline-flex items-center justify-center p-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
                      title="Send SMS inquiry"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Community Discount Banner */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-stone-900 to-rose-950 text-white rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-rose-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Special Community Privilege
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              10% Discount for Students, Teachers & Circle C Mall Employees
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
              Present your valid school ID or Mall Staff ID at our 2nd floor cashier counter to enjoy 10% off any single regular service (haircut, manicure, lash lift, or massage)!
            </p>
          </div>

          <a
            href={`tel:${BUSINESS_INFO.contact.phone.replace(/[^0-9]/g, '')}`}
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-semibold text-xs sm:text-sm transition-colors shadow-sm"
          >
            Inquire at (02) 8920-5542
          </a>
        </div>
      </div>
    </section>
  );
};
