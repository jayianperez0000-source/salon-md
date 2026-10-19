import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Copy, Check, MessageSquare, Phone, Sparkles, Clock, MapPin } from 'lucide-react';
import { ServiceItem } from '../types';
import { BUSINESS_INFO } from '../data/salonData';

interface PackageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: { [serviceId: string]: number };
  allServices: ServiceItem[];
  onUpdateQuantity: (serviceId: string, delta: number) => void;
  onRemoveService: (serviceId: string) => void;
  onClearAll: () => void;
  onProceedToBooking?: (selectedServices: { [serviceId: string]: number }) => void;
}

export const PackageCalculatorModal: React.FC<PackageCalculatorModalProps> = ({
  isOpen,
  onClose,
  selectedServices,
  allServices,
  onUpdateQuantity,
  onRemoveService,
  onClearAll,
  onProceedToBooking
}) => {
  const [copied, setCopied] = useState(false);
  const [clientName, setClientName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [serviceType, setServiceType] = useState<'salon' | 'home'>('salon');

  if (!isOpen) return null;

  // Compute selected items details
  const items = Object.entries(selectedServices)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const service = allServices.find(s => s.id === id);
      return { service, qty };
    })
    .filter((item): item is { service: ServiceItem; qty: number } => Boolean(item.service));

  const totalCount = items.reduce((acc, curr) => acc + curr.qty, 0);
  const subtotal = items.reduce((acc, curr) => acc + (curr.service.price * curr.qty), 0);
  const totalDurationMinutes = items.reduce((acc, curr) => acc + (curr.service.durationMinutes * curr.qty), 0);

  // Bundle discount rule: if 3 or more services selected, give 10% pamper bundle savings!
  const hasBundleDiscount = totalCount >= 3;
  const bundleDiscount = hasBundleDiscount ? Math.round(subtotal * 0.10) : 0;
  const grandTotal = subtotal - bundleDiscount;

  const hours = Math.floor(totalDurationMinutes / 60);
  const mins = totalDurationMinutes % 60;
  const durationText = hours > 0 
    ? `${hours} hr${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} mins` : ''}`
    : `${mins} mins`;

  // Compose ready-made inquiry message
  const serviceListFormatted = items
    .map(i => `• ${i.service.name} (x${i.qty}) - ₱${(i.service.price * i.qty).toLocaleString()}`)
    .join('\n');

  const inquiryMessage = `Hello Salon MD Circle C Mall!

I would like to inquire about availability for the following services:
${serviceListFormatted}

📍 Service Location: ${serviceType === 'home' ? 'Home Service (Quezon City)' : 'Circle C Mall, 2nd Floor'}
${preferredDate ? `🗓️ Preferred Date/Time: ${preferredDate}\n` : ''}${clientName ? `👤 Client Name: ${clientName}\n` : ''}
⏱️ Estimated Duration: ~${durationText}
💰 Estimated Total: ₱${grandTotal.toLocaleString()}${hasBundleDiscount ? ' (Includes 10% Multi-service Bundle Savings!)' : ''}

Looking forward to your confirmation. Thank you!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inquiryMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleViberInquiry = () => {
    const encoded = encodeURIComponent(inquiryMessage);
    window.open(`sms:${BUSINESS_INFO.contact.mobile}?body=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Pamper Package Builder
              </h3>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm">
              Calculate your total estimate and send an instant inquiry to Salon MD
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-stone-800">Your Pamper Package is Empty</h4>
                <p className="text-sm text-stone-500 max-w-sm mx-auto">
                  Browse our service catalog and click &quot;Add to Package&quot; to calculate your price estimate and create your custom appointment inquiry.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-rose-700 text-white rounded-xl text-sm font-medium hover:bg-rose-800 transition-colors"
              >
                Browse Services Now
              </button>
            </div>
          ) : (
            <>
              {/* Service list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold tracking-wider uppercase">
                  <span>Selected Services ({totalCount})</span>
                  <button 
                    onClick={onClearAll}
                    className="text-stone-400 hover:text-rose-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                  {items.map(({ service, qty }) => (
                    <div key={service.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-white hover:bg-stone-50/50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-stone-900 text-sm truncate">{service.name}</div>
                        <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>₱{service.price.toLocaleString()} each</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {service.durationMinutes} mins
                          </span>
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            onClick={() => onUpdateQuantity(service.id, -1)}
                            className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-stone-800">{qty}</span>
                          <button
                            onClick={() => onUpdateQuantity(service.id, 1)}
                            className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="font-bold text-stone-900 text-sm">
                            ₱{(service.price * qty).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveService(service.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                          aria-label="Remove service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Venue Selector */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Where would you like to be pampered?
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceType('salon')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      serviceType === 'salon'
                        ? 'border-rose-700 bg-rose-50/50 ring-1 ring-rose-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-xs sm:text-sm">In-Salon Visit</div>
                    <div className="text-xs text-stone-500 mt-0.5">Circle C Mall, 2nd Floor, QC</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('home')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      serviceType === 'home'
                        ? 'border-rose-700 bg-rose-50/50 ring-1 ring-rose-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-xs sm:text-sm">Home Service</div>
                    <div className="text-xs text-stone-500 mt-0.5">Quezon City & Nearby</div>
                  </button>
                </div>

                {/* Optional Inquiry Details */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-stone-600 block mb-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Santos"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-600 block mb-1">Target Date / Time (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Saturday afternoon"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* Estimate Summary */}
              <div className="p-4 sm:p-5 bg-rose-50/40 border border-rose-100 rounded-xl space-y-3">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Estimated Total Time:</span>
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-700" />
                    ~{durationText}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-stone-600">
                  <span>Catalog Subtotal:</span>
                  <span className="font-semibold text-stone-900">₱{subtotal.toLocaleString()}</span>
                </div>

                {hasBundleDiscount ? (
                  <div className="flex justify-between text-sm text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Multi-Service Bundle Savings (10%):
                    </span>
                    <span>-₱{bundleDiscount.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="text-xs text-stone-500 italic">
                    💡 Tip: Select 3 or more services to unlock our 10% Pamper Bundle Discount!
                  </div>
                )}

                <div className="pt-3 border-t border-rose-200/60 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-stone-500 block">Total Estimated Cost</span>
                    <span className="text-xs text-stone-500">Payable via Cash / GCash / Maya at Salon</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-rose-950">
                    ₱{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row gap-2.5">
            {onProceedToBooking && (
              <button
                onClick={() => onProceedToBooking(selectedServices)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-800 hover:bg-rose-900 font-bold text-white text-sm transition-colors shadow-sm"
              >
                <span>Book Package & Pay Deposit (25%)</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 font-semibold text-stone-800 text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-600" />
                  <span>Copy SMS Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleViberInquiry}
              className="inline-flex items-center justify-center p-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors"
              title="Send SMS"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
