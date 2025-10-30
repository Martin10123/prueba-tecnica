import { Link } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { fetchPlans } from '../../../core/plans/service';
import { Plan, PlanCategory } from '../../../core/types';
import { Button, Text, colors } from '../../../ui/atoms';

export default function PlansListScreen() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [category, setCategory] = useState<PlanCategory>('fitness');

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await fetchPlans();
                setPlans(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const categories: { key: PlanCategory; label: string }[] = [
        { key: 'fitness', label: 'Gimnasio' },
        { key: 'streaming', label: 'Streaming' },
        { key: 'elearning', label: 'Cursos' },
        { key: 'coworking', label: 'Coworking' },
        { key: 'digital', label: 'Servicios' },
    ];

    const visible = useMemo(() => plans.filter(p => p.category === category), [plans, category]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightBlue }}>
            <View style={styles.toggleRow}>
                <Button title="Mensual" variant={billing === 'monthly' ? 'primary' : 'secondary'} onPress={() => setBilling('monthly')} />
                <Button title="Anual" variant={billing === 'yearly' ? 'primary' : 'secondary'} onPress={() => setBilling('yearly')} />
            </View>
            <View style={styles.catRow}>
                {categories.map(c => (
                    <Button key={c.key} title={c.label} variant={category === c.key ? 'primary' : 'secondary'} onPress={() => setCategory(c.key)} />
                ))}
            </View>
            <FlatList
                data={visible}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Link asChild href={`/plans/${item.id}`}>
                        <Pressable style={styles.card}>
                            <Text variant="h1" style={styles.title}>{item.imageEmoji} {item.name}</Text>
                            <Text style={styles.price}>{billing === 'monthly' ? `$${item.priceMonthly.toFixed(2)}/mes` : `$${item.priceYearly.toFixed(2)}/mes · anual`}</Text>
                            <Text style={styles.desc}>{item.description}</Text>
                            <View style={styles.features}>
                                {item.features.slice(0, 3).map((f) => (
                                    <Text key={f}>• {f}</Text>
                                ))}
                            </View>
                        </Pressable>
                    </Link>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    toggleRow: { flexDirection: 'row', gap: 12, padding: 16, justifyContent: 'center', backgroundColor: colors.lightBlue },
    catRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8, flexWrap: 'wrap', justifyContent: 'center' },
    list: { padding: 16 },
    card: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
    title: { marginBottom: 6 },
    price: { marginBottom: 8, fontWeight: '600', color: colors.brightBlue },
    desc: { color: colors.muted, marginBottom: 8 },
    features: { gap: 2 },
});


