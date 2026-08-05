// ============================================================
// Bilingual translations (English / Arabic)
// ============================================================

export type Language = 'en' | 'ar';

export const translations = {
  en: {
    // Header / Nav
    home: 'Home',
    faq: 'FAQ',
    compare: 'Compare',
    cart: 'Cart',

    // Splash
    clickToEnter: 'Click to enter',

    // Store / Hero
    bestSellers: 'Best Sellers',
    searchPlaceholder: 'Search laptops...',
    all: 'All',
    bestSelling: 'Best Selling',
    gaming: 'Gaming',
    business: 'Business',
    student: 'Student',
    newArrivals: 'New Arrivals',
    noLaptopsFound: 'No laptops found',
    page: 'Page',
    of: 'of',
    details: 'Details',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    bestSeller: 'Best Seller',

    // Product Detail
    backToStore: 'Back to store',
    inStock: 'In Stock',
    outOfStockLabel: 'Out of Stock',
    specifications: 'Specifications',
    processor: 'Processor',
    ram: 'RAM',
    storage: 'Storage',
    graphics: 'Graphics',
    display: 'Display',
    category: 'Category',
    selectVariant: 'Select Configuration',
    variant: 'Configuration',
    price: 'Price',
    quantity: 'Quantity',
    productNotFound: 'Product not found',

    // Cart
    shoppingCart: 'Shopping Cart',
    yourCartIsEmpty: 'Your cart is empty',
    cartEmptyDesc: "Looks like you haven't added any laptops yet.",
    continueShopping: 'Continue Shopping',
    clearAll: 'Clear all',
    total: 'Total',
    items: 'items',
    proceedToCheckout: 'Proceed to Checkout',

    // Checkout
    checkout: 'Checkout',
    backToCart: 'Back to cart',
    orderSummary: 'Order Summary',
    deliveryInformation: 'Delivery Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    street: 'Street',
    building: 'Building',
    apartment: 'Apartment',
    city: 'City',
    governorate: 'Governorate',
    landmark: 'Landmark',
    landmarkOptional: 'Landmark (Optional)',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    codDesc: 'Pay when you receive your order',
    placeOrder: 'Place Order',
    placingOrder: 'Placing Order...',
    orderPlaced: 'Order Placed!',
    orderPlacedDesc: 'Thank you for your order. We will contact you shortly to confirm delivery details.',
    backToStoreBtn: 'Back to Store',
    yourCartIsEmptyShort: 'Your cart is empty',
    backToStoreShort: 'Back to store',
    fullNameRequired: 'Full name is required',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Enter valid Egyptian number (01XXXXXXXXX)',
    streetRequired: 'Street is required',
    buildingRequired: 'Building number is required',
    apartmentRequired: 'Apartment is required',
    cityRequired: 'City is required',
    governorateRequired: 'Governorate is required',

    // Compare
    compareLaptops: 'Compare Laptops',
    noLaptopsToCompare: 'No laptops to compare',
    compareEmptyDesc: 'Add laptops from the store to compare their specifications.',
    browseLaptops: 'Browse Laptops',
    feature: 'Feature',
    remove: 'Remove',
    availability: 'Availability',

    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Find answers to common questions about our products and services.',

    // Terms
    termsTitle: 'Terms of Service',
    termsSubtitle: 'Please read these terms carefully before using our services.',

    // Warranty
    warrantyTitle: 'Warranty Policy',
    warrantySubtitle: 'Understanding your coverage and protection.',
    oneYearWarranty: '1-Year Standard Warranty',
    warrantyAllLaptops: 'All laptops purchased from GenX Laptop',
    warrantyDesc: 'Every laptop purchased from GenX Laptop comes with a comprehensive 1-year warranty that covers manufacturing defects and hardware failures under normal use conditions.',
    whatIsCovered: 'What is Covered',
    whatIsNotCovered: 'What is Not Covered',
    howToClaim: 'How to Claim Warranty',
    importantNotes: 'Important Notes',
    contactSupport: 'Contact Support',
    diagnosis: 'Diagnosis',
    repairOrReplace: 'Repair or Replace',
    returnStep: 'Return',

    // Footer
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    termsOfService: 'Terms of Service',
    warranty: 'Warranty',

    // Admin
    adminAccess: 'Admin Access',
    enterPassword: 'Enter your password to continue',
    password: 'Password',
    login: 'Login',
    verifying: 'Verifying...',
    invalidPassword: 'Invalid password',
    logout: 'Logout',
    genxAdmin: 'GenX Admin',
    dashboard: 'Dashboard',
    orders: 'Orders',
    laptops: 'Laptops',
    images: 'Images',
    settings: 'Settings',
    faqManagement: 'FAQ Management',
  },
  ar: {
    // Header / Nav
    home: 'الرئيسية',
    faq: 'الأسئلة الشائعة',
    compare: 'مقارنة',
    cart: 'السلة',

    // Splash
    clickToEnter: 'اضغط للدخول',

    // Store / Hero
    bestSellers: 'الأكثر مبيعاً',
    searchPlaceholder: 'ابحث عن لابتوب...',
    all: 'الكل',
    bestSelling: 'الأكثر مبيعاً',
    gaming: 'جيمنج',
    business: 'أعمال',
    student: 'طلاب',
    newArrivals: 'وصل حديثاً',
    noLaptopsFound: 'لا توجد لابتوبات',
    page: 'صفحة',
    of: 'من',
    details: 'التفاصيل',
    addToCart: 'أضف للسلة',
    outOfStock: 'غير متوفر',
    bestSeller: 'الأكثر مبيعاً',

    // Product Detail
    backToStore: 'العودة للمتجر',
    inStock: 'متوفر',
    outOfStockLabel: 'غير متوفر',
    specifications: 'المواصفات',
    processor: 'المعالج',
    ram: 'الرام',
    storage: 'التخزين',
    graphics: 'الكرت الشاشة',
    display: 'الشاشة',
    category: 'الفئة',
    selectVariant: 'اختر التجهيزة',
    variant: 'التجهيزة',
    price: 'السعر',
    quantity: 'الكمية',
    productNotFound: 'المنتج غير موجود',

    // Cart
    shoppingCart: 'سلة التسوق',
    yourCartIsEmpty: 'سلتك فارغة',
    cartEmptyDesc: 'يبدو أنك لم تقم بإضافة أي لابتوب بعد.',
    continueShopping: 'متابعة التسوق',
    clearAll: 'مسح الكل',
    total: 'الإجمالي',
    items: 'منتجات',
    proceedToCheckout: 'إتمام الطلب',

    // Checkout
    checkout: 'إتمام الطلب',
    backToCart: 'العودة للسلة',
    orderSummary: 'ملخص الطلب',
    deliveryInformation: 'بيانات التوصيل',
    fullName: 'الاسم بالكامل',
    phoneNumber: 'رقم الهاتف',
    street: 'الشارع',
    building: 'رقم العقار',
    apartment: 'رقم الشقة',
    city: 'المدينة',
    governorate: 'المحافظة',
    landmark: 'علامة مميزة',
    landmarkOptional: 'علامة مميزة (اختياري)',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    codDesc: 'ادفع عند استلام طلبك',
    placeOrder: 'تأكيد الطلب',
    placingOrder: 'جاري تأكيد الطلب...',
    orderPlaced: 'تم تأكيد الطلب!',
    orderPlacedDesc: 'شكراً لطلبك. سنتواصل معك قريباً لتأكيد تفاصيل التوصيل.',
    backToStoreBtn: 'العودة للمتجر',
    yourCartIsEmptyShort: 'سلتك فارغة',
    backToStoreShort: 'العودة للمتجر',
    fullNameRequired: 'الاسم بالكامل مطلوب',
    phoneRequired: 'رقم الهاتف مطلوب',
    phoneInvalid: 'أدخل رقم مصري صحيح (01XXXXXXXXX)',
    streetRequired: 'الشارع مطلوب',
    buildingRequired: 'رقم العقار مطلوب',
    apartmentRequired: 'رقم الشقة مطلوب',
    cityRequired: 'المدينة مطلوبة',
    governorateRequired: 'المحافظة مطلوبة',

    // Compare
    compareLaptops: 'مقارنة اللابتوبات',
    noLaptopsToCompare: 'لا توجد لابتوبات للمقارنة',
    compareEmptyDesc: 'أضف لابتوبات من المتجر لمقارنة مواصفاتها.',
    browseLaptops: 'تصفح اللابتوبات',
    feature: 'الميزة',
    remove: 'إزالة',
    availability: 'التوفر',

    // FAQ
    faqTitle: 'الأسئلة الشائعة',
    faqSubtitle: 'إجابات للأسئلة الشائعة حول منتجاتنا وخدماتنا.',

    // Terms
    termsTitle: 'شروط الخدمة',
    termsSubtitle: 'يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا.',

    // Warranty
    warrantyTitle: 'سياسة الضمان',
    warrantySubtitle: 'فهم التغطية والحماية الخاصة بك.',
    oneYearWarranty: 'ضمان سنة واحدة',
    warrantyAllLaptops: 'جميع اللابتوبات المشتراة من GenX Laptop',
    warrantyDesc: 'كل لابتوب مشترى من GenX Laptop يأتي بضمان شامل لمدة سنة يغطي عيوب التصنيع وأعطال الهاردوير في ظل الاستخدام العادي.',
    whatIsCovered: 'ما هو مشمول',
    whatIsNotCovered: 'ما هو غير مشمول',
    howToClaim: 'كيف تستخدم الضمان',
    importantNotes: 'ملاحظات هامة',
    contactSupport: 'تواصل مع الدعم',
    diagnosis: 'التشخيص',
    repairOrReplace: 'إصلاح أو استبدال',
    returnStep: 'الاسترجاع',

    // Footer
    quickLinks: 'روابط سريعة',
    contactUs: 'تواصل معنا',
    termsOfService: 'شروط الخدمة',
    warranty: 'الضمان',

    // Admin
    adminAccess: 'دخول الأدمن',
    enterPassword: 'أدخل كلمة المرور للمتابعة',
    password: 'كلمة المرور',
    login: 'دخول',
    verifying: 'جاري التحقق...',
    invalidPassword: 'كلمة مرور خاطئة',
    logout: 'خروج',
    genxAdmin: 'GenX أدمن',
    dashboard: 'اللوحة',
    orders: 'الطلبات',
    laptops: 'اللابتوبات',
    images: 'الصور',
    settings: 'الإعدادات',
    faqManagement: 'إدارة الأسئلة',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
