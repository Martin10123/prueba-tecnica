import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { useUser } from '../src/core/user/UserProvider';
import Text from '../src/ui/atoms/Text';

export default function ProfileScreen() {
    const { user, loading, cancel } = useUser();

    if (loading && !user) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <Text variant="h1">Perfil</Text>
            <Text>Nombre: {user?.name}</Text>
            <Text>Estado: {user?.isActive ? 'Activo' : 'Inactivo'}</Text>
            <Text>Plan: {user?.subscriptionPlanId ?? 'Sin suscripción'}</Text>

            {user?.isActive ? (
                <Button title="Cancelar suscripción" onPress={cancel} />
            ) : (
                <Link href="/plans">Elegir un plan</Link>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    wrapper: { flex: 1, padding: 16, gap: 12 },
});


