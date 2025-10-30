import { User } from "../types";

let users: Record<string, User & { password: string }> = {};
let currentUserId: string | null = null;

export async function register(
  name: string,
  email: string,
  password: string
): Promise<User> {
  await delay(300);
  if (users[email]) throw new Error("Email ya registrado");
  const user: User & { password: string } = {
    id: `user-${Date.now()}`,
    name,
    email,
    isActive: false,
    subscriptionPlanId: null,
    password,
  };
  users[email] = user;
  currentUserId = user.id;
  return strip(user);
}

export async function login(email: string, password: string): Promise<User> {
  await delay(250);
  const user = users[email];
  if (!user || user.password !== password)
    throw new Error("Credenciales inválidas");
  currentUserId = user.id;
  return strip(user);
}

export async function logout(): Promise<void> {
  await delay(150);
  currentUserId = null;
}

export async function getSession(): Promise<User | null> {
  await delay(150);
  if (!currentUserId) return null;
  const u = Object.values(users).find((u) => u.id === currentUserId) || null;
  return u ? strip(u) : null;
}

function strip(u: User & { password: string }): User {
  const { password, ...rest } = u;
  return rest;
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
