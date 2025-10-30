import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { fetchPlans } from '../../src/core/plans/service';
import { Plan } from '../../src/core/types';
import Text from '../../src/ui/atoms/Text';

export default function PlansListScreen() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <FlatList
            data={plans}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
                <Link asChild href={`/plans/${item.id}`}>
                    <Pressable style={styles.card}>
                        <Text variant="h1" style={styles.title}>{item.name}</Text>
                        <Text style={styles.price}>${item.pricePerMonth.toFixed(2)}/mes</Text>
                        <Text>{item.description}</Text>
                    </Pressable>
                </Link>
            )}
        />
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    list: { padding: 16 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
    title: { marginBottom: 6 },
    price: { marginBottom: 8, fontWeight: '600' },
});


