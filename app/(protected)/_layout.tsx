import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useUser } from '../../src/core/user/UserProvider';
import { colors } from '../../src/ui/atoms/colors';
import NavBar from '../../src/ui/components/NavBar';

export default function ProtectedLayout() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brightBlue} />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/auth/login" />;
    }

    return (
        <View style={styles.container}>
            {/* Theme toggle moved to profile screen */}
            <View style={styles.content}>
                <Slot />
            </View>
            <NavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightBlue,
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightBlue,
    },
});


