export type PlanCategory =
  | "fitness"
  | "streaming"
  | "elearning"
  | "coworking"
  | "digital";

export type Plan = {
  id: string;
  name: string;
  description: string;
  imageEmoji: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  category: PlanCategory;
  tier?: string;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  subscriptionPlanId: string | null; // legacy single-plan field
  isActive: boolean; // derived if has any active subscription
  subscriptions?: Subscription[]; // multi-plan support
};

export type Subscription = {
  planId: string;
  planName: string;
  category: PlanCategory;
  startedAt: number;
  active?: boolean;
};
