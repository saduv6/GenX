// ============================================================
// Warranty Page - Static content about warranty policy
// ============================================================

import { Shield, CheckCircle, XCircle, Clock, Wrench } from 'lucide-react';

export function WarrantyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Warranty Policy</h1>
        <p className="text-gray-400 mb-8">Understanding your coverage and protection.</p>

        {/* Warranty Overview */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">1-Year Standard Warranty</h2>
              <p className="text-gray-500 text-sm">All laptops purchased from GenX Laptop</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every laptop purchased from GenX Laptop comes with a comprehensive 1-year warranty that covers manufacturing defects and hardware failures under normal use conditions.
          </p>
        </div>

        {/* Coverage Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              What is Covered
            </h3>
            <ul className="space-y-2">
              {[
                'Manufacturing defects',
                'Hardware failures under normal use',
                'Defective components (motherboard, CPU, RAM)',
                'Screen defects (dead pixels, lines)',
                'Keyboard and touchpad malfunctions',
                'Battery defects within first 6 months',
                'Port and connectivity issues',
              ].map((item, i) => (
                <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              What is Not Covered
            </h3>
            <ul className="space-y-2">
              {[
                'Physical damage (drops, impacts)',
                'Liquid damage of any kind',
                'Unauthorized repairs or modifications',
                'Damage from power surges',
                'Normal wear and tear',
                'Software issues and viruses',
                'Cosmetic damage (scratches, dents)',
              ].map((item, i) => (
                <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warranty Process */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-6">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-400" />
            How to Claim Warranty
          </h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Contact Support', desc: 'Reach out via WhatsApp or phone with your order details and issue description.' },
              { step: '2', title: 'Diagnosis', desc: 'Our technical team will diagnose the issue remotely or request you to bring/send the device.' },
              { step: '3', title: 'Repair or Replace', desc: 'Depending on the issue, we will repair the device or replace it with an equivalent unit.' },
              { step: '4', title: 'Return', desc: 'Your device will be returned to you at no additional cost within the warranty terms.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{s.title}</p>
                  <p className="text-gray-400 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-green-400" />
            Important Notes
          </h3>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li>Warranty is valid only for the original purchaser and is non-transferable.</li>
            <li>Keep your order confirmation as proof of purchase for warranty claims.</li>
            <li>Warranty service is available only within Egypt.</li>
            <li>Data loss during repair is not our responsibility. Please back up your data before sending the device.</li>
            <li>Replacement units may be refurbished but will be fully functional and cosmetically acceptable.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
