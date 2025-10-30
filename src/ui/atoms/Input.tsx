import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors } from './colors';

export default function Input(props: TextInputProps) {
    return (
        <TextInput
            placeholderTextColor={colors.muted}
            {...props}
            style={[styles.input, props.style]}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
        paddingHorizontal: 14,
        fontSize: 16,
        color: colors.text,
    },
});


