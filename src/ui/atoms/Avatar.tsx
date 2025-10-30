import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from './colors';

type Props = { name: string; size?: number; uri?: string };

export default function Avatar({ name, size = 64, uri }: Props) {
    const initials = getInitials(name);
    const radius = size / 2;
    if (uri) {
        return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} />;
    }
    return (
        <View style={[styles.circle, { width: size, height: size, borderRadius: radius }]}>
            <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
    );
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

const styles = StyleSheet.create({
    circle: { backgroundColor: colors.brightBlue, alignItems: 'center', justifyContent: 'center' },
    text: { color: colors.white, fontWeight: '700' },
});


