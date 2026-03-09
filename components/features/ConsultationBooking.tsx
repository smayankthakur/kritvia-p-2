'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

type Step = 'service' | 'datetime' | 'details' | 'confirm';

const SERVICES = [
  { id: 'strategy', label: 'Technology Strategy', icon: '🗺️', duration: '60 min' },
  { id: 'ai', label: 'AI/ML Consultation', icon: '🤖', duration: '45 min' },
  { id: 'architecture', label: 'Architecture Review', icon: '🏗️', duration: '60 min' },
  { id: 'discovery', label: 'Project Discovery', icon: '🔍', duration: '90 min' },
];

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

function getDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    if (dates.length >= 5) break;
  }
  return dates;
}

interface BookingState {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  company: string;
  message: string;
}

const STEPS: { id: Step; label: string }[] = [
  { id: 'service', label: 'Service' },
  { id: 'datetime', label: 'Date & Time' },
  { id: 'details', label: 'Your Info' },
  { id: 'confirm', label: 'Confirm' },
];

export function ConsultationBooking() {
  const [step, setStep] = useState<Step>('service');
  const [booking, setBooking] = useState<BookingState>({
    service: '', date: '', time: '', name: '', email: '', company: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  const canAdvance = () => {
    if (step === 'service') return !!booking.service;
    if (step === 'datetime') return !!booking.date && !!booking.time;
    if (step === 'details') return !!booking.name && !!booking.email;
    return true;
  };

  const next = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  };

  const back = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx > 0) setStep(STEPS[idx - 1].id);
  };

  const submit = async () => {
    // In production, this would call an API route
    setSubmitted(true);
  };

  const selectedService = SERVICES.find((s) => s.id === booking.service);
  const dates = getDates();

  if (submitted) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Consultation Booked!</h3>
        <p className="text-neutral-400 mb-1">
          <span className="text-white">{booking.name}</span>, we've confirmed your {selectedService?.label} session.
        </p>
        <p className="text-neutral-400 mb-6">
          {booking.date} at {booking.time} · Confirmation sent to <span className="text-primary-400">{booking.email}</span>
        </p>
        <button
          onClick={() => { setSubmitted(false); setStep('service'); setBooking({ service: '', date: '', time: '', name: '', email: '', company: '', message: '' }); }}
          className="px-6 py-3 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border-b border-neutral-800 p-6">
        <h2 className="text-xl font-bold text-white">Book a Free Consultation</h2>
        <p className="text-neutral-400 text-sm mt-1">30–90 minute sessions with our expert team, no sales pitch.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex border-b border-neutral-800">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'flex-1 py-3 text-center text-xs font-medium border-b-2 transition-colors',
              i < currentStepIndex
                ? 'border-primary-600 text-primary-400'
                : i === currentStepIndex
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-neutral-600',
            )}
          >
            <span className={cn(
              'inline-flex w-5 h-5 rounded-full text-xs items-center justify-center mr-1.5',
              i < currentStepIndex ? 'bg-primary-600 text-white' : i === currentStepIndex ? 'bg-primary-600 text-white' : 'bg-neutral-800 text-neutral-500',
            )}>
              {i < currentStepIndex ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="p-6">
        {/* Step 1: Service */}
        {step === 'service' && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">What type of consultation do you need?</h3>
            {SERVICES.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setBooking((b) => ({ ...b, service: svc.id }))}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
                  booking.service === svc.id
                    ? 'bg-primary-600/20 border-primary-500'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500',
                )}
              >
                <span className="text-2xl flex-shrink-0">{svc.icon}</span>
                <div>
                  <div className={cn('font-medium', booking.service === svc.id ? 'text-primary-300' : 'text-white')}>
                    {svc.label}
                  </div>
                  <div className="text-xs text-neutral-500">{svc.duration} · Free · Video call</div>
                </div>
                {booking.service === svc.id && (
                  <svg className="w-5 h-5 text-primary-400 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 'datetime' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Select a date</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setBooking((b) => ({ ...b, date }))}
                    className={cn(
                      'p-3 rounded-xl border text-center text-sm transition-all',
                      booking.date === date
                        ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500',
                    )}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Select a time (IST)</h3>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setBooking((b) => ({ ...b, time }))}
                    className={cn(
                      'p-3 rounded-xl border text-sm transition-all',
                      booking.time === time
                        ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500',
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-2">Your information</h3>
            {[
              { key: 'name', label: 'Full Name *', placeholder: 'John Smith', type: 'text' },
              { key: 'email', label: 'Work Email *', placeholder: 'john@company.com', type: 'email' },
              { key: 'company', label: 'Company', placeholder: 'Acme Corp', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs text-neutral-400 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={booking[key as keyof BookingState]}
                  onChange={(e) => setBooking((b) => ({ ...b, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Brief about your project (optional)</label>
              <textarea
                value={booking.message}
                onChange={(e) => setBooking((b) => ({ ...b, message: e.target.value }))}
                placeholder="Tell us about your project or questions..."
                rows={3}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Confirm your booking</h3>
            <div className="bg-neutral-800 rounded-xl p-4 space-y-3">
              {[
                { label: 'Service', value: selectedService?.label },
                { label: 'Date', value: booking.date },
                { label: 'Time', value: `${booking.time} IST` },
                { label: 'Name', value: booking.name },
                { label: 'Email', value: booking.email },
                booking.company && { label: 'Company', value: booking.company },
              ].filter(Boolean).map((item) => item && (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-neutral-500">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500">
              A Google Meet link will be sent to your email before the session. This consultation is completely free with no obligations.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentStepIndex > 0 && (
            <button
              onClick={back}
              className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Back
            </button>
          )}
          {step !== 'confirm' ? (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={submit}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Confirm Booking ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
