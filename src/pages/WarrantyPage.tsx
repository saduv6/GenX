// ============================================================
// Warranty Page - Static content about warranty policy
// ============================================================

import { Shield, CircleCheck as CheckCircle, Circle as XCircle, Clock, Wrench } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function WarrantyPage() {
  const { lang, t } = useLanguage();

  const covered = lang === 'ar' ? [
    'عيوب التصنيع',
    'أعطال الهاردوير في الاستخدام العادي',
    'مكونات معيبة (لوحة أم، معالج، رام)',
    'عيوب الشاشة (بيكسل ميت، خطوط)',
    'أعطال الكيبورد والتاتش باد',
    'عيوب البطارية في أول 6 أشهر',
    'مشاكل المنافذ والتوصيل',
  ] : [
    'Manufacturing defects',
    'Hardware failures under normal use',
    'Defective components (motherboard, CPU, RAM)',
    'Screen defects (dead pixels, lines)',
    'Keyboard and touchpad malfunctions',
    'Battery defects within first 6 months',
    'Port and connectivity issues',
  ];

  const notCovered = lang === 'ar' ? [
    'أضرار مادية (سقوط، صدمات)',
    'تلف السوائل بأي نوع',
    'إصلاحات أو تعديلات غير مصرح بها',
    'ضرر من طفرات الكهرباء',
    'الاستهلاك الطبيعي',
    'مشاكل السوفتوير والفيروسات',
    'أضرار تجميلية (خدوش، انبعاج)',
  ] : [
    'Physical damage (drops, impacts)',
    'Liquid damage of any kind',
    'Unauthorized repairs or modifications',
    'Damage from power surges',
    'Normal wear and tear',
    'Software issues and viruses',
    'Cosmetic damage (scratches, dents)',
  ];

  const steps = lang === 'ar' ? [
    { step: '1', title: t('contactSupport'), desc: 'تواصل عبر واتساب أو الهاتف مع تفاصيل طلبك ووصف المشكلة.' },
    { step: '2', title: t('diagnosis'), desc: 'فريقنا الفني سيشخص المشكلة عن بعد أو يطلب منك إحضار/إرسال الجهاز.' },
    { step: '3', title: t('repairOrReplace'), desc: 'حسب المشكلة، سنصلح الجهاز أو نستبدله بوحدة مكافئة.' },
    { step: '4', title: t('returnStep'), desc: 'سيتم إرجاع جهازك بدون تكلفة إضافية ضمن شروط الضمان.' },
  ] : [
    { step: '1', title: t('contactSupport'), desc: 'Reach out via WhatsApp or phone with your order details and issue description.' },
    { step: '2', title: t('diagnosis'), desc: 'Our technical team will diagnose the issue remotely or request you to bring/send the device.' },
    { step: '3', title: t('repairOrReplace'), desc: 'Depending on the issue, we will repair the device or replace it with an equivalent unit.' },
    { step: '4', title: t('returnStep'), desc: 'Your device will be returned to you at no additional cost within the warranty terms.' },
  ];

  const notes = lang === 'ar' ? [
    'الضمان ساري فقط للمشتري الأصلي وغير قابل للتحويل.',
    'احتفظ بتأكيد الطلب كإثبات شراء لمطالبات الضمان.',
    'خدمة الضمان متاحة فقط داخل مصر.',
    'فقدان البيانات أثناء الإصلاح ليس مسؤوليتنا. يرجى عمل نسخة احتياطية قبل إرسال الجهاز.',
    'وحدات الاستبدال قد تكون مجددة لكنها تعمل بكامل وظائفها ومقبولة من الناحية التجميلية.',
  ] : [
    'Warranty is valid only for the original purchaser and is non-transferable.',
    'Keep your order confirmation as proof of purchase for warranty claims.',
    'Warranty service is available only within Egypt.',
    'Data loss during repair is not our responsibility. Please back up your data before sending the device.',
    'Replacement units may be refurbished but will be fully functional and cosmetically acceptable.',
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{t('warrantyTitle')}</h1>
        <p className="text-gray-400 mb-8">{t('warrantySubtitle')}</p>

        {/* Warranty Overview */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{t('oneYearWarranty')}</h2>
              <p className="text-gray-500 text-sm">{t('warrantyAllLaptops')}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('warrantyDesc')}
          </p>
        </div>

        {/* Coverage Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {t('whatIsCovered')}
            </h3>
            <ul className="space-y-2">
              {covered.map((item, i) => (
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
              {t('whatIsNotCovered')}
            </h3>
            <ul className="space-y-2">
              {notCovered.map((item, i) => (
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
            {t('howToClaim')}
          </h3>
          <div className="space-y-4">
            {steps.map((s, i) => (
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
            {t('importantNotes')}
          </h3>
          <ul className="space-y-2 text-gray-400 text-xs">
            {notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
