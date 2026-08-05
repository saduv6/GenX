// ============================================================
// Terms of Service Page - Static content
// ============================================================

import { useLanguage } from '@/hooks/useLanguage';

export function TermsPage() {
  const { lang, t } = useLanguage();

  const sections = lang === 'ar' ? [
    { title: '1. قبول الشروط', body: 'بدخولك واستخدامك موقع GenX Laptop، فإنك تقبل وتوافق على الالتزام بشروط الخدمة هذه. إذا لم توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.' },
    { title: '2. المنتجات والأسعار', body: 'جميع المنتجات المدرجة على موقعنا تخضع للتوفر. نحتفظ بالحق في إيقاف أي منتج في أي وقت. الأسعار مدرجة بالجنيه المصري (EGP) وقابلة للتغيير دون إشعار. السعر المعروض وقت تأكيد الطلب هو السعر النهائي.' },
    { title: '3. الطلبات والدفع', body: 'نقبل الدفع عند الاستلام (COD) كطريقة الدفع الوحيدة. يتم تأكيد الطلبات عند الإرسال الناجح عبر نموذج الدفع. نحتفظ بالحق في رفض أو إلغاء أي طلب لأسباب تشمل التوفر أو الأخطاء أو النشاط الاحتيالي.' },
    { title: '4. التوصيل', body: 'أوقات التوصيل تقديرية وقد تختلف حسب موقعك وعوامل أخرى. نوصل في جميع أنحاء مصر. سيتواصل معك فريق التوصيل لجدولة التسليم. يرجى التأكد من صحة رقم الهاتف والعنوان.' },
    { title: '5. الإرجاع والاستبدال', body: 'يمكنك إرجاع أو استبدال المنتجات خلال 14 يوماً من التسليم، بشرط أن يكون المنتج بحالته الأصلية بكل الملحقات والتغليف. لبدء الإرجاع، يرجى التواصل مع فريق الدعم.' },
    { title: '6. سياسة الخصوصية', body: 'نجمع المعلومات الشخصية مثل الاسم ورقم الهاتف والعنوان فقط لغرض معالجة وتوصيل طلبك. لا نشارك معلوماتك مع أطراف ثالثة إلا عند الضرورة لتنفيذ طلبك. نطبق تدابير أمنية معقولة لحماية بياناتك.' },
    { title: '7. الضمان', body: 'جميع اللابتوبات تأتي بضمان الشركة المصنعة كما هو محدد على صفحة المنتج. يوفر GenX Laptop ضمان سنة يغطي عيوب التصنيع. الأضرار المادية وتلف السوائل والإصلاحات غير المصرح بها غير مشمولة.' },
    { title: '8. حدود المسؤولية', body: 'لا يكون GenX Laptop مسؤولاً عن أي أضرار غير مباشرة أو عرضية أو تبعية ناشئة عن استخدام منتجاتنا أو خدماتنا. إجمالي مسؤوليتنا لا يتجاوز سعر شراء المنتج المعني.' },
    { title: '9. التواصل', body: 'لأي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر واتساب أو معلومات التواصل المتوفرة على موقعنا.' },
  ] : [
    { title: '1. Acceptance of Terms', body: 'By accessing and using GenX Laptop website, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.' },
    { title: '2. Products and Pricing', body: 'All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices are listed in Egyptian Pounds (EGP) and are subject to change without notice. The price displayed at the time of order placement is the final price.' },
    { title: '3. Orders and Payment', body: 'We accept Cash on Delivery (COD) as our sole payment method. Orders are confirmed upon successful submission through our checkout form. We reserve the right to refuse or cancel any order for reasons including but not limited to product availability, errors in product information, or suspected fraudulent activity.' },
    { title: '4. Delivery', body: 'Delivery times are estimates and may vary based on your location and other factors. We deliver throughout Egypt. Our delivery team will contact you to schedule the delivery. Please ensure that the phone number and address provided are accurate.' },
    { title: '5. Returns and Exchanges', body: 'You may return or exchange products within 14 days of delivery, provided the item is in original condition with all accessories and packaging intact. To initiate a return, please contact our customer support team.' },
    { title: '6. Privacy Policy', body: 'We collect personal information such as your name, phone number, and address solely for the purpose of processing and delivering your order. We do not share your information with third parties except as necessary to fulfill your order. We implement reasonable security measures to protect your data.' },
    { title: '7. Warranty', body: 'All laptops come with a manufacturer warranty as specified on the product page. GenX Laptop provides a 1-year warranty covering manufacturing defects. Physical damage, liquid damage, and unauthorized repairs are not covered.' },
    { title: '8. Limitation of Liability', body: 'GenX Laptop shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the purchase price of the product in question.' },
    { title: '9. Contact', body: 'For any questions regarding these terms, please contact us through WhatsApp or the contact information provided on our website.' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{t('termsTitle')}</h1>
        <p className="text-gray-400 mb-8">{t('termsSubtitle')}</p>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
              <h2 className="text-white font-semibold text-sm mb-2">{s.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
