import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { fetchPlanById } from '../../src/core/plans/service';
import { Plan } from '../../src/core/types';
import { useUser } from '../../src/core/user/UserProvider';
import Text from '../../src/ui/atoms/Text';

export default function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [plan, setPlan] = useState<Plan | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const { subscribe, loading: userLoading, user } = useUser();

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

    const isCurrent = user?.subscriptionPlanId === plan.id;

    return (
        <View style={styles.wrapper}>
            <Text variant="h1" style={styles.title}>{plan.name}</Text>
            <Text style={styles.price}>${plan.pricePerMonth.toFixed(2)}/mes</Text>
            <Text style={styles.desc}>{plan.description}</Text>

            <Button
                title={isCurrent ? 'Ya suscrito' : 'Suscribirse'}
                disabled={isCurrent || userLoading}
                onPress={async () => {
                    await subscribe(plan.id);
                    router.push('/profile');
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    wrapper: { flex: 1, padding: 16, gap: 12 },
    title: { marginBottom: 6 },
    price: { fontWeight: '600' },
    desc: { marginBottom: 12 },
});


