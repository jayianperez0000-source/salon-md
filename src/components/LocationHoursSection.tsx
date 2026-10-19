import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Car, 
  Bus, 
  Calendar, 
  MessageSquare, 
  Compass,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/salonData';

export const LocationHoursSection: React.FC = () => {
  return (
    <section id="location" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            Priority Feature · Mall Location & Contact
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Visit Salon MD at Circle C Mall
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Conveniently situated along Congressional Avenue, Project 8, Quezon City. Enjoy air-conditioned comfort, easy parking, and accessible beauty services.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Floor Guide & Location Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Mall & Floor Card */}
              <div className="p-5 sm:p-6 bg-[#FAF7F2] border border-stone-200 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-rose-300" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">Exact Mall Location</span>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {BUSINESS_INFO.location.building} · 2nd Floor
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {BUSINESS_INFO.location.street}, {BUSINESS_INFO.location.city}
                </p>
                <div className="text-xs text-stone-500 font-medium pt-1">
                  Landmark: {BUSINESS_INFO.location.landmark}
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="p-5 sm:p-6 bg-[#FAF7F2] border border-stone-200 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-rose-300" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">Mall Operating Hours</span>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Monday – Sunday: 10:00 AM – 8:00 PM
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Open daily including public holidays. Walk-ins are always welcomed!
                </p>
                <div className="text-xs text-emerald-700 font-semibold pt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Currently Open for Service</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step 2nd Floor Guide */}
            <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-700" />
                Step-by-Step: How to Find Salon MD Inside Circle C Mall
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Enter through Circle C Mall main entrance along Congressional Avenue.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Take the central escalator or customer elevator up to the <strong>2nd Floor</strong>.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Look toward the wellness and fashion corridor right next to the central atrium railing. Look for our lighted <strong>&quot;Salon MD&quot;</strong> logo and entrance!</span>
                </div>
              </div>
            </div>

            {/* Commuter & Parking Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                  <Car className="w-4 h-4 text-stone-700" />
                  <span>Mall Parking</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Spacious basement and open-air surface parking available inside Circle C Mall compound.
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                  <Bus className="w-4 h-4 text-stone-700" />
                  <span>Public Commute</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Congressional Ave jeepneys (Muñoz, Novaliches, Tandang Sora) drop off directly in front of Circle C Mall gate.
                </p>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="p-6 bg-gradient-to-r from-stone-900 to-rose-950 text-white rounded-2xl shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Have Questions or Need Directions?</h3>
                  <p className="text-xs text-stone-300">Call our front desk stylist directly</p>
                </div>
                <div className="font-mono text-base font-bold text-rose-200">
                  {BUSINESS_INFO.contact.phone}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
                <a
                  href={`tel:${BUSINESS_INFO.contact.phone.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-stone-900 font-semibold text-xs hover:bg-stone-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Landline</span>
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.contact.mobile}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Mobile ({BUSINESS_INFO.contact.mobile})</span>
                </a>

                <a
                  href={`sms:${BUSINESS_INFO.contact.mobile}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-semibold text-xs hover:bg-stone-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send SMS</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Frame */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FAF7F2] p-2 rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 relative">
                <iframe
                  title="Circle C Mall Location Map"
                  src={BUSINESS_INFO.location.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">Circle C Mall, Congressional Ave</span>
                  <span className="text-stone-500">Quezon City</span>
                </div>

                <a
                  href={BUSINESS_INFO.location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-rose-300" />
                  <span>Open in Google Maps / Waze</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </div>

            {/* In-Salon Amenities */}
            <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                Salon MD Amenities:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fully Air-Conditioned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Private Massage Room</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Customer Wi-Fi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Complimentary Hot Tea</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
