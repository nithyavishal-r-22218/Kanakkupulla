"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import type { Icon as TablerIcon } from "@tabler/icons-react";
import {
  IconBell as Bell,
  IconBook2 as BookOpen,
  IconCalendar as Calendar,
  IconCalendarCheck as CalendarCheck,
  IconCamera as Camera,
  IconChartBar as BarChart3,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconClipboardList as ClipboardList,
  IconClock as Clock,
  IconCurrencyDollar as CircleDollarSign,
  IconCurrencyDollar as DollarSign,
  IconDotsVertical as DotsVertical,
  IconDownload as Download,
  IconEye as Eye,
  IconFilter as Filter,
  IconGift as Gift,
  IconHeart as Heart,
  IconHome as Home,
  IconMail as Mail,
  IconMapPin as MapPin,
  IconPackage as Package,
  IconPencil as Pencil,
  IconPhone as Phone,
  IconSearch as Search,
  IconSettings as Settings,
  IconShoppingCart as ShoppingCart,
  IconTrash as Trash,
  IconTrendingUp as TrendingUp,
  IconUserCircle as UserRound,
  IconX as X,
} from "@tabler/icons-react";

type Expense = {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  tax: number;
  paymentMethod: string;
  status: string;
  note: string | null;
  spentAt: string;
};

type Budget = {
  id: string;
  category: string;
  limit: number;
  period: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type BookingFormState = {
  advancePaid: string;
  category: string;
  client: string;
  date: string;
  email: string;
  location: string;
  packagePrice: string;
  phone: string;
  status: string;
  time: string;
};

type RegisteredBooking = {
  advancePaid?: string;
  category: string;
  client: string;
  date: string;
  email?: string;
  eventLabel: string;
  id: string;
  initials: string;
  location: string;
  outstandingBalance?: string;
  packagePrice?: string;
  phone?: string;
  rawAdvancePaid: string;
  rawPackagePrice: string;
  startTime: string;
  status: string;
  time: string;
  tone: string;
};

type CalendarDay = {
  date: string;
  day: string;
  event?: string;
  muted: boolean;
  today: boolean;
  tone?: string;
};

type CalendarViewMode = "Month" | "Week" | "Day";
type BookingManagementTab = "Overview" | "All bookings";

type AllBookingRow = {
  amount: string;
  category: string;
  client: string;
  date: string;
  dateTime: string;
  email?: string;
  id: string;
  initials: string;
  location: string;
  outstandingBalance?: string;
  packagePrice?: string;
  phone?: string;
  rawAdvancePaid?: string;
  rawPackagePrice?: string;
  service: string;
  source: "registered" | "sample";
  startTime?: string;
  status: string;
  statusTone: string;
};

const colors = {
  blue: "#5087f5",
  green: "#19b66a",
  ink: "#182033",
  line: "#dde2ea",
  muted: "#7a8190",
  navy: "#0f2342",
  navySoft: "#1c3354",
  orange: "#ff9800",
  page: "#f6f7fa",
  violet: "#b66cff",
};

const navItems = [
  { icon: Home, label: "Dashboard" },
  { icon: Calendar, label: "Bookings" },
  { icon: Camera, label: "Client Galleries" },
  { icon: Gift, label: "Gifts & Frames" },
  { icon: BarChart3, label: "Analytics" },
] as const;

type NavLabel = (typeof navItems)[number]["label"];

const shoots = [
  {
    amount: "₹85,000.00",
    detail: "Wedding - Oct 28, 2025 - LeRoyal Meridien",
    icon: Heart,
    status: "PAID DEPOSIT",
    title: "Subramani & Anitha Wedding",
    tone: "orange",
  },
  {
    amount: "₹12,000.00",
    detail: "Baby & Kids - Oct 30, 2025 - Studio Session",
    icon: Calendar,
    status: "FULL PAYMENT PENDING",
    title: "Vihaan's 1st Birthday",
    tone: "blue",
  },
  {
    amount: "+ ₹15,000.00",
    detail: "Fashion - Nov 02, 2025 - Outdoor Location",
    icon: Camera,
    status: "CONTRACT SIGNED",
    title: "Meenakshi Portfolio",
    tone: "green",
  },
  {
    amount: "₹45,000.00",
    detail: "Corporate - Nov 05, 2025 - ITC Grand Chola",
    icon: TrendingUp,
    status: "QUOTE SENT",
    title: "Titan Corporate Event",
    tone: "violet",
  },
];

const orders = [
  {
    color: colors.orange,
    count: "12 / 15",
    detail: "PRINTING - DELIVERY IN 2 DAYS",
    name: "Personalized Photo Mugs",
    progress: 80,
  },
  {
    color: colors.green,
    count: "4 / 4",
    detail: "READY FOR PICKUP",
    name: "Teakwood Wedding Frames",
    progress: 100,
  },
  {
    color: colors.navySoft,
    count: "2 / 10",
    detail: "DESIGN PHASE - WAITING FOR APPROVAL",
    name: "Silk Throw Pillows",
    progress: 20,
  },
];

const bookingStats = [
  { icon: CalendarCheck, label: "Total Bookings (MoM)", tag: "+12% vs LY", tone: "orange", value: "124" },
  { icon: Camera, label: "Upcoming Shoots (7d)", tag: "Active", tone: "navy", value: "18" },
  { icon: ClipboardList, label: "Pending Confirmations", tag: "Priority", tone: "red", value: "7" },
  { icon: CircleDollarSign, label: "Revenue Forecast", tag: "Projected", tone: "green", value: "₹42,850" },
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarViewModes: CalendarViewMode[] = ["Month", "Week", "Day"];
const bookingManagementTabs: BookingManagementTab[] = ["Overview", "All bookings"];
const allBookingCategoryFilters = ["All Bookings", "Wedding", "Fashion", "Baby & Kids", "Corporate"];
const allBookingStatusFilters = ["All Status", "Confirmed", "Partial", "Pending", "In Progress"];
const allBookingDateFilters = ["All Dates", "This Month", "Next 30 Days", "Oct 12 - Oct 28"];
const monthPickerMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const bookingCategoryOptions = ["Wedding", "Fashion", "Kids", "Corporate", "Portrait"];
const bookingStatusOptions = ["Confirmed", "In Progress", "Pending"];

const baseBookingForm: Omit<BookingFormState, "date"> = {
  advancePaid: "0.00",
  category: "Wedding",
  client: "",
  email: "",
  location: "Kanakkupulla Studio",
  packagePrice: "0.00",
  phone: "",
  status: "Confirmed",
  time: "10:00",
};

const calendarEventSchedule: Partial<Record<number, { event: string; tone: string }>> = {
  4: { event: "Wedding", tone: "navy" },
  6: { event: "Fashion", tone: "orange" },
  7: { event: "Kids Mil.", tone: "navy" },
  10: { event: "Wedding", tone: "navy" },
  14: { event: "Fashion", tone: "orange" },
  17: { event: "Corporate", tone: "navy" },
  19: { event: "Kids", tone: "orange" },
  24: { event: "Portrait", tone: "navy" },
  26: { event: "Wedding", tone: "orange" },
  30: { event: "Retouch", tone: "navy" },
};

const bookingDetails = [
  {
    category: "Wedding",
    client: "Sarah & Tom Johnson",
    id: "ABK-1092",
    initials: "ST",
    location: "Taj Connemara",
    status: "Confirmed",
    time: "Oct 03, 2025 - 10:00 AM",
    tone: "green",
  },
  {
    category: "Fashion",
    client: "Vogue FW Studio Shoot",
    id: "ABK-1095",
    initials: "VA",
    location: "Studio A",
    status: "In Progress",
    time: "Oct 05, 2025 - 09:00 AM",
    tone: "orange",
  },
  {
    category: "Kids",
    client: "Miller Family Session",
    id: "ABK-1098",
    initials: "MF",
    location: "Natural Light Room",
    status: "Pending",
    time: "Oct 07, 2025 - 03:30 PM",
    tone: "muted",
  },
  {
    category: "Wedding",
    client: "Chen Ceremony Gala",
    id: "ABK-1102",
    initials: "CG",
    location: "ITC Grand Chola",
    status: "Confirmed",
    time: "Oct 10, 2025 - 05:00 PM",
    tone: "green",
  },
];

const allBookingTableRows: AllBookingRow[] = [
  {
    amount: "₹45,000",
    category: "Wedding",
    client: "Amala Varghese",
    date: "2023-10-24",
    dateTime: "Oct 24, 2023\n04:30 PM - 07:00 PM",
    id: "ABK-1048",
    initials: "AV",
    location: "Marina Beach, CH",
    service: "Pre-wedding Outdoor",
    source: "sample",
    status: "Confirmed",
    statusTone: "green",
  },
  {
    amount: "₹82,000",
    category: "Fashion",
    client: "Karthik Raja",
    date: "2023-10-26",
    dateTime: "Oct 26, 2023\n10:00 AM - 06:00 PM",
    id: "ABK-1052",
    initials: "KR",
    location: "Studio B, Adyar",
    service: "Summer Collection '24",
    source: "sample",
    status: "Partial",
    statusTone: "orange",
  },
  {
    amount: "₹28,500",
    category: "Baby & Kids",
    client: "Priya Sharma",
    date: "2023-10-30",
    dateTime: "Oct 30, 2023\n11:00 AM - 02:00 PM",
    id: "ABK-1058",
    initials: "PS",
    location: "The Grand Hyatt, T-Nagar",
    service: "1st Birthday Party",
    source: "sample",
    status: "Pending",
    statusTone: "red",
  },
  {
    amount: "₹55,000",
    category: "Corporate",
    client: "Rahul Mehta",
    date: "2023-11-02",
    dateTime: "Nov 02, 2023\n09:00 AM - 05:00 PM",
    id: "ABK-1061",
    initials: "RM",
    location: "DLF Cybercity, Porur",
    service: "Corporate Headshots",
    source: "sample",
    status: "In Progress",
    statusTone: "blue",
  },
];

const toneStyles: Record<string, { amount: string; bg: string; icon: string }> = {
  blue: { amount: colors.ink, bg: "#e9f1ff", icon: colors.blue },
  green: { amount: colors.green, bg: "#dcffe9", icon: colors.green },
  orange: { amount: colors.orange, bg: "#fff0d7", icon: colors.orange },
  violet: { amount: colors.ink, bg: "#f3e7ff", icon: colors.violet },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    minimumFractionDigits: 2,
    style: "currency",
  }).format(amount);
}

function parseMoneyValue(value: string) {
  const amount = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function getOutstandingBalance(packagePrice: string, advancePaid: string) {
  return Math.max(parseMoneyValue(packagePrice) - parseMoneyValue(advancePaid), 0);
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RK"
  );
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getEmptyBookingForm(date = formatDateInputValue(new Date())): BookingFormState {
  return { ...baseBookingForm, date };
}

function getBookingFormFromRegisteredBooking(booking: RegisteredBooking): BookingFormState {
  return {
    advancePaid: booking.rawAdvancePaid,
    category: booking.category,
    client: booking.client,
    date: booking.date,
    email: booking.email ?? "",
    location: booking.location,
    packagePrice: booking.rawPackagePrice,
    phone: booking.phone ?? "",
    status: booking.status,
    time: booking.startTime,
  };
}

function getNextRegisteredBookingId(registeredBookings: RegisteredBooking[]) {
  const currentMaxId = registeredBookings.reduce((maxId, booking) => {
    const numericId = Number(booking.id.replace(/\D/g, ""));

    return Number.isFinite(numericId) ? Math.max(maxId, numericId) : maxId;
  }, 1202);

  return `ABK-${String(currentMaxId + 1).padStart(4, "0")}`;
}

function buildRegisteredBooking(form: BookingFormState, id: string): RegisteredBooking {
  const advancePaid = parseMoneyValue(form.advancePaid);
  const packagePrice = parseMoneyValue(form.packagePrice);
  const client = form.client.trim();

  return {
    advancePaid: formatCurrency(advancePaid),
    category: form.category,
    client,
    date: form.date,
    email: form.email.trim(),
    eventLabel: form.category,
    id,
    initials: getInitials(client),
    location: form.location.trim(),
    outstandingBalance: formatCurrency(Math.max(packagePrice - advancePaid, 0)),
    packagePrice: formatCurrency(packagePrice),
    phone: form.phone.trim(),
    rawAdvancePaid: form.advancePaid,
    rawPackagePrice: form.packagePrice,
    startTime: form.time,
    status: form.status,
    time: formatBookingDateTime(form.date, form.time),
    tone: getStatusTone(form.status),
  };
}

function getCalendarView(cursor: Date, mode: CalendarViewMode) {
  const today = new Date();
  const focusDate = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
  const focusMonth = focusDate.getMonth();
  let dayCount = 42;
  let label = focusDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  let startDate = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);

  if (mode === "Month") {
    startDate = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1 - startDate.getDay());
  }

  if (mode === "Week") {
    dayCount = 7;
    startDate = new Date(focusDate);
    startDate.setDate(focusDate.getDate() - focusDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    label = `${startDate.toLocaleDateString("en-US", { day: "2-digit", month: "short" })} - ${endDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }

  if (mode === "Day") {
    dayCount = 1;
    startDate = focusDate;
    label = focusDate.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
  }

  const todayValue = formatDateInputValue(today);

  const days: CalendarDay[] = Array.from({ length: dayCount }, (_, index) => {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + index);
    const date = formatDateInputValue(cellDate);
    const isFocusMonth = cellDate.getMonth() === focusMonth;
    const scheduledEvent = isFocusMonth ? calendarEventSchedule[cellDate.getDate()] : undefined;

    return {
      date,
      day: String(cellDate.getDate()),
      event: scheduledEvent?.event,
      muted: mode === "Month" ? !isFocusMonth : false,
      today: date === todayValue,
      tone: scheduledEvent?.tone,
    };
  });

  return {
    days,
    label,
    modeClass: `calendar-grid-${mode.toLowerCase()}`,
    weekdayLabels: mode === "Month"
      ? weekdays
      : days.map((day) => new Date(`${day.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" })),
  };
}

function getShiftedCalendarCursor(cursor: Date, mode: CalendarViewMode, direction: number) {
  if (mode === "Month") {
    return new Date(cursor.getFullYear(), cursor.getMonth() + direction, 1);
  }

  const nextCursor = new Date(cursor);
  nextCursor.setDate(cursor.getDate() + direction * (mode === "Week" ? 7 : 1));
  return nextCursor;
}

function formatBookingDateTime(date: string, time: string) {
  const bookingDate = new Date(`${date}T${time}`);

  return `${bookingDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} - ${bookingDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function getStatusTone(status: string) {
  if (status === "Confirmed") {
    return "green";
  }

  if (status === "In Progress") {
    return "orange";
  }

  return "muted";
}

function getTableStatusTone(status: string) {
  if (status === "Confirmed") {
    return "green";
  }

  if (status === "Partial") {
    return "orange";
  }

  if (status === "In Progress") {
    return "blue";
  }

  if (status === "Pending") {
    return "red";
  }

  return "muted";
}

function formatTableDateTime(date: string, time: string) {
  const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeLabel = time.includes(" - ") ? time.split(" - ").at(-1) : time;

  return `${dateLabel}\n${timeLabel}`;
}

function getAllBookingRows(registeredBookings: RegisteredBooking[]): AllBookingRow[] {
  const registeredRows = registeredBookings.map((booking) => ({
    amount: booking.packagePrice ?? "₹0.00",
    category: booking.category === "Kids" ? "Baby & Kids" : booking.category,
    client: booking.client,
    date: booking.date,
    dateTime: formatTableDateTime(booking.date, booking.time),
    email: booking.email,
    id: booking.id,
    initials: booking.initials,
    location: booking.location,
    outstandingBalance: booking.outstandingBalance,
    packagePrice: booking.packagePrice,
    phone: booking.phone,
    rawAdvancePaid: booking.rawAdvancePaid,
    rawPackagePrice: booking.rawPackagePrice,
    service: `${booking.category} Shoot`,
    source: "registered" as const,
    startTime: booking.startTime,
    status: booking.status,
    statusTone: getTableStatusTone(booking.status),
  }));

  const detailRows = bookingDetails.map((booking, index) => ({
    amount: ["₹68,000", "₹36,500", "₹18,000", "₹92,000"][index] ?? "₹24,000",
    category: booking.category === "Kids" ? "Baby & Kids" : booking.category,
    client: booking.client,
    date: ["2025-10-03", "2025-10-05", "2025-10-07", "2025-10-10"][index] ?? "2025-10-12",
    dateTime: booking.time,
    id: booking.id,
    initials: booking.initials,
    location: booking.location,
    service: `${booking.category} Session`,
    source: "sample" as const,
    status: booking.status,
    statusTone: getTableStatusTone(booking.status),
  }));

  return [...registeredRows, ...allBookingTableRows, ...detailRows];
}

function isBookingRowMatchingSearch(row: AllBookingRow, query: string) {
  const searchValue = query.trim().toLowerCase();

  if (!searchValue) {
    return true;
  }

  return [
    row.amount,
    row.category,
    row.client,
    row.date,
    row.dateTime,
    row.email,
    row.id,
    row.location,
    row.phone,
    row.service,
    row.status,
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(searchValue));
}

function exportBookingRows(rows: AllBookingRow[]) {
  const headers = ["Booking ID", "Client", "Service", "Category", "Date & Time", "Location", "Amount", "Status", "Phone", "Email"];
  const escapeCsvValue = (value = "") => `"${value.replace(/"/g, "\"\"").replace(/\n/g, " ")}"`;
  const csvRows = rows.map((row) => [
    row.id,
    row.client,
    row.service,
    row.category,
    row.dateTime,
    row.location,
    row.amount,
    row.status,
    row.phone ?? "",
    row.email ?? "",
  ].map(escapeCsvValue).join(","));
  const csv = [headers.map(escapeCsvValue).join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "kanakkupulla-bookings.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function isBookingInDateFilter(date: string, filter: string) {
  if (filter === "All Dates") {
    return true;
  }

  const rowDate = new Date(`${date}T00:00:00`);

  if (filter === "This Month") {
    const today = new Date();
    return rowDate.getFullYear() === today.getFullYear() && rowDate.getMonth() === today.getMonth();
  }

  if (filter === "Next 30 Days") {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30);

    return rowDate >= startDate && rowDate <= endDate;
  }

  if (filter === "Oct 12 - Oct 28") {
    const startDate = new Date("2023-10-12T00:00:00");
    const endDate = new Date("2023-10-28T23:59:59");

    return rowDate >= startDate && rowDate <= endDate;
  }

  return true;
}

function getTableCategoryStyle(category: string) {
  if (category === "Wedding") {
    return { backgroundColor: "#fff0d7", borderColor: "#e7c99a", color: "#9b5d20" };
  }

  if (category === "Fashion") {
    return { backgroundColor: "#e9f1ff", borderColor: "#b9cef7", color: colors.blue };
  }

  if (category === "Baby & Kids") {
    return { backgroundColor: "#fff2de", borderColor: "#efcfaa", color: "#9a5d20" };
  }

  if (category === "Corporate") {
    return { backgroundColor: "#eef1f5", borderColor: "#cfd6e2", color: colors.navy };
  }

  return { backgroundColor: "#eef1f5", borderColor: "#dde2ea", color: colors.muted };
}

export function ExpenseDashboard({
  budgets,
  expenses,
  teammateCount,
  user,
}: {
  budgets: Budget[];
  expenses: Expense[];
  teammateCount: number;
  user: User;
}) {
  const [activeView, setActiveView] = useState<NavLabel>("Dashboard");
  const [bookingForm, setBookingForm] = useState<BookingFormState>(() => getEmptyBookingForm());
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [registeredBookings, setRegisteredBookings] = useState<RegisteredBooking[]>([]);
  const dataSignature = `${budgets.length}-${expenses.length}-${teammateCount}-${user.id}`;
  const total = 1245200;
  const shotCount = 48;
  const retouchCount = 12;
  const bookingCount = 156;
  const galleryCount = 8;
  const orderCount = 24;
  const displayName = "Rajesh Kumar";
  const role = "STUDIO OWNER";
  const monthlyRevenue = "₹12.4L";
  const metrics = [
    { icon: BookOpen, label: "Total Bookings", tag: "+12%", value: String(bookingCount) },
    { icon: DollarSign, label: "Monthly Revenue", tag: "Monthly", value: monthlyRevenue },
    { icon: Package, label: "Gallery Deliveries", tag: "Priority", value: `${galleryCount} Due` },
    { icon: Gift, label: "Gift Shop Orders", tag: "Active", value: String(orderCount) },
  ];
  const openBookingForm = (date = formatDateInputValue(new Date())) => {
    setActiveView("Bookings");
    setEditingBookingId(null);
    setBookingForm(getEmptyBookingForm(date));
    setIsBookingFormOpen(true);
  };
  const closeBookingForm = () => {
    setEditingBookingId(null);
    setIsBookingFormOpen(false);
  };
  const openEditBookingForm = (bookingId: string) => {
    const booking = registeredBookings.find((registeredBooking) => registeredBooking.id === bookingId);

    if (!booking) {
      return;
    }

    setActiveView("Bookings");
    setBookingForm(getBookingFormFromRegisteredBooking(booking));
    setEditingBookingId(booking.id);
    setIsBookingFormOpen(true);
  };
  const deleteRegisteredBooking = (bookingId: string) => {
    setRegisteredBookings((currentBookings) => currentBookings.filter((booking) => booking.id !== bookingId));
  };
  const handleBookingFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextBooking = buildRegisteredBooking(bookingForm, editingBookingId ?? getNextRegisteredBookingId(registeredBookings));

    setRegisteredBookings((currentBookings) => {
      if (!editingBookingId) {
        return [nextBooking, ...currentBookings];
      }

      return currentBookings.map((booking) => (booking.id === editingBookingId ? nextBooking : booking));
    });
    closeBookingForm();
  };

  return (
    <div className="studio-dashboard min-h-screen bg-[var(--studio-page)] text-[var(--studio-ink)] md:flex" data-source={dataSignature}>
      <aside className="hidden w-[232px] shrink-0 border-r border-[var(--studio-line)] bg-white md:flex md:flex-col">
        <div className="logo-stage flex h-44 items-center justify-center px-0">
          <Image
            alt="Kanakkupulla logo"
            className="logo-mark h-[152px] w-[228px] object-contain"
            height={152}
            priority
            src="/Kanakkupulla.png"
            width={228}
          />
        </div>

        <nav className="mt-6 flex-1 space-y-2">
          {navItems.map((item, index) => (
            <NavButton
              key={item.label}
              active={activeView === item.label}
              delay={index * 0.04}
              icon={item.icon}
              label={item.label}
              onSelect={() => setActiveView(item.label)}
            />
          ))}
        </nav>

        <div className="border-t border-[var(--studio-line)] px-4 py-5">
          <button className="nav-item w-full" type="button">
            <Settings size={17} strokeWidth={2.2} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-[var(--studio-page)]">
        <header className="flex h-16 items-center justify-between border-b border-[var(--studio-line)] bg-white/85 px-8 backdrop-blur">
          <h1 className="text-[20px] font-extrabold tracking-[-0.01em] text-[var(--studio-ink)]">
            {activeView === "Bookings" ? "Booking Management" : "Studio Management"}
          </h1>

          <div className="flex items-center gap-6">
            <label className="search-pill hidden h-9 items-center gap-2.5 rounded-full border border-[var(--studio-line)] bg-[#f7f8fa] px-4 md:flex">
              <span className="sr-only">Search bookings and clients</span>
              <input
                className="w-[190px] bg-transparent text-[12px] font-medium text-[var(--studio-ink)] outline-none placeholder:text-[#a3aab6]"
                onChange={(event) => setBookingSearchQuery(event.target.value)}
                placeholder={activeView === "Bookings" ? "Search bookings, clients, or dates..." : "Search bookings, clients..."}
                type="search"
                value={bookingSearchQuery}
              />
              <Search className="text-[#646c7a]" size={17} strokeWidth={2.5} />
            </label>

            <button
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-full text-[var(--studio-ink)] transition hover:bg-[#f0f2f6]"
              type="button"
            >
              <Bell size={17} strokeWidth={2.3} />
              <span className="notification-dot" />
            </button>

            <div className="hidden h-9 items-center gap-3.5 border-l border-[var(--studio-line)] pl-5 md:flex">
              <div className="text-right leading-tight">
                <p className="text-[12px] font-extrabold text-[var(--studio-ink)]">{displayName}</p>
                <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--studio-orange)]">
                  {role}
                </p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--studio-orange)] text-[12px] font-black text-white shadow-[0_8px_20px_rgba(255,152,0,0.25)]">
                {getInitials(displayName)}
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard-canvas px-6 py-7 md:px-0">
          {activeView === "Bookings" ? (
            <BookingsView
              registeredBookings={registeredBookings}
              searchQuery={bookingSearchQuery}
              onDateSelect={openBookingForm}
              onDeleteBooking={deleteRegisteredBooking}
              onEditBooking={openEditBookingForm}
            />
          ) : (
            <>
          <div className="hero-card dashboard-rise rounded-[10px] bg-[var(--studio-navy)] p-5 text-white shadow-[0_14px_34px_rgba(15,35,66,0.18)] md:min-h-[158px]">
            <div className="relative z-10 flex h-full flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/72">
                  Total Combined Earnings
                </p>
                <p className="mt-2.5 text-[38px] font-black leading-none tracking-[-0.035em]">
                  {formatCurrency(total)}
                </p>
                <div className="mt-4 flex flex-wrap gap-3.5">
                  <HeroPill label="Shots Completed" value={String(shotCount)} />
                  <HeroPill label="Pending Retouch" value={String(retouchCount)} />
                </div>
              </div>

              <div className="growth-card rounded-[6px] border border-white/15 bg-white/10 px-5 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur md:w-[112px]">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/75">
                  Growth Velocity
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[22px] font-black leading-none text-[#ffd7a1]">62%</span>
                  <TrendingUp size={14} strokeWidth={2.6} />
                </div>
                <p className="mt-2 text-[10px] font-semibold text-white/50">vs last month</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {metrics.map((card, index) => (
              <MetricCard key={card.label} {...card} delay={0.12 + index * 0.07} />
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-[2.07fr_1fr]">
            <section className="dashboard-rise" style={{ animationDelay: "0.34s" }}>
              <div className="mb-3.5 flex items-center justify-between">
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--studio-ink)]">
                  Upcoming Shoots
                </h2>
                <button
                  className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[var(--studio-ink)] transition hover:text-[var(--studio-orange)]"
                  type="button"
                >
                  <span>View Calendar</span>
                  <Calendar size={13} strokeWidth={2.4} />
                </button>
              </div>

              <div className="space-y-3">
                {shoots.map((shoot, index) => (
                  <ShootRow key={shoot.title} {...shoot} delay={0.42 + index * 0.06} />
                ))}
              </div>
            </section>

            <section className="dashboard-rise" style={{ animationDelay: "0.42s" }}>
              <div className="mb-3.5 flex items-center justify-between">
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--studio-ink)]">
                  Gift Shop Tracking
                </h2>
                <ShoppingCart className="text-[#9b5d20]" size={17} strokeWidth={2.3} />
              </div>

              <div className="space-y-5 rounded-[2px] bg-transparent">
                {orders.map((order, index) => (
                  <TrackingRow key={order.name} {...order} delay={0.5 + index * 0.08} />
                ))}

                <button className="manage-button w-full" type="button">
                  Manage All Orders
                </button>

                <div className="assistant-note">
                  <p>
                    Gift shop sales are up 45% since last month. Consider offering a combo package for Baby & Kids shoots to drive more frame orders!
                  </p>
                  <strong>- Kanakkupulla AI Assistant</strong>
                </div>
              </div>
            </section>
          </div>

          <footer className="mt-6 flex flex-col gap-3.5 border-t border-[var(--studio-line)] pt-5 text-[10px] uppercase tracking-[0.12em] text-[var(--studio-muted)] md:flex-row md:items-end md:justify-between">
            <FooterStat icon={Clock} label="Next Delivery Due" value="Tomorrow, 11:00 AM" />
            <FooterStat accent icon={TrendingUp} label="Studio Reputation" value="Top Rated (4.9)" />
            <FooterStat icon={Package} label="Storage Used" value="2.4 TB / 5 TB" />
            <p className="ml-auto hidden text-right text-[10px] font-semibold italic normal-case tracking-normal text-[var(--studio-muted)] md:block">
              Precision in every frame.
            </p>
          </footer>
            </>
          )}
        </section>

        <button aria-label="Create camera booking" className="floating-camera" onClick={() => openBookingForm()} type="button">
          <Camera size={31} strokeWidth={2.5} />
        </button>
      </main>

      {isBookingFormOpen ? (
        <BookingRegistrationForm
          isEditing={Boolean(editingBookingId)}
          form={bookingForm}
          onClose={closeBookingForm}
          onFieldChange={(field, value) => setBookingForm((currentForm) => ({ ...currentForm, [field]: value }))}
          onSubmit={handleBookingFormSubmit}
        />
      ) : null}

      <style>{`
        .studio-dashboard {
          --studio-green: ${colors.green};
          --studio-ink: ${colors.ink};
          --studio-line: ${colors.line};
          --studio-muted: ${colors.muted};
          --studio-navy: ${colors.navy};
          --studio-navy-soft: ${colors.navySoft};
          --studio-orange: ${colors.orange};
          --studio-page: ${colors.page};
          font-family: var(--font-poppins), var(--font-outfit), sans-serif;
        }

        .studio-dashboard button,
        .studio-dashboard input,
        .studio-dashboard .shoot-card,
        .studio-dashboard .metric-card,
        .studio-dashboard .hero-card,
        .studio-dashboard .booking-card,
        .studio-dashboard .booking-detail,
        .studio-dashboard .calendar-cell,
        .studio-dashboard .booking-action {
          transition: background-color 260ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 260ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 260ms cubic-bezier(0.2, 0.8, 0.2, 1), color 260ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 260ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .search-pill:focus-within {
          border-color: rgba(255, 152, 0, 0.58);
          box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.09);
        }

        .dashboard-canvas {
          width: 100%;
        }

        @media (min-width: 768px) {
          .dashboard-canvas {
            margin-left: 24px;
            margin-right: 24px;
            max-width: 1120px;
            width: min(1120px, calc(100% - 48px));
          }
        }

        .notification-dot {
          animation: studioPulse 1.8s ease-in-out infinite;
          background: #df1f32;
          border: 2px solid #ffffff;
          border-radius: 999px;
          height: 8px;
          position: absolute;
          right: 9px;
          top: 9px;
          width: 8px;
        }

        .logo-stage {
          overflow: hidden;
        }

        .logo-mark {
          flex: 0 0 auto;
        }

        .nav-item {
          align-items: center;
          color: #596171;
          display: flex;
          font-size: 12px;
          font-weight: 800;
          gap: 12px;
          height: 42px;
          padding: 0 18px;
          position: relative;
          text-align: left;
        }

        .nav-item:hover {
          background: #f5f6f8;
          color: var(--studio-ink);
          transform: translateX(2px);
        }

        .nav-item-active {
          background: #edeff3;
          color: var(--studio-ink);
        }

        .nav-item-active::after {
          background: var(--studio-orange);
          bottom: 0;
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          width: 2px;
        }

        .manage-button:hover,
        .floating-camera:hover {
          box-shadow: 0 20px 34px rgba(255, 152, 0, 0.28);
          transform: translateY(-2px);
        }

        .hero-card {
          overflow: hidden;
          position: relative;
        }

        .hero-card::before {
          background: radial-gradient(circle, rgba(255, 255, 255, 0.14), transparent 62%);
          content: "";
          height: 260px;
          position: absolute;
          right: -92px;
          top: -118px;
          width: 260px;
        }

        .hero-card::after {
          animation: studioSheen 5.5s ease-in-out infinite;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.13), transparent);
          content: "";
          height: 100%;
          left: -35%;
          position: absolute;
          top: 0;
          transform: skewX(-18deg);
          width: 25%;
        }

        .hero-pill {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          min-width: 108px;
          padding: 7px 13px;
        }

        .growth-card:hover,
        .hero-pill:hover {
          transform: translateY(-3px);
        }

        .metric-card {
          animation: studioRise 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: #ffffff;
          border: 1px solid var(--studio-line);
          border-radius: 8px;
          box-shadow: 0 10px 24px rgba(24, 32, 51, 0.035);
          min-height: 124px;
          padding: 16px 20px;
        }

        .metric-card:hover,
        .shoot-card:hover {
          border-color: rgba(255, 152, 0, 0.35);
          box-shadow: 0 22px 44px rgba(24, 32, 51, 0.09);
          transform: translateY(-4px);
        }

        .metric-icon {
          background: #eef1f5;
          border-radius: 6px;
          color: #333b4a;
          display: grid;
          height: 36px;
          place-items: center;
          width: 36px;
        }

        .metric-tag {
          background: #f2f4f7;
          border-radius: 3px;
          color: #6f7785;
          font-size: 10px;
          font-weight: 900;
          padding: 4px 6px;
        }

        .metric-tag-positive {
          background: #e7ffef;
          color: #19a85f;
        }

        .metric-tag-alert {
          background: #fff0f0;
          color: #ff4f5e;
        }

        .shoot-card {
          animation: studioRise 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: #ffffff;
          border: 1px solid rgba(221, 226, 234, 0.72);
          border-radius: 8px;
          box-shadow: 0 8px 18px rgba(24, 32, 51, 0.025);
          min-height: 68px;
        }

        .shoot-card:hover .shoot-icon {
          transform: rotate(-5deg) scale(1.06);
        }

        .shoot-icon {
          border-radius: 999px;
          display: grid;
          flex: 0 0 auto;
          height: 40px;
          place-items: center;
          transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
          width: 40px;
        }

        .tracking-row {
          animation: studioRise 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .tracking-bar {
          background: #e6e9ef;
          border-radius: 999px;
          height: 6px;
          overflow: hidden;
        }

        .tracking-fill {
          animation: studioFill 0.86s cubic-bezier(0.16, 1, 0.3, 1) both;
          border-radius: inherit;
          height: 100%;
          transform-origin: left center;
        }

        .manage-button {
          background: var(--studio-navy);
          border-radius: 5px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 950;
          height: 34px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .assistant-note {
          animation: studioRise 0.62s cubic-bezier(0.16, 1, 0.3, 1) 0.72s both;
          background: #fff7ea;
          border-left: 2px solid var(--studio-orange);
          border-radius: 8px 0 0 8px;
          color: #68707f;
          font-size: 11px;
          font-style: italic;
          line-height: 1.55;
          padding: 18px 16px;
        }

        .assistant-note strong {
          color: var(--studio-ink);
          display: block;
          font-style: normal;
          font-weight: 900;
          margin-top: 8px;
        }

        .assistant-note p::before,
        .assistant-note p::after {
          content: '"';
        }

        .booking-page {
          animation: studioRise 0.68s cubic-bezier(0.16, 1, 0.3, 1) both;
          font-family: var(--font-poppins), var(--font-outfit), sans-serif;
        }

        .booking-title {
          font-family: var(--font-outfit), var(--font-poppins), sans-serif;
        }

        .booking-action {
          align-items: center;
          border: 1px solid var(--studio-line);
          border-radius: 9px;
          display: inline-flex;
          font-size: 12px;
          font-weight: 900;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
        }

        .booking-action-light {
          background: rgba(255, 255, 255, 0.78);
          color: var(--studio-ink);
        }

        .booking-action-dark {
          background: var(--studio-navy);
          border-color: var(--studio-navy);
          box-shadow: 0 14px 26px rgba(15, 35, 66, 0.18);
          color: #ffffff;
        }

        .booking-action:hover {
          border-color: rgba(255, 152, 0, 0.42);
          box-shadow: 0 18px 34px rgba(24, 32, 51, 0.1);
          transform: translateY(-2px);
        }

        .booking-management-tabs {
          align-items: center;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(221, 226, 234, 0.72);
          border-radius: 16px;
          box-shadow: 0 14px 34px rgba(24, 32, 51, 0.045);
          display: inline-flex;
          gap: 7px;
          padding: 7px;
        }

        .booking-management-tab {
          border-radius: 11px;
          color: #677083;
          font-size: 12px;
          font-weight: 950;
          height: 38px;
          padding: 0 18px;
        }

        .booking-management-tab:hover {
          background: #f3f5f8;
          color: var(--studio-ink);
          transform: translateY(-2px);
        }

        .booking-management-tab-active {
          background: var(--studio-navy);
          box-shadow: 0 12px 24px rgba(15, 35, 66, 0.16);
          color: #ffffff;
        }

        .all-bookings-view {
          animation: studioRise 0.58s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .all-bookings-toolbar {
          align-items: center;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(221, 226, 234, 0.72);
          border-radius: 18px;
          box-shadow: 0 16px 42px rgba(24, 32, 51, 0.045);
          display: flex;
          gap: 16px;
          justify-content: space-between;
          padding: 14px 16px;
        }

        .booking-filter-pills,
        .booking-table-controls {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .booking-filter-chip,
        .booking-status-filter,
        .booking-date-range {
          align-items: center;
          background: #ffffff;
          border: 1px solid rgba(221, 226, 234, 0.75);
          border-radius: 11px;
          color: var(--studio-ink);
          display: inline-flex;
          font-size: 12px;
          font-weight: 850;
          gap: 8px;
          height: 38px;
          padding: 0 14px;
        }

        .booking-filter-chip:hover,
        .booking-status-filter:hover,
        .booking-date-range:hover {
          border-color: rgba(255, 152, 0, 0.38);
          box-shadow: 0 12px 24px rgba(24, 32, 51, 0.07);
          transform: translateY(-2px);
        }

        .booking-filter-chip-active {
          background: var(--studio-navy);
          border-color: var(--studio-navy);
          color: #ffffff;
        }

        .booking-status-filter select,
        .booking-date-range select {
          appearance: none;
          background: transparent;
          color: inherit;
          font: inherit;
          outline: none;
        }

        .all-bookings-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(221, 226, 234, 0.76);
          border-radius: 20px;
          box-shadow: 0 28px 70px rgba(24, 32, 51, 0.08);
          margin-top: 24px;
          overflow: hidden;
        }

        .booking-table-scroll {
          overflow-x: auto;
        }

        .booking-table {
          border-collapse: collapse;
          min-width: 880px;
          width: 100%;
        }

        .booking-table thead {
          background: linear-gradient(180deg, #eef1f5, #e8ebf0);
        }

        .booking-table th {
          color: var(--studio-ink);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          padding: 18px 18px;
          text-align: left;
          text-transform: uppercase;
        }

        .booking-table td {
          border-top: 1px solid rgba(221, 226, 234, 0.62);
          color: var(--studio-ink);
          font-size: 12px;
          padding: 18px;
          vertical-align: middle;
        }

        .booking-table tbody tr:hover {
          background: rgba(255, 248, 238, 0.62);
        }

        .booking-client-cell {
          align-items: center;
          display: flex;
          gap: 13px;
          min-width: 190px;
        }

        .booking-table-avatar {
          align-items: center;
          background: var(--studio-navy);
          border: 3px solid #ffffff;
          border-radius: 999px;
          box-shadow: 0 6px 16px rgba(15, 35, 66, 0.16);
          color: #ffffff;
          display: inline-flex;
          flex: 0 0 auto;
          font-size: 10px;
          font-weight: 950;
          height: 36px;
          justify-content: center;
          width: 36px;
        }

        .booking-client-cell strong {
          display: block;
          font-size: 13px;
          font-weight: 950;
          line-height: 1.2;
        }

        .booking-client-cell span:last-child {
          color: var(--studio-muted);
          display: block;
          font-size: 11px;
          font-weight: 650;
          line-height: 1.35;
          margin-top: 3px;
        }

        .booking-category-pill {
          border: 1px solid;
          border-radius: 999px;
          display: inline-flex;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.04em;
          padding: 5px 9px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .booking-date-cell {
          display: inline-block;
          font-size: 12px;
          font-weight: 850;
          line-height: 1.35;
          white-space: pre-line;
        }

        .booking-location-cell {
          align-items: center;
          color: #5f6878;
          display: inline-flex;
          font-size: 11px;
          font-weight: 700;
          gap: 6px;
          max-width: 180px;
        }

        .booking-amount-cell {
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
        }

        .booking-table-status {
          align-items: center;
          display: inline-flex;
          font-size: 11px;
          font-weight: 800;
          gap: 7px;
          white-space: nowrap;
        }

        .booking-table-status span {
          border-radius: 999px;
          height: 7px;
          width: 7px;
        }

        .booking-row-action {
          align-items: center;
          border-radius: 999px;
          color: var(--studio-muted);
          display: inline-flex;
          height: 32px;
          justify-content: center;
          width: 32px;
        }

        .booking-row-action:hover {
          background: #eef1f5;
          color: var(--studio-ink);
        }

        .booking-table-empty {
          color: var(--studio-muted) !important;
          font-weight: 800;
          text-align: center;
        }

        .booking-table-footer {
          align-items: center;
          border-top: 1px solid rgba(221, 226, 234, 0.72);
          display: flex;
          justify-content: space-between;
          padding: 14px 18px;
        }

        .booking-table-footer > span {
          color: var(--studio-ink);
          font-size: 11px;
          font-weight: 750;
        }

        .booking-pagination {
          align-items: center;
          display: flex;
          gap: 7px;
        }

        .booking-pagination button {
          background: #ffffff;
          border-radius: 9px;
          color: var(--studio-ink);
          font-size: 12px;
          font-weight: 850;
          height: 32px;
          width: 32px;
        }

        .booking-pagination button:hover,
        .booking-page-active {
          background: var(--studio-navy) !important;
          color: #ffffff !important;
        }

        .booking-pagination button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .booking-pagination button:disabled:hover {
          background: #ffffff !important;
          color: var(--studio-ink) !important;
          transform: none;
        }

        .booking-card {
          animation: studioRise 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(221, 226, 234, 0.82);
          border-radius: 15px;
          box-shadow: 0 16px 40px rgba(24, 32, 51, 0.045);
        }

        .booking-card:hover,
        .booking-detail:hover,
        .calendar-cell:hover {
          border-color: rgba(255, 152, 0, 0.34);
          box-shadow: 0 22px 46px rgba(24, 32, 51, 0.085);
          transform: translateY(-4px);
        }

        .booking-icon {
          border-radius: 12px;
          display: grid;
          height: 40px;
          place-items: center;
          width: 40px;
        }

        .booking-tag {
          border-radius: 999px;
          font-size: 11px;
          font-weight: 950;
          padding: 5px 8px;
        }

        .booking-panel {
          animation: studioRise 0.68s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(221, 226, 234, 0.72);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(24, 32, 51, 0.045);
        }

        .booking-tab {
          border-radius: 999px;
          color: #697184;
          font-size: 12px;
          font-weight: 850;
          height: 34px;
          padding: 0 15px;
        }

        .booking-tab-active {
          background: #ffffff;
          box-shadow: 0 8px 18px rgba(24, 32, 51, 0.07);
          color: var(--studio-ink);
        }

        .calendar-picker-shell {
          position: relative;
        }

        .calendar-title-button {
          align-items: center;
          border-radius: 12px;
          color: var(--studio-ink);
          display: inline-flex;
          font-size: 23px;
          font-weight: 950;
          letter-spacing: -0.025em;
          line-height: 1;
          padding: 8px 10px;
        }

        .calendar-title-button:hover,
        .calendar-title-button[aria-expanded="true"] {
          background: #f1f3f7;
          box-shadow: 0 10px 24px rgba(24, 32, 51, 0.07);
        }

        .month-picker-popover {
          animation: studioRise 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: #ffffff;
          border: 1px solid rgba(221, 226, 234, 0.92);
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(15, 35, 66, 0.18);
          left: 0;
          padding: 14px;
          position: absolute;
          top: calc(100% + 10px);
          width: 292px;
          z-index: 30;
        }

        .month-picker-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .month-picker-head strong {
          color: var(--studio-ink);
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .month-picker-nav {
          align-items: center;
          background: #f3f5f8;
          border-radius: 999px;
          color: var(--studio-ink);
          display: inline-flex;
          height: 34px;
          justify-content: center;
          width: 34px;
        }

        .month-picker-nav:hover {
          background: #e9edf3;
          transform: translateY(-2px);
        }

        .month-picker-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .month-picker-option {
          background: #f7f8fa;
          border: 1px solid transparent;
          border-radius: 10px;
          color: var(--studio-ink);
          font-size: 12px;
          font-weight: 900;
          height: 38px;
        }

        .month-picker-option:hover {
          border-color: rgba(255, 152, 0, 0.36);
          color: var(--studio-orange);
          transform: translateY(-2px);
        }

        .month-picker-option-active {
          background: #fff0d7;
          border-color: rgba(255, 152, 0, 0.45);
          color: var(--studio-orange);
        }

        .month-picker-footer {
          border-top: 1px solid var(--studio-line);
          margin-top: 12px;
          padding-top: 12px;
          text-align: right;
        }

        .month-picker-footer button {
          color: var(--studio-orange);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .calendar-grid {
          display: grid;
          gap: 5px;
          grid-template-columns: repeat(7, minmax(0, 1fr));
        }

        .calendar-grid-day {
          grid-template-columns: minmax(0, 1fr);
        }

        .calendar-grid-week .calendar-cell {
          min-height: 86px;
        }

        .calendar-grid-day .calendar-cell {
          min-height: 126px;
        }

        .calendar-cell {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          min-height: 45px;
          padding: 6px;
          width: 100%;
        }

        .calendar-cell:focus-visible {
          border-color: rgba(255, 152, 0, 0.58);
          box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.11);
          outline: none;
        }

        .calendar-event {
          align-items: center;
          border-radius: 7px;
          color: #ffffff;
          display: inline-flex;
          font-size: 10px;
          font-weight: 850;
          gap: 5px;
          margin-top: 4px;
          max-width: 100%;
          overflow: hidden;
          padding: 3px 5px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .calendar-event + .calendar-event {
          margin-top: 3px;
        }

        .booking-modal-backdrop {
          align-items: center;
          animation: studioFade 0.22s ease both;
          background: rgba(15, 23, 42, 0.32);
          display: flex;
          inset: 0;
          justify-content: center;
          padding: 24px;
          position: fixed;
          z-index: 50;
        }

        .booking-modal {
          animation: studioRise 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: #ffffff;
          border: 1px solid rgba(221, 226, 234, 0.82);
          border-radius: 18px;
          box-shadow: 0 30px 80px rgba(15, 35, 66, 0.26);
          max-height: min(860px, calc(100vh - 32px));
          max-width: 760px;
          overflow-y: auto;
          padding: 26px;
          width: min(760px, 100%);
        }

        .booking-detail-modal {
          max-width: 620px;
        }

        .booking-modal-close {
          align-items: center;
          background: #f3f5f8;
          border-radius: 999px;
          color: var(--studio-ink);
          display: inline-flex;
          height: 36px;
          justify-content: center;
          width: 36px;
        }

        .booking-modal-close:hover {
          background: #e9edf3;
          transform: translateY(-2px);
        }

        .booking-field {
          color: var(--studio-muted);
          display: grid;
          font-size: 11px;
          font-weight: 950;
          gap: 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .booking-field input,
        .booking-field select {
          background: #f7f8fa;
          border: 1px solid var(--studio-line);
          border-radius: 10px;
          color: var(--studio-ink);
          font-size: 13px;
          font-weight: 750;
          height: 44px;
          letter-spacing: 0;
          outline: none;
          padding: 0 13px;
          text-transform: none;
          width: 100%;
        }

        .booking-field input:focus,
        .booking-field select:focus {
          border-color: rgba(255, 152, 0, 0.58);
          box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.09);
        }

        .booking-form-section {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(247, 248, 250, 0.8));
          border: 1px solid rgba(221, 226, 234, 0.82);
          border-radius: 16px;
          display: grid;
          gap: 16px;
          padding: 18px;
        }

        .booking-section-copy {
          align-items: flex-start;
          color: var(--studio-orange);
          display: flex;
          gap: 10px;
        }

        .booking-section-copy h3 {
          color: var(--studio-ink);
          font-size: 13px;
          font-weight: 950;
          line-height: 1;
        }

        .booking-section-copy p {
          color: var(--studio-muted);
          font-size: 10px;
          font-weight: 650;
          line-height: 1.45;
          margin-top: 7px;
          max-width: 160px;
        }

        .booking-balance {
          align-items: center;
          background: #eef1f5;
          border: 1px solid rgba(221, 226, 234, 0.85);
          border-radius: 14px;
          display: flex;
          justify-content: space-between;
          min-height: 58px;
          padding: 12px 16px;
        }

        .booking-balance span {
          color: var(--studio-muted);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .booking-balance strong {
          color: var(--studio-ink);
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .booking-detail-hero {
          align-items: center;
          background: linear-gradient(135deg, #f7f8fa, #ffffff);
          border: 1px solid rgba(221, 226, 234, 0.82);
          border-radius: 16px;
          display: flex;
          gap: 14px;
          padding: 15px;
        }

        .booking-detail-hero p {
          color: var(--studio-muted);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.35;
        }

        .booking-detail-hero strong {
          color: var(--studio-ink);
          display: block;
          font-size: 13px;
          font-weight: 950;
          margin-top: 4px;
        }

        .booking-detail-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .booking-detail-item {
          background: #f7f8fa;
          border: 1px solid rgba(221, 226, 234, 0.75);
          border-radius: 14px;
          color: var(--studio-orange);
          display: grid;
          gap: 7px;
          padding: 13px;
        }

        .booking-detail-item span {
          color: var(--studio-muted);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .booking-detail-item strong {
          color: var(--studio-ink);
          font-size: 12px;
          font-weight: 850;
          line-height: 1.35;
          word-break: break-word;
        }

        @media (min-width: 768px) {
          .booking-form-section {
            grid-template-columns: 150px minmax(0, 1fr);
          }
        }

        .booking-modal-primary,
        .booking-modal-danger,
        .booking-modal-secondary {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 12px;
          font-weight: 950;
          gap: 8px;
          height: 40px;
          justify-content: center;
          padding: 0 18px;
        }

        .booking-modal-primary {
          background: var(--studio-orange);
          color: #1a2131;
        }

        .booking-modal-secondary {
          background: #f3f5f8;
          color: var(--studio-ink);
        }

        .booking-modal-danger {
          background: #fff0f0;
          color: #d83d4a;
        }

        .booking-sample-note {
          align-items: center;
          color: var(--studio-muted);
          display: inline-flex;
          font-size: 11px;
          font-weight: 850;
          min-height: 40px;
        }

        .booking-modal-primary:hover,
        .booking-modal-danger:hover,
        .booking-modal-secondary:hover {
          box-shadow: 0 14px 26px rgba(24, 32, 51, 0.1);
          transform: translateY(-2px);
        }

        .booking-detail {
          animation: studioRise 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(221, 226, 234, 0.72);
          border-radius: 13px;
          padding: 12px;
        }

        .booking-detail-badge {
          border-radius: 7px;
          color: #1f2635;
          font-size: 10px;
          font-weight: 950;
          padding: 4px 7px;
          text-transform: uppercase;
        }

        .booking-status-dot {
          border-radius: 999px;
          height: 7px;
          width: 7px;
        }

        .floating-camera {
          align-items: center;
          background: var(--studio-orange);
          border-radius: 999px;
          bottom: 86px;
          box-shadow: 0 14px 26px rgba(255, 152, 0, 0.28);
          color: #1a2131;
          display: flex;
          height: 46px;
          justify-content: center;
          position: fixed;
          right: 28px;
          width: 46px;
          z-index: 20;
        }

        .dashboard-rise {
          animation: studioRise 0.68s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes studioRise {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes studioPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.26);
          }
        }

        @keyframes studioSheen {
          0%, 52% {
            left: -35%;
          }
          100% {
            left: 130%;
          }
        }

        @keyframes studioFill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes studioFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 1023px) {
          .floating-camera {
            bottom: 24px;
            height: 66px;
            right: 24px;
            width: 66px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .studio-dashboard *,
          .hero-card::after,
          .notification-dot {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>
    </div>
  );
}

function BookingRegistrationForm({
  form,
  isEditing,
  onClose,
  onFieldChange,
  onSubmit,
}: {
  form: BookingFormState;
  isEditing: boolean;
  onClose: () => void;
  onFieldChange: (field: keyof BookingFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const outstandingBalance = formatCurrency(getOutstandingBalance(form.packagePrice, form.advancePaid));

  return (
    <div className="booking-modal-backdrop" role="presentation">
      <form aria-label="Booking registration form" className="booking-modal" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#fff0d7] text-[var(--studio-orange)]">
              <Camera size={20} strokeWidth={2.5} />
            </div>
            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--studio-orange)]">
              {isEditing ? "Booking Update" : "Booking Registration"}
            </p>
            <h2 className="booking-title mt-1 text-[24px] font-black tracking-[-0.03em] text-[var(--studio-ink)]">
              {isEditing ? "Edit Studio Booking" : "Create Studio Booking"}
            </h2>
          </div>
          <button aria-label="Close booking registration" className="booking-modal-close" onClick={onClose} type="button">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="booking-form-sections mt-6 grid gap-5">
          <section className="booking-form-section">
            <div className="booking-section-copy">
              <UserRound size={16} strokeWidth={2.4} />
              <div>
                <h3>Client Info</h3>
                <p>Contact details for communication and contract signing.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="booking-field md:col-span-2">
                <span>Client Full Name</span>
                <input
                  autoFocus
                  onChange={(event) => onFieldChange("client", event.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={form.client}
                />
              </label>
              <label className="booking-field">
                <span>Phone Number</span>
                <input
                  onChange={(event) => onFieldChange("phone", event.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  type="tel"
                  value={form.phone}
                />
              </label>
              <label className="booking-field">
                <span>Email Address</span>
                <input
                  onChange={(event) => onFieldChange("email", event.target.value)}
                  placeholder="rahul@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </label>
            </div>
          </section>

          <section className="booking-form-section">
            <div className="booking-section-copy">
              <CalendarCheck size={16} strokeWidth={2.4} />
              <div>
                <h3>Event Details</h3>
                <p>Logistics for the shoot session and categorization.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="booking-field">
                <span>Shoot Date</span>
                <input
                  onChange={(event) => onFieldChange("date", event.target.value)}
                  required
                  type="date"
                  value={form.date}
                />
              </label>
              <label className="booking-field">
                <span>Start Time</span>
                <input
                  onChange={(event) => onFieldChange("time", event.target.value)}
                  required
                  type="time"
                  value={form.time}
                />
              </label>
              <label className="booking-field">
                <span>Shoot Category</span>
                <select onChange={(event) => onFieldChange("category", event.target.value)} value={form.category}>
                  {bookingCategoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="booking-field">
                <span>Status</span>
                <select onChange={(event) => onFieldChange("status", event.target.value)} value={form.status}>
                  {bookingStatusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="booking-field md:col-span-2">
                <span>Venue Location</span>
                <input
                  onChange={(event) => onFieldChange("location", event.target.value)}
                  placeholder="Enter venue name or address"
                  required
                  value={form.location}
                />
              </label>
            </div>
          </section>

          <section className="booking-form-section">
            <div className="booking-section-copy">
              <CircleDollarSign size={16} strokeWidth={2.4} />
              <div>
                <h3>Financials</h3>
                <p>Package value, advance paid, and calculated remainder.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="booking-field">
                <span>Total Package Price (₹)</span>
                <input
                  min="0"
                  onChange={(event) => onFieldChange("packagePrice", event.target.value)}
                  required
                  step="0.01"
                  type="number"
                  value={form.packagePrice}
                />
              </label>
              <label className="booking-field">
                <span>Advance Paid (₹)</span>
                <input
                  min="0"
                  onChange={(event) => onFieldChange("advancePaid", event.target.value)}
                  required
                  step="0.01"
                  type="number"
                  value={form.advancePaid}
                />
              </label>
              <div className="booking-balance md:col-span-2">
                <span>Outstanding Balance</span>
                <strong>{outstandingBalance}</strong>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="booking-modal-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="booking-modal-primary" type="submit">
            <CalendarCheck size={16} strokeWidth={2.5} />
            {isEditing ? "Save Changes" : "Register Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}

function BookingsView({
  onDateSelect,
  onDeleteBooking,
  onEditBooking,
  registeredBookings,
  searchQuery,
}: {
  onDateSelect: (date: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onEditBooking: (bookingId: string) => void;
  registeredBookings: RegisteredBooking[];
  searchQuery: string;
}) {
  const [calendarCursor, setCalendarCursor] = useState(() => new Date());
  const [calendarMode, setCalendarMode] = useState<CalendarViewMode>("Month");
  const [categoryFilter, setCategoryFilter] = useState("All Bookings");
  const [bookingManagementTab, setBookingManagementTab] = useState<BookingManagementTab>("Overview");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [monthPickerYear, setMonthPickerYear] = useState(() => new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState("All Status");
  const allBookingRows = getAllBookingRows(registeredBookings);
  const searchableBookingRows = allBookingRows.filter((row) => isBookingRowMatchingSearch(row, searchQuery));
  const filteredAllBookingRows = allBookingRows.filter((row) => {
    const categoryMatches = categoryFilter === "All Bookings" || row.category === categoryFilter;
    const dateMatches = isBookingInDateFilter(row.date, dateFilter);
    const searchMatches = isBookingRowMatchingSearch(row, searchQuery);
    const statusMatches = statusFilter === "All Status" || row.status === statusFilter;

    return categoryMatches && dateMatches && searchMatches && statusMatches;
  });
  const exportRows = bookingManagementTab === "All bookings" ? filteredAllBookingRows : searchableBookingRows;
  const currentCalendar = getCalendarView(calendarCursor, calendarMode);
  const visibleBookingDetails = [...registeredBookings, ...bookingDetails];
  const openMonthPicker = () => {
    setMonthPickerYear(calendarCursor.getFullYear());
    setIsMonthPickerOpen((isOpen) => !isOpen);
  };
  const selectCalendarMonth = (monthIndex: number) => {
    setCalendarCursor(new Date(monthPickerYear, monthIndex, 1));
    setCalendarMode("Month");
    setIsMonthPickerOpen(false);
  };
  const moveCalendar = (direction: number) => {
    setCalendarCursor((currentCursor) => getShiftedCalendarCursor(currentCursor, calendarMode, direction));
    setIsMonthPickerOpen(false);
  };

  return (
    <div className="booking-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--studio-muted)]">
            <span>Management</span>
            <span className="h-1 w-1 rounded-full bg-[var(--studio-line)]" />
            <span className="text-[var(--studio-orange)]">Bookings</span>
          </div>
          <h2 className="booking-title mt-2 text-[32px] font-black leading-none tracking-[-0.035em] text-[var(--studio-ink)]">
            Booking Management
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="booking-action booking-action-light" type="button">
            <Filter size={15} strokeWidth={2.4} />
            <span>Filters</span>
          </button>
          <button className="booking-action booking-action-dark" onClick={() => exportBookingRows(exportRows)} type="button">
            <Download size={15} strokeWidth={2.5} />
            <span>Export Schedule</span>
          </button>
        </div>
      </div>

      <div aria-label="Booking management sections" className="booking-management-tabs mt-6" role="tablist">
        {bookingManagementTabs.map((tab) => (
          <button
            aria-selected={bookingManagementTab === tab}
            className={`booking-management-tab ${bookingManagementTab === tab ? "booking-management-tab-active" : ""}`}
            key={tab}
            onClick={() => setBookingManagementTab(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {bookingManagementTab === "Overview" ? (
        <>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {bookingStats.map((stat, index) => (
              <BookingStatCard key={stat.label} {...stat} delay={0.08 + index * 0.07} />
            ))}
          </div>

          <div className="mt-7 grid items-start gap-6 xl:grid-cols-[2fr_0.96fr]">
            <section className="booking-panel p-6" style={{ animationDelay: "0.22s" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="calendar-picker-shell">
                <button
                  aria-expanded={isMonthPickerOpen}
                  aria-haspopup="dialog"
                  className="calendar-title-button booking-title"
                  onClick={openMonthPicker}
                  type="button"
                >
                  {currentCalendar.label}
                </button>

                {isMonthPickerOpen ? (
                  <div aria-label="Select calendar month and year" className="month-picker-popover" role="dialog">
                    <div className="month-picker-head">
                      <button aria-label="Previous year" className="month-picker-nav" onClick={() => setMonthPickerYear((year) => year - 1)} type="button">
                        <ChevronLeft size={15} strokeWidth={2.5} />
                      </button>
                      <strong>{monthPickerYear}</strong>
                      <button aria-label="Next year" className="month-picker-nav" onClick={() => setMonthPickerYear((year) => year + 1)} type="button">
                        <ChevronRight size={15} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="month-picker-grid">
                      {monthPickerMonths.map((month, monthIndex) => (
                        <button
                          className={`month-picker-option ${calendarCursor.getFullYear() === monthPickerYear && calendarCursor.getMonth() === monthIndex ? "month-picker-option-active" : ""}`}
                          key={month}
                          onClick={() => selectCalendarMonth(monthIndex)}
                          type="button"
                        >
                          {month}
                        </button>
                      ))}
                    </div>

                    <div className="month-picker-footer">
                      <button
                        onClick={() => {
                          setCalendarCursor(new Date());
                          setCalendarMode("Month");
                          setIsMonthPickerOpen(false);
                        }}
                        type="button"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <button aria-label={`Previous ${calendarMode.toLowerCase()}`} className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-[#eef1f5]" onClick={() => moveCalendar(-1)} type="button">
                <ChevronLeft size={15} strokeWidth={2.5} />
              </button>
              <button aria-label={`Next ${calendarMode.toLowerCase()}`} className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-[#eef1f5]" onClick={() => moveCalendar(1)} type="button">
                <ChevronRight size={15} strokeWidth={2.5} />
              </button>
            </div>

            <div className="inline-flex w-fit rounded-full bg-[#f1f3f7] p-1">
              {calendarViewModes.map((mode) => (
                <button
                  className={`booking-tab ${calendarMode === mode ? "booking-tab-active" : ""}`}
                  key={mode}
                  onClick={() => setCalendarMode(mode)}
                  type="button"
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className={`calendar-grid ${currentCalendar.modeClass} mt-7 text-center text-[11px] font-black uppercase tracking-[0.12em] text-[var(--studio-muted)]`}>
            {currentCalendar.weekdayLabels.map((weekday, index) => (
              <div key={`${weekday}-${index}`}>{weekday}</div>
            ))}
          </div>

          <div className={`calendar-grid ${currentCalendar.modeClass} mt-4`}>
            {currentCalendar.days.map((day, index) => {
              const registeredEvents = registeredBookings
                .filter((booking) => booking.date === day.date)
                .map((booking) => ({ label: booking.eventLabel, tone: booking.tone }));
              const events = [
                ...(day.event ? [{ label: day.event, tone: day.tone ?? "navy" }] : []),
                ...registeredEvents,
              ];

              return (
                <CalendarCell
                  key={day.date}
                  date={day.date}
                  day={day.day}
                  delay={0.28 + index * 0.025}
                  events={events}
                  muted={day.muted}
                  onSelect={onDateSelect}
                  today={day.today}
                />
              );
            })}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="booking-panel p-5" style={{ animationDelay: "0.3s" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="booking-title text-[18px] font-black tracking-[-0.02em] text-[var(--studio-ink)]">
                Upcoming Details
              </h3>
              <button className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--studio-orange)] transition hover:text-[var(--studio-ink)]" type="button">
                View All
              </button>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-1">
              {visibleBookingDetails.map((booking, index) => (
                <BookingDetailCard key={booking.id} {...booking} delay={0.38 + index * 0.07} />
              ))}
            </div>
          </section>
            </aside>
          </div>
        </>
      ) : (
        <AllBookingsView
          categoryFilter={categoryFilter}
          dateFilter={dateFilter}
          filteredRows={filteredAllBookingRows}
          registeredBookings={registeredBookings}
          statusFilter={statusFilter}
          onCategoryFilterChange={setCategoryFilter}
          onDateFilterChange={setDateFilter}
          onDeleteBooking={onDeleteBooking}
          onEditBooking={onEditBooking}
          onStatusFilterChange={setStatusFilter}
        />
      )}
    </div>
  );
}

function BookingStatCard({
  delay,
  icon: Icon,
  label,
  tag,
  tone,
  value,
}: {
  delay: number;
  icon: TablerIcon;
  label: string;
  tag: string;
  tone: string;
  value: string;
}) {
  const styles = getBookingTone(tone);

  return (
    <article className="booking-card p-5" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-start justify-between gap-4">
        <span className="booking-icon" style={{ backgroundColor: styles.bg, color: styles.fg }}>
          <Icon size={19} strokeWidth={2.35} />
        </span>
        <span className="booking-tag" style={{ backgroundColor: styles.tagBg, color: styles.fg }}>
          {tag}
        </span>
      </div>
      <p className="mt-5 text-[12px] font-semibold text-[var(--studio-muted)]">{label}</p>
      <p className="mt-1.5 text-[27px] font-black leading-none tracking-[-0.03em] text-[var(--studio-ink)]">{value}</p>
    </article>
  );
}

function AllBookingsView({
  categoryFilter,
  dateFilter,
  filteredRows,
  onCategoryFilterChange,
  onDateFilterChange,
  onDeleteBooking,
  onEditBooking,
  onStatusFilterChange,
  registeredBookings,
  statusFilter,
}: {
  categoryFilter: string;
  dateFilter: string;
  filteredRows: AllBookingRow[];
  onCategoryFilterChange: (filter: string) => void;
  onDateFilterChange: (filter: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onEditBooking: (bookingId: string) => void;
  onStatusFilterChange: (filter: string) => void;
  registeredBookings: RegisteredBooking[];
  statusFilter: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<AllBookingRow | null>(null);
  const registeredBookingCount = registeredBookings.length;
  const rowsPerPage = 10;
  const pageCount = Math.max(Math.ceil(filteredRows.length / rowsPerPage), 1);
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const firstVisibleRow = filteredRows.length === 0 ? 0 : (safeCurrentPage - 1) * rowsPerPage + 1;
  const lastVisibleRow = Math.min(safeCurrentPage * rowsPerPage, filteredRows.length);
  const visibleRows = filteredRows.slice(firstVisibleRow === 0 ? 0 : firstVisibleRow - 1, lastVisibleRow);
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <section className="all-bookings-view mt-7">
      <div className="all-bookings-toolbar">
        <div className="booking-filter-pills" aria-label="Filter bookings by category">
          {allBookingCategoryFilters.map((filter) => (
            <button
              className={`booking-filter-chip ${categoryFilter === filter ? "booking-filter-chip-active" : ""}`}
              key={filter}
              onClick={() => {
                onCategoryFilterChange(filter);
                setCurrentPage(1);
              }}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="booking-table-controls">
          <label className="booking-status-filter">
            <Filter size={13} strokeWidth={2.4} />
            <span className="sr-only">Filter by status</span>
            <select
              onChange={(event) => {
                onStatusFilterChange(event.target.value);
                setCurrentPage(1);
              }}
              value={statusFilter}
            >
              {allBookingStatusFilters.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="booking-date-range">
            <Calendar size={13} strokeWidth={2.4} />
            <span className="sr-only">Filter by date range</span>
            <select
              onChange={(event) => {
                onDateFilterChange(event.target.value);
                setCurrentPage(1);
              }}
              value={dateFilter}
            >
              {allBookingDateFilters.map((filter) => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="all-bookings-card">
        <div className="booking-table-scroll">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Client &amp; Service</th>
                <th>Category</th>
                <th>Date &amp; Time</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const statusStyles = getBookingTone(row.statusTone);
                const categoryStyle = getTableCategoryStyle(row.category);

                return (
                  <tr key={row.id}>
                    <td>
                      <div className="booking-client-cell">
                        <span className="booking-table-avatar">{row.initials}</span>
                        <div>
                          <strong>{row.client}</strong>
                          <span>{row.service}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="booking-category-pill" style={categoryStyle}>{row.category}</span>
                    </td>
                    <td>
                      <span className="booking-date-cell">{row.dateTime}</span>
                    </td>
                    <td>
                      <span className="booking-location-cell">
                        <MapPin size={12} strokeWidth={2.35} />
                        {row.location}
                      </span>
                    </td>
                    <td>
                      <strong className="booking-amount-cell">{row.amount}</strong>
                    </td>
                    <td>
                      <span className="booking-table-status">
                        <span style={{ backgroundColor: statusStyles.fg }} />
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button aria-label={`View details for ${row.client}`} className="booking-row-action" onClick={() => setSelectedRow(row)} type="button">
                        <DotsVertical size={16} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {visibleRows.length === 0 ? (
                <tr>
                  <td className="booking-table-empty" colSpan={7}>No bookings match the selected filters.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="booking-table-footer">
          <span>
            {filteredRows.length === 0
              ? "Showing 0 of 0 bookings"
              : `Showing ${firstVisibleRow}-${lastVisibleRow} of ${filteredRows.length} bookings`}
          </span>
          <div className="booking-pagination" aria-label="Booking table pagination">
            <button aria-label="Previous page" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))} type="button">‹</button>
            {pageNumbers.map((page) => (
              <button
                className={safeCurrentPage === page ? "booking-page-active" : ""}
                key={page}
                onClick={() => setCurrentPage(page)}
                type="button"
              >
                {page}
              </button>
            ))}
            <button aria-label="Next page" disabled={safeCurrentPage === pageCount} onClick={() => setCurrentPage((page) => Math.min(page + 1, pageCount))} type="button">›</button>
          </div>
        </div>
      </div>

      {selectedRow ? (
        <BookingRowDetailModal
          key={`${selectedRow.id}-${registeredBookingCount}`}
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onDelete={() => {
            onDeleteBooking(selectedRow.id);
            setSelectedRow(null);
          }}
          onEdit={() => {
            onEditBooking(selectedRow.id);
            setSelectedRow(null);
          }}
        />
      ) : null}
    </section>
  );
}

function BookingRowDetailModal({
  onClose,
  onDelete,
  onEdit,
  row,
}: {
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  row: AllBookingRow;
}) {
  const statusStyles = getBookingTone(row.statusTone);
  const canManageRow = row.source === "registered";
  const detailItems = [
    { icon: Calendar, label: "Schedule", value: row.dateTime.replace("\n", " - ") },
    { icon: MapPin, label: "Location", value: row.location },
    { icon: CircleDollarSign, label: "Package", value: row.packagePrice ?? row.amount },
    { icon: CircleDollarSign, label: "Outstanding", value: row.outstandingBalance ?? "Not recorded" },
    { icon: Phone, label: "Phone", value: row.phone ?? "Not recorded" },
    { icon: Mail, label: "Email", value: row.email ?? "Not recorded" },
  ];

  return (
    <div className="booking-modal-backdrop" role="presentation">
      <article aria-label={`Booking details for ${row.client}`} className="booking-modal booking-detail-modal">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#fff0d7] text-[var(--studio-orange)]">
              <Eye size={20} strokeWidth={2.5} />
            </div>
            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--studio-orange)]">Booking Details</p>
            <h2 className="booking-title mt-1 truncate text-[24px] font-black tracking-[-0.03em] text-[var(--studio-ink)]">{row.client}</h2>
          </div>
          <button aria-label="Close booking details" className="booking-modal-close" onClick={onClose} type="button">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="booking-detail-hero mt-6">
          <span className="booking-table-avatar">{row.initials}</span>
          <div className="min-w-0 flex-1">
            <p>{row.service}</p>
            <strong>{row.id}</strong>
          </div>
          <span className="booking-table-status" style={{ color: statusStyles.fg }}>
            <span style={{ backgroundColor: statusStyles.fg }} />
            {row.status}
          </span>
        </div>

        <div className="booking-detail-grid mt-5">
          {detailItems.map(({ icon: Icon, label, value }) => (
            <div className="booking-detail-item" key={label}>
              <Icon size={15} strokeWidth={2.4} />
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {canManageRow ? (
            <button className="booking-modal-danger" onClick={onDelete} type="button">
              <Trash size={16} strokeWidth={2.5} />
              Delete Booking
            </button>
          ) : (
            <span className="booking-sample-note">Sample bookings are view-only.</span>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="booking-modal-secondary" onClick={onClose} type="button">Close</button>
            {canManageRow ? (
              <button className="booking-modal-primary" onClick={onEdit} type="button">
                <Pencil size={16} strokeWidth={2.5} />
                Edit Booking
              </button>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}

function CalendarCell({
  date,
  day,
  delay,
  events,
  muted,
  onSelect,
  today,
}: {
  date: string;
  day: string;
  delay: number;
  events: { label: string; tone: string }[];
  muted?: boolean;
  onSelect: (date: string) => void;
  today?: boolean;
}) {
  return (
    <button
      aria-label={`Create booking for ${date}`}
      className="calendar-cell text-left"
      onClick={() => onSelect(date)}
      style={{ animationDelay: `${delay}s` }}
      type="button"
    >
      <div className="flex items-center gap-1.5">
        <span className={`text-[12px] font-black ${muted ? "text-[#b8bec9]" : "text-[var(--studio-ink)]"}`}>{day}</span>
        {today ? <span className="text-[10px] font-black text-[var(--studio-orange)]">Today</span> : null}
      </div>
      {events.slice(0, 2).map((event, index) => {
        const styles = getBookingTone(event.tone);

        return (
          <span className="calendar-event" key={`${event.label}-${index}`} style={{ backgroundColor: styles.fg }}>
            <CalendarCheck size={11} strokeWidth={2.5} />
            {event.label}
          </span>
        );
      })}
    </button>
  );
}

function BookingDetailCard({
  advancePaid,
  category,
  client,
  delay,
  email,
  id,
  initials,
  location,
  outstandingBalance,
  packagePrice,
  phone,
  status,
  time,
  tone,
}: {
  advancePaid?: string;
  category: string;
  client: string;
  delay: number;
  email?: string;
  id: string;
  initials: string;
  location: string;
  outstandingBalance?: string;
  packagePrice?: string;
  phone?: string;
  status: string;
  time: string;
  tone: string;
}) {
  const styles = getBookingTone(tone);

  return (
    <article className="booking-detail" style={{ animationDelay: `${delay}s` }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="booking-detail-badge" style={{ backgroundColor: styles.tagBg }}>{category}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.08em] text-[var(--studio-muted)]">ID: {id}</span>
      </div>

      <h4 className="truncate text-[14px] font-black tracking-[-0.01em] text-[var(--studio-ink)]">{client}</h4>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-semibold text-[var(--studio-muted)]">
        <p className="flex min-w-0 items-center gap-2">
          <Clock size={12} strokeWidth={2.4} />
          <span className="truncate">{time}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <MapPin size={12} strokeWidth={2.4} />
          <span className="truncate">{location}</span>
        </p>
      </div>

      {phone || email ? (
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-semibold text-[var(--studio-muted)]">
          {phone ? (
            <p className="flex min-w-0 items-center gap-2">
              <Phone size={12} strokeWidth={2.4} />
              <span className="truncate">{phone}</span>
            </p>
          ) : null}
          {email ? (
            <p className="flex min-w-0 items-center gap-2">
              <Mail size={12} strokeWidth={2.4} />
              <span className="truncate">{email}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      {packagePrice || outstandingBalance ? (
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-[10px] bg-[#f6f7fa] p-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[var(--studio-muted)]">Package</p>
            <p className="mt-1 text-[10px] font-black text-[var(--studio-ink)]">{packagePrice}</p>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[var(--studio-muted)]">Advance</p>
            <p className="mt-1 text-[10px] font-black text-[var(--studio-ink)]">{advancePaid}</p>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[var(--studio-muted)]">Due</p>
            <p className="mt-1 text-[10px] font-black text-[var(--studio-ink)]">{outstandingBalance}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--studio-navy)] text-[10px] font-black text-white">
            {initials}
          </span>
          <UserRound size={14} strokeWidth={2.4} className="text-[var(--studio-muted)]" />
        </div>
        <span className="flex items-center gap-2 text-[11px] font-black" style={{ color: styles.fg }}>
          <span className="booking-status-dot" style={{ backgroundColor: styles.fg }} />
          {status}
        </span>
      </div>
    </article>
  );
}

function getBookingTone(tone: string) {
  const tones: Record<string, { bg: string; fg: string; tagBg: string }> = {
    green: { bg: "#dcffe9", fg: colors.green, tagBg: "#e7ffef" },
    muted: { bg: "#eef1f5", fg: "#7a8190", tagBg: "#eef1f5" },
    navy: { bg: "#e9eef6", fg: colors.navy, tagBg: "#eef1f5" },
    orange: { bg: "#fff0d7", fg: colors.orange, tagBg: "#fff2de" },
    red: { bg: "#fff0f0", fg: "#e44352", tagBg: "#fff0f0" },
  };

  return tones[tone] ?? tones.navy;
}

function NavButton({
  active,
  delay,
  icon: Icon,
  label,
  onSelect,
}: {
  active?: boolean;
  delay: number;
  icon: TablerIcon;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      className={`nav-item w-full dashboard-rise ${active ? "nav-item-active" : ""}`}
      onClick={onSelect}
      style={{ animationDelay: `${delay}s` }}
      type="button"
    >
      <Icon size={17} strokeWidth={2.25} />
      <span>{label}</span>
    </button>
  );
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="hero-pill">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/58">{label}</p>
      <p className="mt-1 text-[22px] font-black leading-none text-white">{value}</p>
    </div>
  );
}

function MetricCard({
  delay,
  icon: Icon,
  label,
  tag,
  value,
}: {
  delay: number;
  icon: TablerIcon;
  label: string;
  tag: string;
  value: string;
}) {
  const tagClass = tag === "+12%" ? "metric-tag-positive" : tag === "Priority" ? "metric-tag-alert" : "";

  return (
    <article className="metric-card" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-start justify-between">
        <span className="metric-icon">
          <Icon size={18} strokeWidth={2.35} />
        </span>
        <span className={`metric-tag ${tagClass}`}>{tag}</span>
      </div>
      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--studio-muted)]">
        {label}
      </p>
      <p className="mt-2 text-[22px] font-black leading-none tracking-[-0.02em] text-[var(--studio-ink)]">
        {value}
      </p>
    </article>
  );
}

function ShootRow({
  amount,
  delay,
  detail,
  icon: Icon,
  status,
  title,
  tone,
}: {
  amount: string;
  delay: number;
  detail: string;
  icon: TablerIcon;
  status: string;
  title: string;
  tone: string;
}) {
  const style = toneStyles[tone];

  return (
    <article className="shoot-card flex items-center justify-between gap-4 px-4 py-3.5" style={{ animationDelay: `${delay}s` }}>
      <div className="flex min-w-0 items-center gap-4">
        <span className="shoot-icon" style={{ backgroundColor: style.bg, color: style.icon }}>
          <Icon size={18} strokeWidth={2.3} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-extrabold tracking-[-0.01em] text-[var(--studio-ink)]">
            {title}
          </h3>
          <p className="mt-1 truncate text-[10px] font-semibold text-[var(--studio-muted)]">{detail}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[13px] font-black leading-none tracking-[-0.01em]" style={{ color: style.amount }}>
          {amount}
        </p>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.05em]" style={{ color: style.amount }}>
          {status}
        </p>
      </div>
    </article>
  );
}

function TrackingRow({
  color,
  count,
  delay,
  detail,
  name,
  progress,
}: {
  color: string;
  count: string;
  delay: number;
  detail: string;
  name: string;
  progress: number;
}) {
  return (
    <div className="tracking-row" style={{ animationDelay: `${delay}s` }}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <p className="text-[11px] font-extrabold leading-tight text-[var(--studio-ink)]">{name}</p>
        <p className="shrink-0 text-[10px] font-black text-[var(--studio-ink)]">{count}</p>
      </div>
      <div className="tracking-bar">
        <div className="tracking-fill" style={{ backgroundColor: color, width: `${progress}%` }} />
      </div>
      <p
        className="mt-2 text-[10px] font-black uppercase tracking-[0.05em] text-[var(--studio-muted)]"
        style={{ color: progress === 100 ? colors.green : undefined }}
      >
        {detail}
      </p>
    </div>
  );
}

function FooterStat({
  accent,
  icon: Icon,
  label,
  value,
}: {
  accent?: boolean;
  icon: TablerIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={accent ? "text-[var(--studio-green)]" : "text-[var(--studio-muted)]"} size={13} strokeWidth={2.3} />
      <div>
        <p className="font-black">{label}</p>
        <p
          className={`mt-1 text-[11px] font-black normal-case tracking-normal ${
            accent ? "text-[#19b66a]" : "text-[var(--studio-ink)]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}