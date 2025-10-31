import { Plan, User } from "../types";
import { getPlanByIdFS, listPlansFS, seedPlansIfEmpty } from "./firestore";

export const mockPlans: Plan[] = [
  {
    id: "fit-basic",
    name: "Fit Basic",
    description: "Acceso al gimnasio en horario regular y máquinas de cardio.",
    imageEmoji: "💪",
    priceMonthly: 69900,
    priceYearly: 59900,
    features: [
      "Acceso 6am-9pm",
      "Área de cardio y pesas",
      "1 asesoría inicial",
    ],
    category: "fitness",
    tier: "Básico",
  },
  {
    id: "fit-plus",
    name: "Fit Plus",
    description: "Clases grupales y acceso extendido para entrenar a tu ritmo.",
    imageEmoji: "🏋️",
    priceMonthly: 119900,
    priceYearly: 99900,
    features: [
      "Acceso 24/7",
      "Clases grupales ilimitadas",
      "Locker estándar",
      "2 asesorías al mes",
    ],
    category: "fitness",
    tier: "Premium",
  },
  {
    id: "fit-elite",
    name: "Fit Elite",
    description: "Experiencia completa con spa, entrenador y toallas premium.",
    imageEmoji: "👑",
    priceMonthly: 199900,
    priceYearly: 169900,
    features: [
      "Acceso 24/7",
      "Entrenador personal mensual",
      "Spa y sauna",
      "Locker premium y toallas",
    ],
    category: "fitness",
    tier: "VIP",
  },
  {
    id: "stream-ind",
    name: "Individual",
    description: "Perfil individual y calidad HD.",
    imageEmoji: "📺",
    priceMonthly: 22900,
    priceYearly: 19900,
    features: ["1 usuario", "HD"],
    category: "streaming",
    tier: "Individual",
  },
  {
    id: "stream-fam",
    name: "Familiar",
    description: "Hasta 4 perfiles, control parental.",
    imageEmoji: "👨‍👩‍👧‍👦",
    priceMonthly: 42900,
    priceYearly: 36900,
    features: ["4 usuarios", "Full HD", "Control parental"],
    category: "streaming",
    tier: "Familiar",
  },
  {
    id: "stream-pre",
    name: "Premium",
    description: "Calidad 4K y descargas.",
    imageEmoji: "⭐",
    priceMonthly: 62900,
    priceYearly: 54900,
    features: ["4K", "Descargas"],
    category: "streaming",
    tier: "Premium",
  },
  {
    id: "edu-mes",
    name: "Mensual",
    description: "Acceso a todos los cursos.",
    imageEmoji: "🎓",
    priceMonthly: 39900,
    priceYearly: 29900,
    features: ["Cursos ilimitados", "Certificados"],
    category: "elearning",
    tier: "Mensual",
  },
  {
    id: "edu-anu",
    name: "Anual",
    description: "Mejor precio por mes.",
    imageEmoji: "📚",
    priceMonthly: 29900,
    priceYearly: 24900,
    features: ["Mentorías", "Certificados"],
    category: "elearning",
    tier: "Anual",
  },
  {
    id: "cw-pt",
    name: "Part-time",
    description: "Horas de uso en cowork.",
    imageEmoji: "🏢",
    priceMonthly: 299000,
    priceYearly: 249000,
    features: ["40h/mes", "Salas de reunión", "Café"],
    category: "coworking",
    tier: "Part-time",
  },
  {
    id: "dig-free",
    name: "Free",
    description: "Plan gratuito con anuncios.",
    imageEmoji: "🆓",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["Básico"],
    category: "digital",
    tier: "Free",
  },
];

let mockUser: User = {
  id: "user-1",
  name: "Jane Doe",
  email: undefined,
  subscriptionPlanId: null,
  isActive: false,
};

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const list = await listPlansFS();
    if (list.length > 0) return list;
    await seedPlansIfEmpty(mockPlans);
    return await listPlansFS();
  } catch {
    return mockPlans;
  }
}

export async function fetchPlanById(planId: string): Promise<Plan | undefined> {
  try {
    const p = await getPlanByIdFS(planId);
    if (p) return p;
  } catch {}
  return mockPlans.find((p) => p.id === planId);
}

export async function subscribeToPlan(planId: string): Promise<User> {
  await delay(300);
  const plan = mockPlans.find((p) => p.id === planId);
  const subs = mockUser.subscriptions ?? [];
  const newSub = plan
    ? {
        planId: plan.id,
        planName: plan.name,
        category: plan.category,
        startedAt: Date.now(),
      }
    : ({
        planId,
        planName: planId,
        category: "fitness",
        startedAt: Date.now(),
      } as any);
  mockUser = {
    ...mockUser,
    subscriptionPlanId: planId,
    isActive: true,
    subscriptions: [...subs, newSub],
  };
  return mockUser;
}

export async function cancelSubscription(): Promise<User> {
  await delay(300);
  mockUser = {
    ...mockUser,
    subscriptionPlanId: null,
    isActive: (mockUser.subscriptions ?? []).length > 0,
  };
  return mockUser;
}

export async function fetchCurrentUser(): Promise<User> {
  await delay(150);
  return mockUser;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
