// ============================================================
// Terms of Service Page - Static content
// ============================================================

export function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Please read these terms carefully before using our services.</p>

        <div className="space-y-6">
          <Section title="1. Acceptance of Terms">
            By accessing and using GenX Laptop website, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
          </Section>

          <Section title="2. Products and Pricing">
            All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices are listed in Egyptian Pounds (EGP) and are subject to change without notice. The price displayed at the time of order placement is the final price.
          </Section>

          <Section title="3. Orders and Payment">
            We accept Cash on Delivery (COD) as our sole payment method. Orders are confirmed upon successful submission through our checkout form. We reserve the right to refuse or cancel any order for reasons including but not limited to product availability, errors in product information, or suspected fraudulent activity.
          </Section>

          <Section title="4. Delivery">
            Delivery times are estimates and may vary based on your location and other factors. We deliver throughout Egypt. Our delivery team will contact you to schedule the delivery. Please ensure that the phone number and address provided are accurate.
          </Section>

          <Section title="5. Returns and Exchanges">
            You may return or exchange products within 14 days of delivery, provided the item is in original condition with all accessories and packaging intact. To initiate a return, please contact our customer support team.
          </Section>

          <Section title="6. Privacy Policy">
            We collect personal information such as your name, phone number, and address solely for the purpose of processing and delivering your order. We do not share your information with third parties except as necessary to fulfill your order. We implement reasonable security measures to protect your data.
          </Section>

          <Section title="7. Warranty">
            All laptops come with a manufacturer warranty as specified on the product page. GenX Laptop provides a 1-year warranty covering manufacturing defects. Physical damage, liquid damage, and unauthorized repairs are not covered.
          </Section>

          <Section title="8. Limitation of Liability">
            GenX Laptop shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the purchase price of the product in question.
          </Section>

          <Section title="9. Contact">
            For any questions regarding these terms, please contact us through WhatsApp or the contact information provided on our website.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-5">
      <h2 className="text-white font-semibold text-sm mb-2">{title}</h2>
      <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
