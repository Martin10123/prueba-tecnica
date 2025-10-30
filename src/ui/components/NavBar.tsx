import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../atoms/colors';
import Text from '../atoms/Text';

type NavItem = {
    label: string;
    icon: string;
    path: string;
};

const navItems: NavItem[] = [
    { label: 'Planes', icon: '💎', path: '/plans' },
    { label: 'Perfil', icon: '👤', path: '/profile' },
];

export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            {navItems.map((item) => {
                const isActive = pathname === item.path ||
                    (item.path === '/plans' && pathname?.startsWith('/plans'));
                return (
                    <Pressable
                        key={item.path}
                        style={[styles.item, isActive && styles.itemActive]}
                        onPress={() => router.push(item.path)}
                    >
                        <Text style={[styles.icon, isActive && styles.iconActive]}>
                            {item.icon}
                        </Text>
                        <Text style={[styles.label, isActive && styles.labelActive]}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        // Web shadow
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)' as any,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
    },
    itemActive: {
        backgroundColor: colors.lightBlue,
    },
    icon: {
        fontSize: 24,
        marginBottom: 4,
    },
    iconActive: {
        transform: [{ scale: 1.1 }],
    },
    label: {
        fontSize: 12,
        color: colors.muted,
        fontWeight: '500',
    },
    labelActive: {
        color: colors.brightBlue,
        fontWeight: '700',
    },
});

