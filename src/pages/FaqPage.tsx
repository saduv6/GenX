// ============================================================
// FAQ Page - Static content about shipping, warranty, returns
// ============================================================

import { HelpCircle, Truck, Shield, RotateCcw, CreditCard, Package } from 'lucide-react';

const faqs = [
  {
    icon: Truck,
    question: 'How long does delivery take?',
    answer: 'Delivery within Cairo and Giza typically takes 2-3 business days. For other governorates, delivery takes 3-5 business days. You will receive a call from our delivery team to schedule the delivery time.',
  },
  {
    icon: CreditCard,
    question: 'What payment methods do you accept?',
    answer: 'We require a 500 EGP deposit to confirm your order. This amount is deducted from your total purchase price. When you receive your package, you simply pay the remaining balance to our delivery representative.',
  },
  {
    icon: Package,
    question: 'How do I track my order?',
    answer: 'After placing your order, you can contact us via WhatsApp or phone with your order details to check the status. Our team will provide you with delivery updates.',
  },
  {
    icon: RotateCcw,
    question: 'Can I return or exchange a laptop?',
    answer: 'Return and warranty policies vary by laptop model, as we offer a wide range of brands and configurations in our website. Please check the specific product page for details, or contact our support team and we\'ll clarify the policy for your chosen laptop before you purchase.',
  },
  {
    icon: Shield,
    question: 'Do laptops come with a warranty?',
    answer: 'All laptops we offer, regardless of brand or configuration, come with a lifetime warranty. For detailed terms and coverage specifics, please refer to the individual product page or contact our support team.',
  },
  {
    icon: HelpCircle,
    question: 'How can I contact customer support?',
    answer: 'Our support team is available 24/7 via phone, WhatsApp, and all our social media channels. Feel free to reach out anytime, and we\'ll be happy to assist you.',
  },
];

export function FaqPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-400 mb-8">Find answers to common questions about our products and services.</p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">
                  <faq.icon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-2">{faq.question}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
