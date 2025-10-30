import { Redirect, router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUser } from '../core/user/UserProvider';
import { Button, Text, colors } from '../ui/atoms';

export default function Index() {
    const { user, loading } = useUser();

    // Si el usuario está autenticado, redirigir a la página principal protegida
    if (!loading && user) {
        return <Redirect href="/plans" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text variant="h1" style={styles.title}>Membresías</Text>
                <Text style={styles.subtitle}>Elige un plan y disfruta de beneficios exclusivos.</Text>
            </View>
            <View style={styles.actions}>
                {!loading && (
                    <>
                        <Button title="Iniciar sesión" onPress={() => router.push('/auth/login')} />
                        <Button title="Crear cuenta" variant="secondary" onPress={() => router.push('/auth/register')} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.lightBlue, padding: 24 },
    hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { marginBottom: 8 },
    subtitle: { color: colors.muted, marginBottom: 16 },
    actions: { gap: 12, paddingBottom: 24 },
});


