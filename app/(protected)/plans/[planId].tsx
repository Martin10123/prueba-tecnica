import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { fetchPlanById } from '../../../src/core/plans/service';
import { Plan } from '../../../src/core/types';
import { useUser } from '../../../src/core/user/UserProvider';
import { Button, Text, colors } from '../../../src/ui/atoms';
import ActionToast from '../../../src/ui/atoms/ActionToast';

const formatCOP = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

export default function PlanDetailScreen() {
    const { planId } = useLocalSearchParams<{ planId: string }>();
    const [plan, setPlan] = useState<Plan | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const { subscribe, loading: userLoading, user, cancelPlan } = useUser();
    const [toast, setToast] = useState<{ visible: boolean; msg: string; emoji: string }>({ visible: false, msg: '', emoji: '✨' });
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const p = await fetchPlanById(String(planId));
                setPlan(p);
            } finally {
                setLoading(false);
            }
        })();
    }, [planId]);

    if (loading || !plan) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    const isCurrent = (user?.subscriptions ?? []).some(s => s.planId === plan.id);
    const price = billing === 'monthly' ? plan.priceMonthly : plan.priceYearly;

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Button title="← Volver" variant="secondary" style={{ alignSelf: 'flex-start', minWidth: 120 }} onPress={() => router.back()} />
            </View>
            <Text variant="h1" style={styles.title}>{plan.imageEmoji} {plan.name}</Text>
            <View style={styles.pillRow}>
                <Button title="Mensual" variant={billing === 'monthly' ? 'primary' : 'secondary'} onPress={() => setBilling('monthly')} />
                <Button title="Anual" variant={billing === 'yearly' ? 'primary' : 'secondary'} onPress={() => setBilling('yearly')} />
            </View>
            <Text style={styles.price}>{formatCOP(price)}/mes</Text>
            <Text style={styles.desc}>{plan.description}</Text>
            <View style={styles.features}>
                {plan.features.map((f) => (
                    <Text key={f}>• {f}</Text>
                ))}
            </View>

            {isCurrent ? (
                <Button title={'Cancelar plan'} variant="secondary" style={{ alignSelf: 'center', minWidth: 220 }} onPress={async () => {
                    await (cancelPlan?.(plan.id));
                    setToast({ visible: true, msg: 'Suscripción cancelada', emoji: '🗑️' });
                    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 900);
                }} />
            ) : (
                <Button title={'Suscribirse'} disabled={userLoading} style={{ alignSelf: 'center', minWidth: 220 }} onPress={async () => {
                    try {
                        await subscribe(plan.id);
                        setToast({ visible: true, msg: '¡Suscripción creada!', emoji: '✅' });
                        setTimeout(() => {
                            setToast((t) => ({ ...t, visible: false }));
                            router.push('/profile');
                        }, 900);
                    } catch (e: any) {
                        alert(e?.message ?? 'No se pudo suscribir.');
                    }
                }} />
            )}

            <ActionToast visible={toast.visible} message={toast.msg} emoji={toast.emoji} />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    wrapper: { flex: 1, padding: 16, paddingTop: 28, gap: 12, backgroundColor: colors.lightBlue },
    header: { marginBottom: 8, alignItems: 'flex-start' },
    title: { marginBottom: 6 },
    price: { fontWeight: '600', color: colors.brightBlue },
    desc: { marginBottom: 12, color: colors.muted },
    features: { gap: 4 },
    pillRow: { flexDirection: 'row', gap: 12 },
});



