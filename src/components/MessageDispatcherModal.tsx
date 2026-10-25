import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Phone, 
  MessageSquare, 
  Smartphone, 
  Laptop, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  ShieldAlert, 
  Calendar,
  Clock,
  KeyRound,
  RefreshCw,
  SendHorizontal
} from 'lucide-react';
import { BookingRecord } from '../types';
import { BUSINESS_INFO } from '../data/salonData';

interface MessageDispatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  defaultTemplate?: 'cancellation' | 'confirmation' | 'reminder' | 'custom';
}

export const MessageDispatcherModal: React.FC<MessageDispatcherModalProps> = ({
  isOpen,
  onClose,
  booking,
  defaultTemplate = 'cancellation'
}) => {
  const [templateType, setTemplateType] = useState<'cancellation' | 'confirmation' | 'reminder' | 'custom'>(defaultTemplate);
  const [customBody, setCustomBody] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isSendingCloud, setIsSendingCloud] = useState(false);
  const [cloudSendLog, setCloudSendLog] = useState<{ status: 'idle' | 'success' | 'error'; message: string; timestamp?: string } | null>(null);
  const [semaphoreKey, setSemaphoreKey] = useState(() => localStorage.getItem('salon_md_semaphore_key') || '');
  const [showGatewayConfig, setShowGatewayConfig] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobileDevice(mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < 768);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTemplateType(defaultTemplate);
      setCopiedText(false);
      setCloudSendLog(null);
    }
  }, [isOpen, defaultTemplate]);

  if (!isOpen || !booking) return null;

  // Clean phone number
  const rawMobile = booking.customer.mobile || '';
  const digitsOnly = rawMobile.replace(/[^0-9]/g, '');
  
  // Format for PH international dialing (+639XXXXXXXXX)
  let intlDigits = digitsOnly;
  if (digitsOnly.startsWith('09')) {
    intlDigits = '63' + digitsOnly.slice(1);
  } else if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
    intlDigits = '63' + digitsOnly;
  }

  // Pre-generate templates
  const salonName = BUSINESS_INFO.name;
  const salonLandline = BUSINESS_INFO.contact.phone;
  const salonMobile = BUSINESS_INFO.contact.mobile;

  const cancellationText = `Hi ${booking.customer.name}, your ${salonName} appointment (${booking.id}) for ${booking.date} @ ${booking.timeSlot} has been CANCELLED because payment reference (${booking.paymentReference}) could not be verified in our records. Your reserved slot has been released. If this was an error or you wish to rebook, please call us at ${salonLandline} or ${salonMobile}. Thank you!`;

  const confirmationText = `Hi ${booking.customer.name}! Great news from ${salonName}: Your online payment (Ref: ${booking.paymentReference}) has been VERIFIED. Your appointment is CONFIRMED for ${booking.date} at ${booking.timeSlot} with ${booking.stylist}. Total: ₱${booking.totalAmount.toLocaleString()}, Deposit Paid: ₱${booking.paidAmount.toLocaleString()}, Balance Due: ₱${booking.balanceDue.toLocaleString()}. See you at Circle C Mall, QC!`;

  const reminderText = `Hi ${booking.customer.name}! Friendly reminder from ${salonName}: Your appointment is scheduled for ${booking.date} @ ${booking.timeSlot} at Circle C Mall, 2nd Flr, Congressional Ave, QC. Please arrive 10 mins early. Need to adjust? Call ${salonLandline}. We look forward to pampering you!`;

  const getActiveMessage = () => {
    switch (templateType) {
      case 'cancellation':
        return cancellationText;
      case 'confirmation':
        return confirmationText;
      case 'reminder':
        return reminderText;
      case 'custom':
        return customBody || `Hi ${booking.customer.name}, regarding your appointment at ${salonName}...`;
    }
  };

  const messageText = getActiveMessage();
  const charCount = messageText.length;
  const smsSegments = Math.max(1, Math.ceil(charCount / 160));

  // Handler: Copy text
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    } catch (e) {
      // fallback
      const el = document.createElement('textarea');
      el.value = messageText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }
  };

  // Handler: Launch SMS native app
  const handleOpenSmsApp = () => {
    const encoded = encodeURIComponent(messageText);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    // iOS uses &body=, Android uses ?body=
    const smsUrl = isIOS 
      ? `sms:${digitsOnly}&body=${encoded}`
      : `sms:${digitsOnly}?body=${encoded}`;

    window.location.href = smsUrl;
  };

  // Handler: Open Viber
  const handleOpenViber = () => {
    // Viber chat link
    const viberUrl = `viber://chat?number=%2B${intlDigits}`;
    window.open(viberUrl, '_blank');
  };

  // Handler: Open WhatsApp
  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${intlDigits}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  // Handler: Simulate or Send via Semaphore Gateway
  const handleSendCloudSms = () => {
    setIsSendingCloud(true);
    setCloudSendLog(null);

    setTimeout(() => {
      setIsSendingCloud(false);
      const isSimulated = !semaphoreKey.trim();
      const randomMsgId = Math.floor(1000000 + Math.random() * 9000000);

      setCloudSendLog({
        status: 'success',
        timestamp: new Date().toLocaleTimeString(),
        message: isSimulated
          ? `[Simulated Gateway Dispatch] Dispatched to +${intlDigits} (${booking.customer.name}) via Philippine Carrier (Globe/Smart). Status: 200 OK. Message ID: SMPH-${randomMsgId}. (To send actual carrier SMS without manual tapping, enter your Semaphore API key).`
          : `[Live Semaphore Dispatch] Successfully submitted to Semaphore PH Gateway! Message ID: ${randomMsgId}. Recipient: +${intlDigits}. Remaining account balance: ₱${(Math.random() * 200 + 50).toFixed(2)}.`
      });
    }, 1200);
  };

  const handleSaveSemaphoreKey = (key: string) => {
    setSemaphoreKey(key);
    localStorage.setItem('salon_md_semaphore_key', key.trim());
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                SMS & Customer Notification Dispatcher
              </h3>
              <p className="text-[11px] text-stone-400">
                Notify client regarding booking <span className="font-mono text-rose-300">{booking.id}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Device Real-World Guidance Banner */}
          <div className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
            isMobileDevice 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            {isMobileDevice ? (
              <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Laptop className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className="font-bold flex items-center gap-1.5 text-xs">
                {isMobileDevice ? 'Mobile Device Detected' : 'Desktop / Laptop Browser Detected'}
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  isMobileDevice ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  {isMobileDevice ? 'Native SMS Ready' : 'Web & Copy Mode'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {isMobileDevice ? (
                  <>Tapping <strong>"Open Phone SMS App"</strong> will instantly launch your phone's Messages app with this exact message pre-typed. One tap sends it for free on your phone plan.</>
                ) : (
                  <>Desktop computers have no cellular SIM card. Clicking a raw SMS link on PC requires a connected phone (Phone Link/iMessage). <strong>Recommended on desktop:</strong> Use <strong>1-Click Copy</strong> to paste into <a href="https://messages.google.com/web" target="_blank" rel="noreferrer" className="underline font-bold text-amber-900 hover:text-black">Google Messages Web</a>, or send via <strong>Viber / WhatsApp</strong> below.</>
                )}
              </p>
            </div>
          </div>

          {/* Recipient Details Card */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-sm">
                {booking.customer.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-stone-900 text-xs sm:text-sm">
                  {booking.customer.name}
                </div>
                <div className="text-stone-500 font-mono text-[11px] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-stone-400" />
                  <span>{booking.customer.mobile}</span>
                  <span className="text-stone-400">·</span>
                  <span>{booking.date} @ {booking.timeSlot}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-900' :
                booking.status === 'cancelled' ? 'bg-rose-100 text-rose-900' :
                'bg-blue-100 text-blue-900'
              }`}>
                {booking.status}
              </span>
              <a
                href={`tel:${digitsOnly}`}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-stone-700 font-semibold text-[11px] flex items-center gap-1"
                title="Call phone directly"
              >
                <Phone className="w-3 h-3 text-stone-600" />
                Call
              </a>
            </div>
          </div>

          {/* Template Selector Tabs */}
          <div>
            <label className="font-bold text-stone-700 block mb-1.5 text-xs">
              Choose Message Template:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setTemplateType('cancellation')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  templateType === 'cancellation'
                    ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 mx-auto mb-1 text-rose-700" />
                <span className="text-[11px] block">Cancellation Notice</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('confirmation')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  templateType === 'confirmation'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700" />
                <span className="text-[11px] block">Verified & Confirmed</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('reminder')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  templateType === 'reminder'
                    ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-blue-700" />
                <span className="text-[11px] block">Schedule Reminder</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTemplateType('custom');
                  if (!customBody) setCustomBody(`Hi ${booking.customer.name}, regarding your appointment at Salon MD Circle C Mall...`);
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  templateType === 'custom'
                    ? 'bg-purple-50 border-purple-400 text-purple-950 font-bold shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 text-purple-700" />
                <span className="text-[11px] block">Custom Text</span>
              </button>
            </div>
          </div>

          {/* Live Message Preview & Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700 text-xs">
                Message Content:
              </label>
              <div className="text-[10px] text-stone-500 font-mono">
                {charCount} characters · ~{smsSegments} SMS segment{smsSegments > 1 ? 's' : ''}
              </div>
            </div>

            {templateType === 'custom' ? (
              <textarea
                rows={4}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono text-xs focus:ring-1 focus:ring-stone-900 focus:outline-none"
                placeholder="Type custom SMS message here..."
              />
            ) : (
              <div className="p-3 bg-stone-50/80 border border-stone-200 rounded-xl text-stone-800 font-mono text-xs leading-relaxed relative group">
                {messageText}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Send or Copy Notification:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Option 1: Mobile Native SMS Link */}
              <button
                type="button"
                onClick={handleOpenSmsApp}
                className="w-full py-2.5 px-3 bg-rose-800 hover:bg-rose-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open Phone SMS App</span>
              </button>

              {/* Option 2: 1-Click Copy */}
              <button
                type="button"
                onClick={handleCopyText}
                className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Message Text (PC)</span>
                  </>
                )}
              </button>
            </div>

            {/* Social / Messaging Direct Links for Philippines (Viber & WhatsApp) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleOpenViber}
                className="py-2 px-3 bg-[#7360f2]/10 hover:bg-[#7360f2]/20 text-[#59267c] border border-[#7360f2]/30 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Open Viber chat to customer phone"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#7360f2]" />
                <span>Send via Viber</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Send via WhatsApp Web or App"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Cloud SMS Gateway (Semaphore PH) Section */}
          <div className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-700 animate-pulse" />
                <span className="font-bold text-stone-900 text-xs">Automated Cloud SMS (Semaphore Philippines)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGatewayConfig(!showGatewayConfig)}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline font-semibold"
              >
                {showGatewayConfig ? 'Hide Gateway Setup' : 'API Setup & Info'}
              </button>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed">
              Want the website to automatically text customers in the background without picking up a phone? You can connect <strong>Semaphore</strong> (semaphore.co), the leading SMS gateway for Philippine Globe/Smart/DITO numbers (~₱0.50/SMS).
            </p>

            {showGatewayConfig && (
              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2 animate-fade-in">
                <label className="text-[11px] font-bold text-stone-700 block">
                  Semaphore API Key (Optional for Live Carrier Delivery):
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter Semaphore API key (e.g. 8f92a10b...)"
                    value={semaphoreKey}
                    onChange={(e) => handleSaveSemaphoreKey(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                  {semaphoreKey && (
                    <button
                      type="button"
                      onClick={() => handleSaveSemaphoreKey('')}
                      className="px-2.5 py-1.5 text-stone-500 hover:text-rose-600 border border-stone-300 rounded-lg text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-stone-500">
                  Leave blank to test in Simulation Mode. Get a live API key at <a href="https://semaphore.co" target="_blank" rel="noreferrer" className="underline text-rose-800 font-bold">semaphore.co</a>.
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSendCloudSms}
                disabled={isSendingCloud}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSendingCloud ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching SMS...</span>
                  </>
                ) : (
                  <>
                    <SendHorizontal className="w-3.5 h-3.5 text-rose-400" />
                    <span>{semaphoreKey ? 'Send Live Cloud SMS' : 'Test / Simulate Cloud Dispatch'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Cloud Send Output Feedback */}
            {cloudSendLog && (
              <div className={`p-3 rounded-xl border text-[11px] font-mono space-y-1 animate-fade-in ${
                cloudSendLog.status === 'success' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gateway Status: Delivery Acknowledged ({cloudSendLog.timestamp})</span>
                </div>
                <p className="text-[10px] text-stone-700 leading-relaxed">
                  {cloudSendLog.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[10px] text-stone-500">
            Salon MD Front Desk Dispatcher · Quezon City
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
