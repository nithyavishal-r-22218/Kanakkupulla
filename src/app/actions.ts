"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearSession, createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const starterExpenses = [
  ["CloudDesk Pro", "SaaS", 18400, 3312, "Corporate Card", "Cleared", -2],
  ["Metro Logistics", "Logistics", 42900, 7722, "Bank Transfer", "Cleared", -8],
  ["Nila Workspace", "Office", 31500, 5670, "UPI", "Review", -13],
  ["Pixel Foundry", "Marketing", 67000, 12060, "Corporate Card", "Cleared", -19],
  ["Aster Consulting", "Consulting", 92500, 16650, "Bank Transfer", "Scheduled", -24],
];

const starterBudgets = [
  ["SaaS", 65000],
  ["Logistics", 90000],
  ["Office", 55000],
  ["Marketing", 120000],
  ["Consulting", 140000],
];

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    redirect("/?error=Create an account with a name, email, and 8 character password.");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    redirect("/?error=That email already has a Kanakkupulla workspace.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      expenses: {
        create: starterExpenses.map(
          ([merchant, category, amount, tax, paymentMethod, status, dayOffset]) => ({
            merchant: String(merchant),
            category: String(category),
            amount: Number(amount),
            tax: Number(tax),
            paymentMethod: String(paymentMethod),
            status: String(status),
            spentAt: new Date(Date.now() + Number(dayOffset) * 86_400_000),
          }),
        ),
      },
      budgets: {
        create: starterBudgets.map(([category, limit]) => ({
          category: String(category),
          limit: Number(limit),
        })),
      },
    },
  });

  await createSession(user.id);
  redirect("/");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect("/?error=Email or password is incorrect.");
  }

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function addExpenseAction(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const merchant = String(formData.get("merchant") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const tax = Number(formData.get("tax") ?? 0);
  const paymentMethod = String(formData.get("paymentMethod") ?? "Corporate Card");
  const status = String(formData.get("status") ?? "Cleared");
  const spentAt = new Date(String(formData.get("spentAt") ?? new Date().toISOString()));
  const note = String(formData.get("note") ?? "").trim();

  if (!userId || !merchant || !category || !Number.isFinite(amount) || amount <= 0) {
    redirect("/?error=Expense needs a merchant, category, and valid amount.");
  }

  await prisma.expense.create({
    data: {
      userId,
      merchant,
      category,
      amount,
      tax: Number.isFinite(tax) ? tax : 0,
      paymentMethod,
      status,
      spentAt,
      note: note || null,
    },
  });

  revalidatePath("/");
}