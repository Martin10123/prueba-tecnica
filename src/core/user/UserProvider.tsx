import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { listenAuth, signInEmail, signOutAll, signUpEmail } from '../auth/firebaseAuth';
import { login as loginSvc, logout as logoutSvc, register as registerSvc } from '../auth/service';
import { fetchPlanById } from '../plans/service';
import { addSubscription, deactivateAllSubscriptions, deactivateByCategory, deactivateByPlanId, listSubscriptions, listenSubscriptions } from '../subscriptions/service';
import { User } from '../types';

type UserContextValue = {
    user: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
    subscribe: (planId: string) => Promise<void>;
    cancel: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    cancelPlan?: (planId: string) => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let unsubSubs: (() => void) | null = null;

        const unsubAuth = listenAuth((u) => {
            if (!u?.id) {
                setUser(null);
                setLoading(false);
                if (unsubSubs) {
                    unsubSubs();
                    unsubSubs = null;
                }
                return;
            }

            const loadUserData = async () => {
                try {
                    const subs = await listSubscriptions(u.id).catch(() => []);
                    setUser({ ...u, subscriptions: subs, isActive: subs.length > 0 });

                    if (unsubSubs) {
                        unsubSubs();
                    }
                    unsubSubs = listenSubscriptions(u.id, (realtimeSubs) => {
                        setUser(prev => prev ? { ...prev, subscriptions: realtimeSubs, isActive: realtimeSubs.length > 0 } : null);
                    });
                } catch {
                    setUser(u);
                } finally {
                    setLoading(false);
                }
            };

            loadUserData();
        });

        return () => {
            unsubAuth();
            if (unsubSubs) {
                unsubSubs();
            }
        };
    }, []);

    const subscribe = useCallback(async (planId: string) => {
        setLoading(true);
        try {
            if (user?.id) {
                const plan = await fetchPlanById(planId);
                if (plan) {
                    // Check if user already has an active subscription in this category
                    const hasSameCategory = (user.subscriptions ?? []).some(s => s.category === plan.category);
                    if (hasSameCategory) {
                        throw new Error('Ya tienes un plan activo en esta categoría. Cancela el actual para continuar.');
                    }
                    await addSubscription(user.id, { planId: plan.id, planName: plan.name, category: plan.category, billing: 'monthly' });
                }
                const subs = await listSubscriptions(user.id).catch(() => []);
                setUser(prev => prev ? { ...prev, subscriptions: subs, isActive: subs.length > 0 } : prev);
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    const cancel = useCallback(async () => {
        setLoading(true);
        try {
            if (user?.id) {
                await deactivateAllSubscriptions(user.id);
                const subs = await listSubscriptions(user.id, true).catch(() => []);
                setUser(prev => prev ? { ...prev, subscriptions: subs, isActive: subs.length > 0 } : prev);
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    const cancelPlan = useCallback(async (planId: string) => {
        setLoading(true);
        try {
            if (user?.id) {
                await deactivateByPlanId(user.id, planId);
                const subs = await listSubscriptions(user.id, true).catch(() => []);
                setUser(prev => prev ? { ...prev, subscriptions: subs, isActive: subs.length > 0 } : prev);
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const u = await signInEmail(email, password).catch(async () => await loginSvc(email, password));
            setUser(u);
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const u = await signUpEmail(name, email, password).catch(async () => await registerSvc(name, email, password));
            setUser(u);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await signOutAll().catch(async () => { await logoutSvc(); });
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const subs = await listSubscriptions(user.id).catch(() => []);
            setUser(prev => prev ? { ...prev, subscriptions: subs, isActive: subs.length > 0 } : prev);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const value = useMemo<UserContextValue>(
        () => ({ user, loading, refresh, subscribe, cancel, login, register, logout, cancelPlan }),
        [user, loading, refresh, subscribe, cancel, login, register, logout, cancelPlan]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
}


