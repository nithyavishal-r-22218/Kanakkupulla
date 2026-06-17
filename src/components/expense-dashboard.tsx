"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeIndianRupee,
  Banknote,
  CalendarDays,
  ChartNoAxesCombined,
  CircleGauge,
  CreditCard,
  Filter,
  Landmark,
  LogOut,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { addExpenseAction, logoutAction } from "@/app/actions";

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

const palette = ["#147b73", "#b45d35", "#d8a728", "#5b455f", "#2f6652", "#8f6c31"];

const currency = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
});

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
  const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalTax = expenses.reduce((sum, expense) => sum + expense.tax, 0);
  const averageSpend = expenses.length ? totalSpend / expenses.length : 0;
  const pendingSpend = expenses
    .filter((expense) => expense.status !== "Cleared")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryData = Object.values(
    expenses.reduce<Record<string, { name: string; value: number }>>((acc, expense) => {
      acc[expense.category] ??= { name: expense.category, value: 0 };
      acc[expense.category].value += expense.amount;
      return acc;
    }, {}),
  ).sort((a, b) => b.value - a.value);

  const trendData = Object.values(
    expenses.reduce<Record<string, { name: string; spend: number; tax: number }>>((acc, expense) => {
      const date = new Date(expense.spentAt);
      const key = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      acc[key] ??= { name: key, spend: 0, tax: 0 };
      acc[key].spend += expense.amount;
      acc[key].tax += expense.tax;
      return acc;
    }, {}),
  ).reverse();

  const budgetData = budgets.map((budget) => {
    const spent = categoryData.find((category) => category.name === budget.category)?.value ?? 0;
    return {
      ...budget,
      spent,
      used: Math.min(100, Math.round((spent / budget.limit) * 100)),
    };
  });

  return (
    <main className="kp-shell min-h-screen px-4 py-4 text-[#14120f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-5 grid gap-4 rounded-[1.75rem] border border-[#14120f]/10 bg-[#fffaf0]/70 p-4 shadow-sm backdrop-blur-xl lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#14120f] text-[#fff7e8] shadow-xl shadow-[#14120f]/20">
              <Landmark size={28} strokeWidth={1.7} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b45d35]">
                Kanakkupulla
              </p>
              <h1 className="font-serif text-3xl font-black leading-none sm:text-5xl">
                Expense command room
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-[#14120f]/10 bg-white/55 px-4 py-3 text-sm font-bold text-[#4e463b]">
              <span className="block text-[#14120f]">{user.name}</span>
              {user.role} | {user.email}
            </div>
            <form action={logoutAction}>
              <button className="kp-focus flex h-12 items-center gap-2 rounded-2xl bg-[#14120f] px-4 font-black text-[#fff7e8] transition hover:bg-[#2b241c]">
                <LogOut size={18} />
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-4">
          <MetricCard icon={BadgeIndianRupee} label="Total spend" value={currency.format(totalSpend)} tone="#147b73" />
          <MetricCard icon={CircleGauge} label="Average ticket" value={currency.format(averageSpend)} tone="#b45d35" />
          <MetricCard icon={ShieldCheck} label="Tax captured" value={currency.format(totalTax)} tone="#5b455f" />
          <MetricCard icon={Users} label="Users on DB" value={String(teammateCount)} tone="#d8a728" />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="kp-panel rounded-[1.75rem] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#147b73]">
                  Spend rhythm
                </p>
                <h2 className="text-2xl font-black">Daily movement and tax exposure</h2>
              </div>
              <ChartNoAxesCombined className="text-[#147b73]" size={30} />
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart data={trendData} margin={{ bottom: 0, left: 0, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="spend" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#147b73" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#147b73" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#d8cab8" strokeDasharray="4 8" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#6c6255", fontSize: 12, fontWeight: 700 }} tickLine={false} />
                  <YAxis tick={{ fill: "#6c6255", fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `₹${Number(value) / 1000}k`} tickLine={false} width={52} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area dataKey="spend" fill="url(#spend)" stroke="#147b73" strokeWidth={3} type="monotone" />
                  <Area dataKey="tax" fill="transparent" stroke="#b45d35" strokeDasharray="7 7" strokeWidth={2} type="monotone" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="kp-panel rounded-[1.75rem] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b45d35]">
                  Category map
                </p>
                <h2 className="text-2xl font-black">Where money concentrates</h2>
              </div>
              <Filter className="text-[#b45d35]" size={28} />
            </div>
            <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr] xl:grid-cols-1 2xl:grid-cols-[0.95fr_1.05fr]">
              <div className="h-[260px]">
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" innerRadius={68} outerRadius={105} paddingAngle={4}>
                      {categoryData.map((entry, index) => (
                        <Cell fill={palette[index % palette.length]} key={entry.name} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {categoryData.map((category, index) => (
                  <div className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3" key={category.name}>
                    <div className="flex items-center gap-3">
                      <span className="size-3 rounded-full" style={{ background: palette[index % palette.length] }} />
                      <span className="font-black">{category.name}</span>
                    </div>
                    <span className="font-black text-[#4e463b]">{currency.format(category.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="kp-panel rounded-[1.75rem] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#147b73]/10 text-[#147b73]">
                <Plus size={22} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#147b73]">
                  Capture
                </p>
                <h2 className="text-2xl font-black">Add business expense</h2>
              </div>
            </div>
            <form action={addExpenseAction} className="grid gap-3">
              <input name="userId" type="hidden" value={user.id} />
              <DashboardInput label="Merchant" name="merchant" placeholder="Vendor or supplier" />
              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardInput label="Amount" name="amount" placeholder="25000" type="number" />
                <DashboardInput label="Tax" name="tax" placeholder="4500" type="number" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardSelect label="Category" name="category" options={["SaaS", "Logistics", "Office", "Marketing", "Consulting", "Payroll", "Travel"]} />
                <DashboardSelect label="Payment" name="paymentMethod" options={["Corporate Card", "Bank Transfer", "UPI", "Cash", "Cheque"]} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardSelect label="Status" name="status" options={["Cleared", "Review", "Scheduled"]} />
                <DashboardInput label="Spent date" name="spentAt" type="date" />
              </div>
              <label className="text-sm font-black text-[#4e463b]">
                Note
                <textarea className="kp-focus mt-2 min-h-24 w-full resize-none rounded-2xl border border-[#14120f]/10 bg-white/65 px-4 py-3 font-bold text-[#14120f] placeholder:text-[#958b7e]" name="note" placeholder="Invoice, project, or approval context" />
              </label>
              <button className="kp-focus mt-1 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#147b73] px-5 font-black text-white transition hover:bg-[#0f625c]">
                <ReceiptText size={19} />
                Save expense
              </button>
            </form>
          </div>

          <div className="grid gap-4">
            <div className="kp-panel rounded-[1.75rem] p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5b455f]">
                    Budget pressure
                  </p>
                  <h2 className="text-2xl font-black">Planned versus consumed</h2>
                </div>
                <p className="rounded-full bg-[#5b455f]/10 px-4 py-2 text-sm font-black text-[#5b455f]">
                  Pending {currency.format(pendingSpend)}
                </p>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart data={budgetData} layout="vertical" margin={{ bottom: 0, left: 18, right: 20, top: 0 }}>
                    <CartesianGrid horizontal={false} stroke="#d8cab8" strokeDasharray="4 8" />
                    <XAxis tick={{ fill: "#6c6255", fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `₹${Number(value) / 1000}k`} type="number" />
                    <YAxis dataKey="category" tick={{ fill: "#4e463b", fontSize: 12, fontWeight: 800 }} type="category" width={88} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="limit" fill="#e0d1bd" radius={[0, 10, 10, 0]} />
                    <Bar dataKey="spent" fill="#5b455f" radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="kp-panel overflow-hidden rounded-[1.75rem]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#14120f]/10 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b45d35]">
                    Ledger stream
                  </p>
                  <h2 className="text-2xl font-black">Recent transactions</h2>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 text-sm font-black text-[#6c6255]">
                  <Search size={16} />
                  {expenses.length} entries
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-[#14120f]/5 text-xs uppercase tracking-[0.18em] text-[#6c6255]">
                    <tr>
                      <th className="px-5 py-4">Merchant</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Payment</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4 text-right">Amount</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#14120f]/10">
                    {expenses.map((expense) => (
                      <tr className="bg-white/30 transition hover:bg-white/60" key={expense.id}>
                        <td className="px-5 py-4">
                          <p className="font-black">{expense.merchant}</p>
                          <p className="mt-1 max-w-64 truncate text-xs font-bold text-[#756a5c]">{expense.note || "No note added"}</p>
                        </td>
                        <td className="px-5 py-4 font-bold">{expense.category}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1 font-bold text-[#4e463b]">
                            {expense.paymentMethod === "Corporate Card" ? <CreditCard size={15} /> : <Banknote size={15} />}
                            {expense.paymentMethod}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-[#4e463b]">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={15} />
                            {new Date(expense.spentAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-black">{currency.format(expense.amount)}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#147b73]/10 px-3 py-1 font-black text-[#0f625c]">
                            {expense.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <div className="kp-panel rounded-[1.5rem] p-4">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-white/65" style={{ color: tone }}>
          <Icon size={23} />
        </div>
        <span className="rounded-full bg-white/55 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#756a5c]">
          Live
        </span>
      </div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#756a5c]">{label}</p>
      <p className="mt-2 text-3xl font-black leading-none">{value}</p>
    </div>
  );
}

function DashboardInput({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="text-sm font-black text-[#4e463b]">
      {label}
      <input
        className="kp-focus mt-2 h-12 w-full rounded-2xl border border-[#14120f]/10 bg-white/65 px-4 font-bold text-[#14120f] placeholder:text-[#958b7e]"
        name={name}
        placeholder={placeholder}
        required={name !== "tax"}
        type={type}
      />
    </label>
  );
}

function DashboardSelect({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="text-sm font-black text-[#4e463b]">
      {label}
      <select className="kp-focus mt-2 h-12 w-full rounded-2xl border border-[#14120f]/10 bg-white/65 px-4 font-bold text-[#14120f]" name={name}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#14120f]/10 bg-[#fffaf0] p-3 shadow-xl">
      {label ? <p className="mb-2 text-sm font-black text-[#14120f]">{label}</p> : null}
      {payload.map((item) => (
        <p className="text-sm font-bold text-[#4e463b]" key={`${item.name}-${item.value}`}>
          {item.name}: {currency.format(item.value)}
        </p>
      ))}
    </div>
  );
}