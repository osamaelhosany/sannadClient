export type Bi = { en: string; ar: string };

export type ServiceStatus = "In Progress" | "Completed" | "Pending";
export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";

export type Service = {
  id: string;
  name: Bi;
  status: ServiceStatus;
  progress: number;
  start: string;
  deadline: string;
  packageId?: string;
  desc: Bi;
  milestones: { label: Bi; done: boolean }[];
};

export type Pkg = {
  id: string;
  name: Bi;
  status: ServiceStatus;
  progress: number;
  serviceIds: string[];
  desc: Bi;
};

export type Invoice = {
  id: string;
  number: string;
  serviceId: string;
  serviceName: Bi;
  date: string;
  due: string;
  amount: number;
  status: InvoiceStatus;
  items: { label: Bi; amount: number }[];
};

export type FileItem = {
  id: string;
  name: Bi;
  type: "PDF" | "DOCX" | "XLSX" | "IMG";
  size: string;
  date: string;
  sync: "synced" | "syncing" | "error";
  folder: Bi;
};

export type Notif = {
  id: string;
  type: "invoice" | "invoice_update" | "service" | "file" | "announcement";
  title: Bi;
  body: Bi;
  time: string;
  read: boolean;
};

export type Msg = { id: string; from: "client" | "agent" | "system"; text: string; time: string };
export type Thread = {
  id: string;
  dept: Bi;
  clientName: Bi;
  avatar: string;
  messages: Msg[];
};

export type Course = {
  id: string;
  title: Bi;
  category: Bi;
  progress: number;
  lessons: { title: Bi; min: number }[];
  color: string;
};

export const packages: Pkg[] = [
  {
    id: "pkg-1",
    name: { en: "Premium Business Package", ar: "باقة الأعمال المميزة" },
    status: "In Progress",
    progress: 72,
    serviceIds: ["srv-1", "srv-2", "srv-5"],
    desc: {
      en: "A full company setup bundle including registration, bookkeeping and tax filing support.",
      ar: "حزمة تأسيس متكاملة تشمل التسجيل ومسك الدفاتر ودعم الإقرارات الضريبية.",
    },
  },
];

export const initialServices: Service[] = [
  {
    id: "srv-1",
    name: { en: "Business Setup & Company Registration", ar: "تأسيس الأعمال وتسجيل الشركة" },
    status: "In Progress",
    progress: 75,
    start: "13 Apr 2025",
    deadline: "18 Feb 2026",
    packageId: "pkg-1",
    desc: {
      en: "Commercial registration, licensing and legal documentation for your new entity.",
      ar: "السجل التجاري والتراخيص والمستندات القانونية للكيان الجديد.",
    },
    milestones: [
      { label: { en: "Name reservation", ar: "حجز الاسم التجاري" }, done: true },
      { label: { en: "Articles of association", ar: "عقد التأسيس" }, done: true },
      { label: { en: "Commercial registration", ar: "السجل التجاري" }, done: true },
      { label: { en: "Municipality license", ar: "رخصة البلدية" }, done: false },
    ],
  },
  {
    id: "srv-2",
    name: { en: "Accounting & Bookkeeping", ar: "المحاسبة ومسك الدفاتر" },
    status: "In Progress",
    progress: 48,
    start: "06 Jan 2026",
    deadline: "30 Jun 2026",
    packageId: "pkg-1",
    desc: {
      en: "Monthly bookkeeping, ledger reconciliation and financial statement preparation.",
      ar: "مسك الدفاتر الشهري وتسوية الحسابات وإعداد القوائم المالية.",
    },
    milestones: [
      { label: { en: "Chart of accounts", ar: "شجرة الحسابات" }, done: true },
      { label: { en: "Q1 reconciliation", ar: "تسوية الربع الأول" }, done: true },
      { label: { en: "Q2 reconciliation", ar: "تسوية الربع الثاني" }, done: false },
      { label: { en: "Annual statements", ar: "القوائم السنوية" }, done: false },
    ],
  },
  {
    id: "srv-3",
    name: { en: "Tax Consultation", ar: "الاستشارات الضريبية" },
    status: "Completed",
    progress: 100,
    start: "04 Dec 2025",
    deadline: "13 Jan 2026",
    desc: {
      en: "VAT registration review and corporate tax advisory sessions.",
      ar: "مراجعة تسجيل ضريبة القيمة المضافة وجلسات استشارية للضريبة.",
    },
    milestones: [
      { label: { en: "VAT assessment", ar: "تقييم ضريبة القيمة المضافة" }, done: true },
      { label: { en: "Advisory session", ar: "جلسة استشارية" }, done: true },
      { label: { en: "Final report", ar: "التقرير النهائي" }, done: true },
    ],
  },
  {
    id: "srv-4",
    name: { en: "Trademark Registration", ar: "تسجيل العلامة التجارية" },
    status: "Pending",
    progress: 10,
    start: "01 Feb 2026",
    deadline: "20 Aug 2026",
    desc: {
      en: "Trademark search, application filing and follow-up with authorities.",
      ar: "بحث العلامة التجارية وتقديم الطلب والمتابعة مع الجهات المختصة.",
    },
    milestones: [
      { label: { en: "Trademark search", ar: "بحث العلامة" }, done: true },
      { label: { en: "Application filing", ar: "تقديم الطلب" }, done: false },
      { label: { en: "Publication", ar: "النشر" }, done: false },
    ],
  },
  {
    id: "srv-5",
    name: { en: "Payroll Management", ar: "إدارة الرواتب" },
    status: "In Progress",
    progress: 60,
    start: "15 Nov 2025",
    deadline: "15 Nov 2026",
    packageId: "pkg-1",
    desc: {
      en: "Monthly payroll processing, WPS compliance and end-of-service calculations.",
      ar: "معالجة الرواتب الشهرية والامتثال لحماية الأجور وحساب نهاية الخدمة.",
    },
    milestones: [
      { label: { en: "Employee onboarding", ar: "إضافة الموظفين" }, done: true },
      { label: { en: "WPS setup", ar: "إعداد حماية الأجور" }, done: true },
      { label: { en: "Automated cycle", ar: "الدورة الآلية" }, done: false },
    ],
  },
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    number: "INV-2026-001",
    serviceId: "srv-1",
    serviceName: { en: "Business Setup & Company Registration", ar: "تأسيس الأعمال وتسجيل الشركة" },
    date: "12 Jan 2026",
    due: "26 Jan 2026",
    amount: 12500,
    status: "Unpaid",
    items: [
      { label: { en: "Commercial registration fees", ar: "رسوم السجل التجاري" }, amount: 7500 },
      { label: { en: "Legal documentation", ar: "المستندات القانونية" }, amount: 3500 },
      { label: { en: "Service fee", ar: "رسوم الخدمة" }, amount: 1500 },
    ],
  },
  {
    id: "inv-2",
    number: "INV-2026-002",
    serviceId: "srv-2",
    serviceName: { en: "Accounting & Bookkeeping", ar: "المحاسبة ومسك الدفاتر" },
    date: "05 Jan 2026",
    due: "19 Jan 2026",
    amount: 4800,
    status: "Paid",
    items: [
      { label: { en: "Monthly bookkeeping (Q1)", ar: "مسك الدفاتر الشهري (الربع الأول)" }, amount: 4800 },
    ],
  },
  {
    id: "inv-3",
    number: "INV-2025-118",
    serviceId: "srv-3",
    serviceName: { en: "Tax Consultation", ar: "الاستشارات الضريبية" },
    date: "18 Dec 2025",
    due: "01 Jan 2026",
    amount: 2200,
    status: "Overdue",
    items: [{ label: { en: "Advisory sessions (2)", ar: "جلسات استشارية (2)" }, amount: 2200 }],
  },
  {
    id: "inv-4",
    number: "INV-2025-097",
    serviceId: "srv-5",
    serviceName: { en: "Payroll Management", ar: "إدارة الرواتب" },
    date: "15 Nov 2025",
    due: "29 Nov 2025",
    amount: 3600,
    status: "Paid",
    items: [{ label: { en: "Payroll setup", ar: "إعداد الرواتب" }, amount: 3600 }],
  },
];

export const initialFiles: FileItem[] = [
  {
    id: "f-1",
    name: { en: "Commercial Registration.pdf", ar: "السجل التجاري.pdf" },
    type: "PDF",
    size: "1.2 MB",
    date: "14 Jan 2026",
    sync: "synced",
    folder: { en: "Legal Documents", ar: "المستندات القانونية" },
  },
  {
    id: "f-2",
    name: { en: "Articles of Association.docx", ar: "عقد التأسيس.docx" },
    type: "DOCX",
    size: "480 KB",
    date: "11 Jan 2026",
    sync: "synced",
    folder: { en: "Legal Documents", ar: "المستندات القانونية" },
  },
  {
    id: "f-3",
    name: { en: "Q4 Financial Statement.xlsx", ar: "القوائم المالية للربع الرابع.xlsx" },
    type: "XLSX",
    size: "2.4 MB",
    date: "08 Jan 2026",
    sync: "syncing",
    folder: { en: "Accounting", ar: "المحاسبة" },
  },
  {
    id: "f-4",
    name: { en: "VAT Certificate.pdf", ar: "شهادة ضريبة القيمة المضافة.pdf" },
    type: "PDF",
    size: "820 KB",
    date: "02 Jan 2026",
    sync: "synced",
    folder: { en: "Tax", ar: "الضرائب" },
  },
  {
    id: "f-5",
    name: { en: "Office Lease Scan.jpg", ar: "صورة عقد الإيجار.jpg" },
    type: "IMG",
    size: "3.1 MB",
    date: "22 Dec 2025",
    sync: "error",
    folder: { en: "Legal Documents", ar: "المستندات القانونية" },
  },
];

export const initialNotifs: Notif[] = [
  {
    id: "n-1",
    type: "invoice",
    title: { en: "New Invoice Available", ar: "فاتورة جديدة متاحة" },
    body: {
      en: "Invoice INV-2026-001 for Business Setup has been issued for SAR 12,500. Due 26 Jan 2026.",
      ar: "تم إصدار الفاتورة INV-2026-001 لخدمة تأسيس الأعمال بقيمة 12,500 ريال. تستحق في 26 يناير 2026.",
    },
    time: "12 Jan 2026 · 09:14",
    read: false,
  },
  {
    id: "n-2",
    type: "service",
    title: { en: "Service Status Updated", ar: "تم تحديث حالة الخدمة" },
    body: {
      en: "Business Setup & Company Registration progress moved to 75%. Municipality license is in review.",
      ar: "تم تحديث نسبة إنجاز خدمة تأسيس الأعمال إلى 75%. رخصة البلدية قيد المراجعة.",
    },
    time: "11 Jan 2026 · 16:40",
    read: false,
  },
  {
    id: "n-3",
    type: "file",
    title: { en: "New File Uploaded", ar: "تم رفع ملف جديد" },
    body: {
      en: "Commercial Registration.pdf was uploaded to your Google Drive folder.",
      ar: "تم رفع ملف السجل التجاري.pdf إلى مجلد جوجل درايف الخاص بك.",
    },
    time: "14 Jan 2026 · 10:05",
    read: false,
  },
  {
    id: "n-4",
    type: "invoice_update",
    title: { en: "Invoice Updated", ar: "تم تحديث الفاتورة" },
    body: {
      en: "Invoice INV-2026-002 has been marked as Paid. Thank you!",
      ar: "تم تعليم الفاتورة INV-2026-002 كمدفوعة. شكراً لك!",
    },
    time: "06 Jan 2026 · 12:00",
    read: true,
  },
  {
    id: "n-5",
    type: "announcement",
    title: { en: "Administrative Announcement", ar: "تنبيه إداري" },
    body: {
      en: "Sannad offices will operate on reduced hours during the national holiday week.",
      ar: "ستعمل مكاتب سند بساعات مخفضة خلال أسبوع الإجازة الوطنية.",
    },
    time: "02 Jan 2026 · 08:30",
    read: true,
  },
];

export const initialThreads: Thread[] = [
  {
    id: "t-1",
    dept: { en: "Customer Success", ar: "نجاح العملاء" },
    clientName: { en: "Ahmed Hassan", ar: "أحمد حسن" },
    avatar: "AH",
    messages: [
      { id: "m1", from: "agent", text: "Hello Ahmed! Your commercial registration file is now ready in your Drive folder.", time: "09:24" },
      { id: "m2", from: "client", text: "Great, thank you. When will the municipality license be issued?", time: "09:26" },
      { id: "m3", from: "agent", text: "We expect it within 10 working days. We'll notify you immediately.", time: "09:31" },
    ],
  },
  {
    id: "t-2",
    dept: { en: "Finance Department", ar: "القسم المالي" },
    clientName: { en: "Ahmed Hassan", ar: "أحمد حسن" },
    avatar: "FD",
    messages: [
      { id: "m1", from: "client", text: "Can I pay INV-2026-001 in two instalments?", time: "Yesterday" },
      { id: "m2", from: "agent", text: "Yes, we can split it. I'll send an updated invoice shortly.", time: "Yesterday" },
    ],
  },
  {
    id: "t-3",
    dept: { en: "Technical Support", ar: "الدعم الفني" },
    clientName: { en: "Ahmed Hassan", ar: "أحمد حسن" },
    avatar: "TS",
    messages: [
      { id: "m1", from: "client", text: "The Drive sync shows an error on one file.", time: "Mon" },
      { id: "m2", from: "agent", text: "Thanks for reporting, we are re-syncing it now.", time: "Mon" },
    ],
  },
];

export const courses: Course[] = [
  {
    id: "c-1",
    title: { en: "Business Fundamentals", ar: "أساسيات الأعمال" },
    category: { en: "Entrepreneurship", ar: "ريادة الأعمال" },
    progress: 65,
    color: "from-orange-400 to-orange-600",
    lessons: [
      { title: { en: "Choosing a legal structure", ar: "اختيار الكيان القانوني" }, min: 12 },
      { title: { en: "Writing a business plan", ar: "كتابة خطة العمل" }, min: 18 },
      { title: { en: "Understanding licensing", ar: "فهم التراخيص" }, min: 9 },
    ],
  },
  {
    id: "c-2",
    title: { en: "Bookkeeping Essentials", ar: "أساسيات مسك الدفاتر" },
    category: { en: "Finance", ar: "المالية" },
    progress: 30,
    color: "from-amber-400 to-orange-500",
    lessons: [
      { title: { en: "Chart of accounts", ar: "شجرة الحسابات" }, min: 14 },
      { title: { en: "Monthly closing", ar: "الإقفال الشهري" }, min: 22 },
    ],
  },
  {
    id: "c-3",
    title: { en: "VAT & Tax Compliance", ar: "الامتثال الضريبي" },
    category: { en: "Compliance", ar: "الامتثال" },
    progress: 0,
    color: "from-orange-500 to-red-500",
    lessons: [
      { title: { en: "VAT registration", ar: "التسجيل الضريبي" }, min: 11 },
      { title: { en: "Filing returns", ar: "تقديم الإقرارات" }, min: 16 },
      { title: { en: "Avoiding penalties", ar: "تجنب الغرامات" }, min: 8 },
    ],
  },
];

export type Client = {
  id: string;
  name: Bi;
  code: string;
  status: "Active" | "Expired";
  services: number;
  expiry: string;
  email: string;
  phone: string;
};

export const clients: Client[] = [
  { id: "cl-1", name: { en: "Ahmed Hassan", ar: "أحمد حسن" }, code: "SND-10245", status: "Active", services: 5, expiry: "13 Jan 2027", email: "ahmed.hassan@example.com", phone: "+966 55 123 4567" },
  { id: "cl-2", name: { en: "Nour Trading Co.", ar: "شركة نور التجارية" }, code: "SND-10246", status: "Active", services: 3, expiry: "02 Mar 2027", email: "info@nourtrading.com", phone: "+966 55 998 1122" },
  { id: "cl-3", name: { en: "Layla Al-Sayed", ar: "ليلى السيد" }, code: "SND-10247", status: "Active", services: 2, expiry: "19 Nov 2026", email: "layla@sayedgroup.com", phone: "+966 54 771 3390" },
  { id: "cl-4", name: { en: "Delta Logistics", ar: "دلتا للخدمات اللوجستية" }, code: "SND-10248", status: "Expired", services: 1, expiry: "08 Dec 2025", email: "ops@deltalog.com", phone: "+966 56 220 7788" },
  { id: "cl-5", name: { en: "Omar Khalid", ar: "عمر خالد" }, code: "SND-10249", status: "Active", services: 4, expiry: "27 Jul 2027", email: "omar.k@example.com", phone: "+966 50 664 2211" },
  { id: "cl-6", name: { en: "Bright Media Agency", ar: "وكالة برايت الإعلامية" }, code: "SND-10250", status: "Active", services: 2, expiry: "14 Sep 2026", email: "hello@brightmedia.co", phone: "+966 53 118 9034" },
];

export const initialProfile = {
  name: { en: "Ahmed Hassan", ar: "أحمد حسن" },
  company: { en: "Hassan Trading Establishment", ar: "مؤسسة حسن التجارية" },
  code: "SND-10245",
  status: "Active",
  created: "13 Jan 2025",
  expiry: "13 Jan 2027",
  email: "ahmed.hassan@example.com",
  phones: ["+966 55 123 4567", "+966 11 480 2233"],
  drive: [
    { label: { en: "Legal Documents", ar: "المستندات القانونية" }, url: "https://drive.google.com/sannad/legal" },
    { label: { en: "Accounting", ar: "المحاسبة" }, url: "https://drive.google.com/sannad/accounting" },
  ],
};

export const roleMatrix = {
  roles: ["Super Admin", "Admin", "Finance", "Support Agent"],
  perms: [
    { key: "manage_users", label: { en: "Manage Users", ar: "إدارة المستخدمين" } },
    { key: "manage_services", label: { en: "Manage Services", ar: "إدارة الخدمات" } },
    { key: "manage_invoices", label: { en: "Manage Invoices", ar: "إدارة الفواتير" } },
    { key: "manage_files", label: { en: "Manage Files", ar: "إدارة الملفات" } },
    { key: "send_notifications", label: { en: "Send Notifications", ar: "إرسال الإشعارات" } },
    { key: "chat_center", label: { en: "Chat Center", ar: "مركز المحادثات" } },
    { key: "financial_reports", label: { en: "Financial Reports", ar: "التقارير المالية" } },
    { key: "manage_academy", label: { en: "Manage Academy", ar: "إدارة الأكاديمية" } },
    { key: "roles_permissions", label: { en: "Roles & Permissions", ar: "الأدوار والصلاحيات" } },
  ],
};

export const defaultPerms: Record<string, Record<string, boolean>> = {
  "Super Admin": Object.fromEntries(roleMatrix.perms.map((p) => [p.key, true])),
  Admin: Object.fromEntries(roleMatrix.perms.map((p) => [p.key, p.key !== "roles_permissions"])),
  Finance: Object.fromEntries(
    roleMatrix.perms.map((p) => [p.key, ["manage_invoices", "financial_reports", "send_notifications"].includes(p.key)])
  ),
  "Support Agent": Object.fromEntries(
    roleMatrix.perms.map((p) => [p.key, ["chat_center", "manage_files", "send_notifications"].includes(p.key)])
  ),
};
