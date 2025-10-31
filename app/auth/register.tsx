import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useUser } from '../../src/core/user/UserProvider';
import { Button, Input, Text, colors } from '../../src/ui/atoms';

export default function RegisterScreen() {
    const { register, loading } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmit() {
        try {
            await register(name.trim(), email.trim(), password);
            router.replace('/');
        } catch (e: any) {
            Alert.alert('Error', e?.message ?? 'No se pudo registrar');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text variant="h1" style={styles.title}>Crear cuenta</Text>
                <Input placeholder="Nombre" value={name} onChangeText={setName} />
                <Input placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                <Input placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
                <Button title={loading ? 'Creando…' : 'Registrarse'} onPress={onSubmit} />
                <Text style={styles.hint}>¿Ya tienes cuenta? <Link href="/auth/login">Entrar</Link></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.lightBlue, alignItems: 'center', justifyContent: 'center', padding: 24 },
    card: { width: '100%', maxWidth: 420, gap: 12, backgroundColor: colors.white, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
    title: { marginBottom: 4 },
    hint: { color: colors.muted, marginTop: 6 },
});



