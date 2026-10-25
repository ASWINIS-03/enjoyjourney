import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SupportTicket } from '../types/travel';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';

export const CustomerSupportPage: React.FC = () => {
  const [supportInfo, setSupportInfo] = useState<any>(null);
  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>('0-0');

  // Support Request Form State
  const [category, setCategory] = useState('Booking');
  const [bookingRef, setBookingRef] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { refreshNotifications } = useNotifications();

  const loadData = async () => {
    try {
      const [infoRes, ticketsRes] = await Promise.all([
        api.getSupportInfo(),
        api.getMyTickets().catch(() => ({ tickets: [] })),
      ]);
      setSupportInfo(infoRes);
      setMyTickets(ticketsRes.tickets || []);
    } catch (err) {
      console.error('Failed to load support data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess('');
    setSubmitError('');

    try {
      const res = await api.createTicket({
        category,
        bookingReference: bookingRef || undefined,
        subject,
        message,
        priority,
      });
      setSubmitSuccess(res.message);
      setSubject('');
      setMessage('');
      setBookingRef('');
      await refreshNotifications();
      await loadData();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit support request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Headphones className="w-4 h-4" />
          <span>Help Center &amp; Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Customer Support</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          We're here to assist with domestic flight queries, bus sleeper bookings, train PNRs, cab dispatches, and refund status.
        </p>
      </div>

      {/* Support Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Assistance</span>
            <span className="text-sm font-bold text-white block mt-0.5">
              {supportInfo?.email || 'support@enjoyjourney.demo'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Response within 24 hours</span>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Helpline</span>
            <span className="text-sm font-bold text-white block mt-0.5">
              {supportInfo?.helpline || '1800-EJ-JOURNEY'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Toll-Free Demonstration Line</span>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Hours</span>
            <span className="text-sm font-bold text-white block mt-0.5">24x7 Support Available</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Tamil Nadu &amp; All India</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Support Ticket Form */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-4 h-4 text-teal-400" />
            <h2 className="text-lg font-black text-white">Submit a Support Ticket</h2>
          </div>

          {submitSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="Booking">Booking Assistance</option>
                  <option value="Cancellation & Refund">Cancellation &amp; Refund</option>
                  <option value="Seat Selection">Seat &amp; Berth Selection</option>
                  <option value="Offers & Discounts">Special Concessions</option>
                  <option value="Payment Query">Fare / Payment Query</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Booking Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="e.g. EJ-FL-83921"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message &amp; Details</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your query in detail..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Priority:</span>
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      priority === p ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>

          {/* Ticket Submission History */}
          {myTickets.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-700/80">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Your Support Tickets ({myTickets.length})
              </h3>
              <div className="space-y-2.5">
                {myTickets.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">#{t.id} &bull; {t.subject}</span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{t.message}</p>
                    {t.adminResponse && (
                      <div className="mt-2 p-2 bg-slate-800/80 rounded-lg text-teal-300 text-[11px]">
                        <strong>Support Response:</strong> {t.adminResponse}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Frequently Asked Questions Accordion */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <h2 className="text-lg font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {supportInfo?.faqs?.map((faqGroup: any, groupIdx: number) => (
              <div key={groupIdx} className="space-y-2">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                  {faqGroup.category}
                </span>

                {faqGroup.questions.map((faq: any, qIdx: number) => {
                  const key = `${groupIdx}-${qIdx}`;
                  const isOpen = openFaqIndex === key;

                  return (
                    <div
                      key={qIdx}
                      className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : key)}
                        className="w-full p-3.5 text-left text-xs font-bold text-white flex items-center justify-between gap-3 hover:text-teal-300"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-700/60 bg-slate-900/40">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
