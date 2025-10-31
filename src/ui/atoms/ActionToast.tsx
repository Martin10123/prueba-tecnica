import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from './colors';
import Text from './Text';

type Props = {
    visible: boolean;
    emoji?: string;
    message: string;
    durationMs?: number;
    style?: ViewStyle;
};

export default function ActionToast({ visible, emoji = '✨', message, durationMs = 1200, style }: Props) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 0.92, duration: 140, useNativeDriver: true }),
            ]).start();
        }
    }, [visible, opacity, scale]);

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity, transform: [{ scale }] },
                style,
            ]}
        >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 96,
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none' as any,
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)' as any,
    },
    emoji: { fontSize: 16 },
    text: { fontWeight: '600' },
});


