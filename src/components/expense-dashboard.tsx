"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock,
  DollarSign,
  Download,
  Filter,
  Gift,
  Heart,
  Home,
  MapPin,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";

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
  category: string;
  client: string;
  date: string;
  location: string;
  status: string;
  time: string;
};

type RegisteredBooking = {
  category: string;
  client: string;
  date: string;
  eventLabel: string;
  id: string;
  initials: string;
  location: string;
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

const bookingCategoryOptions = ["Wedding", "Fashion", "Kids", "Corporate", "Portrait"];
const bookingStatusOptions = ["Confirmed", "In Progress", "Pending"];

const baseBookingForm: Omit<BookingFormState, "date"> = {
  category: "Wedding",
  client: "",
  location: "Kanakkupulla Studio",
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

function getCurrentCalendarMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstOfMonth.getDay());
  const todayValue = formatDateInputValue(today);

  const days: CalendarDay[] = Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + index);
    const date = formatDateInputValue(cellDate);
    const isCurrentMonth = cellDate.getMonth() === month;
    const scheduledEvent = isCurrentMonth ? calendarEventSchedule[cellDate.getDate()] : undefined;

    return {
      date,
      day: String(cellDate.getDate()),
      event: scheduledEvent?.event,
      muted: !isCurrentMonth,
      today: date === todayValue,
      tone: scheduledEvent?.tone,
    };
  });

  return {
    days,
    label: firstOfMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
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
    setBookingForm(getEmptyBookingForm(date));
    setIsBookingFormOpen(true);
  };
  const handleBookingFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextBooking: RegisteredBooking = {
      category: bookingForm.category,
      client: bookingForm.client.trim(),
      date: bookingForm.date,
      eventLabel: bookingForm.category,
      id: `ABK-${String(1203 + registeredBookings.length).padStart(4, "0")}`,
      initials: getInitials(bookingForm.client),
      location: bookingForm.location.trim(),
      status: bookingForm.status,
      time: formatBookingDateTime(bookingForm.date, bookingForm.time),
      tone: getStatusTone(bookingForm.status),
    };

    setRegisteredBookings((currentBookings) => [nextBooking, ...currentBookings]);
    setIsBookingFormOpen(false);
  };

  return (
    <div className="studio-dashboard min-h-screen bg-[var(--studio-page)] text-[var(--studio-ink)] md:flex" data-source={dataSignature}>
      <aside className="hidden w-[184px] shrink-0 border-r border-[var(--studio-line)] bg-white md:flex md:flex-col">
        <div className="flex h-24 items-center justify-center px-4">
          <Image
            alt="Kanakkupulla logo"
            className="object-contain"
            height={88}
            priority
            src="/Kanakkupulla.png"
            width={132}
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
          <button className="nav-item mb-3 w-full" type="button">
            <Settings size={17} strokeWidth={2.2} />
            <span>Settings</span>
          </button>
          <button className="new-booking w-full" onClick={() => openBookingForm()} type="button">
            <Plus size={17} strokeWidth={2.4} />
            <span>New Booking</span>
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
                placeholder={activeView === "Bookings" ? "Search bookings, clients, or dates..." : "Search bookings, clients..."}
                type="search"
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
            <BookingsView registeredBookings={registeredBookings} onDateSelect={openBookingForm} />
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
          form={bookingForm}
          onClose={() => setIsBookingFormOpen(false)}
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

        .new-booking {
          align-items: center;
          background: var(--studio-orange);
          border-radius: 6px;
          box-shadow: 0 10px 18px rgba(255, 152, 0, 0.18);
          color: #1e2432;
          display: flex;
          font-size: 12px;
          font-weight: 900;
          gap: 7px;
          height: 38px;
          justify-content: center;
        }

        .new-booking:hover,
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

        .calendar-grid {
          display: grid;
          gap: 5px;
          grid-template-columns: repeat(7, minmax(0, 1fr));
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
          max-width: 640px;
          padding: 26px;
          width: min(640px, 100%);
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

        .booking-modal-primary,
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

        .booking-modal-primary:hover,
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
  onClose,
  onFieldChange,
  onSubmit,
}: {
  form: BookingFormState;
  onClose: () => void;
  onFieldChange: (field: keyof BookingFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="booking-modal-backdrop" role="presentation">
      <form aria-label="Booking registration form" className="booking-modal" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#fff0d7] text-[var(--studio-orange)]">
              <Camera size={20} strokeWidth={2.5} />
            </div>
            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--studio-orange)]">
              Booking Registration
            </p>
            <h2 className="booking-title mt-1 text-[24px] font-black tracking-[-0.03em] text-[var(--studio-ink)]">
              Create Studio Booking
            </h2>
          </div>
          <button aria-label="Close booking registration" className="booking-modal-close" onClick={onClose} type="button">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="booking-field md:col-span-2">
            <span>Client / Project Name</span>
            <input
              autoFocus
              onChange={(event) => onFieldChange("client", event.target.value)}
              placeholder="Enter client or shoot name"
              required
              value={form.client}
            />
          </label>

          <label className="booking-field">
            <span>Category</span>
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

          <label className="booking-field md:col-span-2">
            <span>Location</span>
            <input
              onChange={(event) => onFieldChange("location", event.target.value)}
              placeholder="Studio, venue, or outdoor location"
              required
              value={form.location}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="booking-modal-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="booking-modal-primary" type="submit">
            <CalendarCheck size={16} strokeWidth={2.5} />
            Register Booking
          </button>
        </div>
      </form>
    </div>
  );
}

function BookingsView({
  onDateSelect,
  registeredBookings,
}: {
  onDateSelect: (date: string) => void;
  registeredBookings: RegisteredBooking[];
}) {
  const currentCalendar = getCurrentCalendarMonth();
  const visibleBookingDetails = [...registeredBookings, ...bookingDetails];

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
          <button className="booking-action booking-action-dark" type="button">
            <Download size={15} strokeWidth={2.5} />
            <span>Export Schedule</span>
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        {bookingStats.map((stat, index) => (
          <BookingStatCard key={stat.label} {...stat} delay={0.08 + index * 0.07} />
        ))}
      </div>

      <div className="mt-7 grid items-start gap-6 xl:grid-cols-[2fr_0.96fr]">
        <section className="booking-panel p-6" style={{ animationDelay: "0.22s" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <h3 className="booking-title text-[23px] font-black tracking-[-0.025em] text-[var(--studio-ink)]">
                {currentCalendar.label}
              </h3>
              <button aria-label="Previous month" className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-[#eef1f5]" type="button">
                <ChevronLeft size={15} strokeWidth={2.5} />
              </button>
              <button aria-label="Next month" className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-[#eef1f5]" type="button">
                <ChevronRight size={15} strokeWidth={2.5} />
              </button>
            </div>

            <div className="inline-flex w-fit rounded-full bg-[#f1f3f7] p-1">
              <button className="booking-tab booking-tab-active" type="button">Month</button>
              <button className="booking-tab" type="button">Week</button>
              <button className="booking-tab" type="button">Day</button>
            </div>
          </div>

          <div className="calendar-grid mt-7 text-center text-[11px] font-black uppercase tracking-[0.12em] text-[var(--studio-muted)]">
            {weekdays.map((weekday) => (
              <div key={weekday}>{weekday}</div>
            ))}
          </div>

          <div className="calendar-grid mt-4">
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
  icon: LucideIcon;
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
      {events.slice(0, 2).map((event) => {
        const styles = getBookingTone(event.tone);

        return (
          <span className="calendar-event" key={event.label} style={{ backgroundColor: styles.fg }}>
            <CalendarCheck size={11} strokeWidth={2.5} />
            {event.label}
          </span>
        );
      })}
    </button>
  );
}

function BookingDetailCard({
  category,
  client,
  delay,
  id,
  initials,
  location,
  status,
  time,
  tone,
}: {
  category: string;
  client: string;
  delay: number;
  id: string;
  initials: string;
  location: string;
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
  icon: LucideIcon;
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
  icon: LucideIcon;
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
  icon: LucideIcon;
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
  icon: LucideIcon;
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