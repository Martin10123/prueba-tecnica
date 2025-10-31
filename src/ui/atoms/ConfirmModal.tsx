import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors } from './colors';
import Text from './Text';

type Props = {
    visible: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    visible,
    title = 'Confirmación',
    message,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    {title ? <Text variant="h2" style={styles.title}>{title}</Text> : null}
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.row}>
                        <Pressable accessibilityRole="button" style={[styles.btn, styles.btnSecondary]} onPress={onCancel}>
                            <Text style={styles.btnSecondaryText}>{cancelText}</Text>
                        </Pressable>
                        <Pressable accessibilityRole="button" style={[styles.btn, styles.btnPrimary]} onPress={onConfirm}>
                            <Text style={styles.btnPrimaryText}>{confirmText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        gap: 12,
    },
    title: { marginBottom: 4 },
    message: { color: colors.text },
    row: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', marginTop: 8 },
    btn: { height: 44, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    btnSecondary: { backgroundColor: colors.white, borderColor: colors.border },
    btnSecondaryText: { color: colors.text, fontWeight: '600' },
    btnPrimary: { backgroundColor: colors.brightBlue, borderColor: colors.brightBlue },
    btnPrimaryText: { color: colors.white, fontWeight: '700' },
});


