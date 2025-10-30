import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { fetchPlanById } from '../../../core/plans/service';
import { Plan } from '../../../core/types';
import { useUser } from '../../../core/user/UserProvider';
import { Button, Text, colors } from '../../../ui/atoms';
import ActionToast from '../../../ui/atoms/ActionToast';

export default function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [plan, setPlan] = useState<Plan | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const { subscribe, loading: userLoading, user, cancelPlan } = useUser();
    const [toast, setToast] = useState<{ visible: boolean; msg: string; emoji: string }>({ visible: false, msg: '', emoji: '✨' });
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const p = await fetchPlanById(String(id));
                setPlan(p);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

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
            <Text variant="h1" style={styles.title}>{plan.imageEmoji} {plan.name}</Text>
            <View style={styles.pillRow}>
                <Button title="Mensual" variant={billing === 'monthly' ? 'primary' : 'secondary'} onPress={() => setBilling('monthly')} />
                <Button title="Anual" variant={billing === 'yearly' ? 'primary' : 'secondary'} onPress={() => setBilling('yearly')} />
            </View>
            <Text style={styles.price}>${price.toFixed(2)}/mes</Text>
            <Text style={styles.desc}>{plan.description}</Text>
            <View style={styles.features}>
                {plan.features.map((f) => (
                    <Text key={f}>• {f}</Text>
                ))}
            </View>

            {isCurrent ? (
                <Button title={'Cancelar plan'} variant="secondary" onPress={async () => {
                    await (cancelPlan?.(plan.id));
                    setToast({ visible: true, msg: 'Suscripción cancelada', emoji: '🗑️' });
                    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 900);
                }} />
            ) : (
                <Button title={'Suscribirse'} disabled={userLoading} onPress={async () => {
                    await subscribe(plan.id);
                    setToast({ visible: true, msg: '¡Suscripción creada!', emoji: '✅' });
                    setTimeout(() => {
                        setToast((t) => ({ ...t, visible: false }));
                        router.push('/profile');
                    }, 900);
                }} />
            )}

            <ActionToast visible={toast.visible} message={toast.msg} emoji={toast.emoji} />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    wrapper: { flex: 1, padding: 16, gap: 12, backgroundColor: colors.lightBlue },
    title: { marginBottom: 6 },
    price: { fontWeight: '600', color: colors.brightBlue },
    desc: { marginBottom: 12, color: colors.muted },
    features: { gap: 4 },
    pillRow: { flexDirection: 'row', gap: 12 },
});


