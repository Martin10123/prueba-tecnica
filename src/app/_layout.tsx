import { Slot } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from '../core/user/UserProvider';

export default function Layout() {
    return (
        <SafeAreaProvider>
            <UserProvider>
                <Slot />
            </UserProvider>
        </SafeAreaProvider>
    );
}


