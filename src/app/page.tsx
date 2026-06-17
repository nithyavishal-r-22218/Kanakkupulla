import {
  IconEyeOff as EyeOff,
  IconLock as Lock,
  IconMail as Mail,
  IconSparkle as Sparkle,
  IconUserCircle as UserRound,
} from "@tabler/icons-react";

import { loginAction, registerAction } from "@/app/actions";
import { ExpenseDashboard } from "@/components/expense-dashboard";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type HomeProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const [{ error }, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    return <AuthExperience error={error} />;
  }

  const [expenses, budgets, teammateCount] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { spentAt: "desc" },
    }),
    prisma.budget.findMany({
      where: { userId: user.id },
      orderBy: { category: "asc" },
    }),
    prisma.user.count(),
  ]);

  return (
    <ExpenseDashboard
      budgets={budgets.map((budget) => ({
        id: budget.id,
        category: budget.category,
        limit: budget.limit,
        period: budget.period,
      }))}
      expenses={expenses.map((expense) => ({
        id: expense.id,
        merchant: expense.merchant,
        category: expense.category,
        amount: expense.amount,
        tax: expense.tax,
        paymentMethod: expense.paymentMethod,
        status: expense.status,
        note: expense.note,
        spentAt: expense.spentAt.toISOString(),
      }))}
      teammateCount={teammateCount}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    />
  );
}

function AuthExperience({ error }: { error?: string }) {
  return (
    <main className="signin-stage">
      <div className="rupee-field" aria-hidden="true">
        <span>₹</span>
        <span>₹</span>
        <span>₹</span>
        <span>₹</span>
        <span>₹</span>
      </div>
      <div className="confetti-field" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <section className="signin-window" aria-label="Kanakkupulla account access">
        <div className="signin-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Kanakkupulla Expense Tracker logo"
            className="signin-logo"
            src="/Kanakkupulla.PNG"
          />

          <div className="signin-tabs" aria-label="Account mode">
            <a className="signin-tab" href="#signin-form">Sign in</a>
            <a className="signup-tab" href="#signup-form">Sign up</a>
          </div>

          <form action={loginAction} className="login-form" id="signin-form">
            <h1>Welcome Back to Kanakkupulla</h1>

            {error ? <div className="auth-error">{error}</div> : null}

            <IconField
              icon={<Mail size={19} />}
              label="Email or username"
              name="email"
              placeholder="Email or username"
              type="email"
            />
            <IconField
              actionIcon={<EyeOff size={18} />}
              icon={<Lock size={19} />}
              label="Password"
              name="password"
              placeholder="Password"
              type="password"
            />

            <div className="signin-options">
              <label>
                <input name="remember" type="checkbox" />
                Remember Me
              </label>
              <a href="#signup-form">Forgot Password?</a>
            </div>

            <button className="primary-auth-button" type="submit">
              Sign In
            </button>

            <div className="auth-divider">
              <span />
              <small>or</small>
              <span />
            </div>

            <button className="social-button" type="button">
              <GoogleMark />
              Sign in with Google
            </button>
            <button className="social-button apple" type="button">
              <AppleMark />
              Sign in with Apple
            </button>

            <p className="signup-jump">
              Don&apos;t have an account? <a href="#signup-form">Sign Up now</a>
            </p>
          </form>

          <form action={registerAction} className="signup-form" id="signup-form">
            <h1>Create Your Account</h1>
            <div className="signup-grid">
              <IconField
                icon={<UserRound size={19} />}
                label="Full Name"
                name="name"
                placeholder="Full Name"
                type="text"
              />
              <IconField
                icon={<Mail size={19} />}
                label="Email or username"
                name="email"
                placeholder="Email/username"
                type="email"
              />
              <IconField
                actionIcon={<EyeOff size={18} />}
                icon={<Lock size={19} />}
                label="Password"
                name="password"
                placeholder="Password"
                type="password"
              />
            </div>

            <button className="primary-auth-button" type="submit">
              Sign Up
            </button>

            <div className="auth-divider">
              <span />
              <small>or</small>
              <span />
            </div>

            <button className="social-button" type="button">
              <GoogleMark />
              Sign up with Google
            </button>
            <button className="social-button apple" type="button">
              <AppleMark />
              Sign up with Apple
            </button>

            <p className="signup-jump">
              Already have an account? <a href="#signin-form">Sign In now</a>
            </p>
          </form>
        </div>
      </section>

      <div className="signin-badge" aria-hidden="true">
        <Sparkle size={18} />
        Expense Tracker
      </div>
    </main>
  );
}

function IconField({
  actionIcon,
  icon,
  label,
  name,
  placeholder,
  type,
}: {
  actionIcon?: React.ReactNode;
  icon: React.ReactNode;
  label: string;
  name: string;
  placeholder: string;
  type: string;
}) {
  return (
    <label className="icon-field">
      <span className="sr-only">{label}</span>
      {icon}
      <input name={name} placeholder={placeholder} required type={type} />
      {actionIcon ? <span className="field-action">{actionIcon}</span> : null}
    </label>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="google-mark" viewBox="0 0 24 24">
      <path d="M21.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-0.9 6.7-2.4l-3.3-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3v2.6A10 10 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3a10 10 0 0 0 0 9l3.4-2.6Z" fill="#FBBC05" />
      <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-9 5.5l3.4 2.6C7.2 7.8 9.4 6 12 6Z" fill="#EA4335" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg aria-hidden="true" className="apple-mark" viewBox="0 0 20 24">
      <path
        d="M16.7 12.8c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.3.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 7.9.7 1 1.4 2 2.5 2 1 0 1.4-.6 2.6-.6 1.2 0 1.5.6 2.6.6s1.8-1 2.5-1.9c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.2-.8-2.2-3ZM14.7 6.8c.6-.7.9-1.7.8-2.7-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.9 2.5.9.1 1.9-.4 2.5-1Z"
        fill="currentColor"
      />
    </svg>
  );
}
