import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from './colors';

type Props = {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
};

export default function Button({ title, onPress, disabled, variant = 'primary', style }: Props) {
    const isPrimary = variant === 'primary';
    return (
        <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.base,
                isPrimary ? styles.primary : styles.secondary,
                disabled && styles.disabled,
                pressed && styles.pressed,
                style,
            ]}
        >
            <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    primary: { backgroundColor: colors.brightBlue, borderColor: colors.brightBlue },
    secondary: { backgroundColor: colors.white, borderColor: colors.border },
    text: { fontSize: 16, fontWeight: '600' },
    textPrimary: { color: colors.white },
    textSecondary: { color: colors.text },
    pressed: { opacity: 0.9 },
    disabled: { opacity: 0.5 },
});


