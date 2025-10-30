import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { fetchPlans } from '../../core/plans/service';
import { Plan, PlanCategory } from '../../core/types';
import { useUser } from '../../core/user/UserProvider';
import { Button, Text, colors } from '../../ui/atoms';
import ActionToast from '../../ui/atoms/ActionToast';
import Avatar from '../../ui/atoms/Avatar';
import ConfirmModal from '../../ui/atoms/ConfirmModal';

const categoryIcons: Record<PlanCategory, string> = {
    fitness: '💪',
    streaming: '📺',
    elearning: '🎓',
    coworking: '🏢',
    digital: '🆓',
};

const categoryLabels: Record<PlanCategory, string> = {
    fitness: 'Gimnasio',
    streaming: 'Streaming',
    elearning: 'Cursos',
    coworking: 'Coworking',
    digital: 'Servicios',
};

export default function ProfileScreen() {
    const { user, cancel, logout, cancelPlan } = useUser();
    const [busy, setBusy] = useState<string | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; msg: string; emoji: string }>({ visible: false, msg: '', emoji: '✨' });
    const [confirmState, setConfirmState] = useState<{
        visible: boolean;
        message: string;
        action?: () => Promise<void>
    }>({
        visible: false,
        message: '',
        action: undefined
    });
    const [plansById, setPlansById] = useState<Record<string, Plan>>({});

    const groupedSubs = useMemo(() => {
        const groups: Record<string, any[]> = {};
        const list = user?.subscriptions ?? [];
        for (let i = 0; i < list.length; i++) {
            const sub = list[i];
            const key = sub.category as string;
            if (!groups[key]) groups[key] = [];
            groups[key].push(sub);
        }
        return groups;
    }, [user]);

    useEffect(() => {
        (async () => {
            try {
                const list = await fetchPlans();
                const map: Record<string, Plan> = {};
                for (let i = 0; i < list.length; i++) {
                    map[list[i].id] = list[i];
                }
                setPlansById(map);
            } catch { }
        })();
    }, []);

    const totalMonthly = useMemo(() => {
        const subs = user?.subscriptions ?? [];
        let sum = 0;
        for (let i = 0; i < subs.length; i++) {
            const plan = plansById[subs[i].planId];
            if (plan) sum += plan.priceMonthly;
        }
        return sum;
    }, [user?.subscriptions, plansById]);

    function showConfirm(message: string, run: () => Promise<void>) {
        if (Platform.OS === 'web') {
            // En web no se usa confirmación personalizada, ejecuta directamente
            run();
            return;
        }
        // Guardar la acción y mostrar el modal
        setConfirmState({ visible: true, message, action: run });
    }

    const handleCancelPlan = (planId: string) => {
        showConfirm('¿Estás seguro de que deseas cancelar esta suscripción?', async () => {
            try {
                setBusy(`plan:${planId}`);
                await cancelPlan?.(planId);
                setToast({ visible: true, msg: 'Suscripción cancelada', emoji: '🗑️' });
                setTimeout(() => setToast((t) => ({ ...t, visible: false })), 900);
            } catch {
                Alert.alert('Error', 'No se pudo cancelar la suscripción');
            } finally {
                setBusy(null);
            }
        });
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Avatar name={user?.name || 'Usuario'} size={100} />
                <Text variant="h1" style={styles.name}>
                    {user?.name || 'Usuario'}
                </Text>
                <Text style={styles.email}>{user?.email || 'Sin email'}</Text>
                <View style={styles.statusBadge}>
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: user?.isActive ? '#10B981' : colors.muted },
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {user?.isActive ? 'Activo' : 'Inactivo'}
                    </Text>
                </View>
                {user?.subscriptions && user.subscriptions.length > 0 ? (
                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Total mensual</Text>
                        <Text variant="h1">${totalMonthly.toFixed(2)}</Text>
                    </View>
                ) : null}
            </View>

            {Object.keys(groupedSubs).length > 0 ? (
                <View style={styles.subscriptionsSection}>
                    <Text variant="h2" style={styles.sectionTitle}>
                        Mis Suscripciones
                    </Text>
                    {Object.entries(groupedSubs).map(([category, subs]) => (
                        <View key={category} style={styles.categoryGroup}>
                            <View style={styles.categoryHeader}>
                                <Text style={styles.categoryIcon}>
                                    {categoryIcons[category as PlanCategory]}
                                </Text>
                                <Text variant="h3" style={styles.categoryTitle}>
                                    {categoryLabels[category as PlanCategory]}
                                </Text>
                            </View>
                            {(subs as any[]).map((sub) => (
                                <View key={sub.planId} style={styles.planCard}>
                                    <View style={styles.planCardHeader}>
                                        <View style={styles.planCardLeft}>
                                            <Text variant="h3" style={styles.planName}>
                                                {sub.planName}
                                            </Text>
                                            <Text style={styles.planDate}>
                                                Desde {formatDate(sub.startedAt)}
                                            </Text>
                                        </View>
                                        <View style={styles.planCardRight}>
                                            <View style={styles.activeBadge}>
                                                <Text style={styles.activeBadgeText}>✓ Activo</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Button
                                        title="Cancelar"
                                        variant="secondary"
                                        disabled={busy === `plan:${sub.planId}`}
                                        onPress={() => handleCancelPlan(sub.planId)}
                                        style={styles.cancelButton}
                                    />
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text variant="h2" style={styles.emptyTitle}>
                        Sin suscripciones
                    </Text>
                    <Text style={styles.emptyText}>
                        Aún no tienes suscripciones activas. Explora nuestros planes y
                        encuentra el perfecto para ti.
                    </Text>
                    <Button
                        title="Ver Planes"
                        onPress={() => router.push('/plans')}
                        style={styles.emptyButton}
                    />
                </View>
            )}

            <View style={styles.actionsSection}>
                {user?.isActive && Object.keys(groupedSubs).length > 0 && (
                    <Button
                        title="Cancelar todas las suscripciones"
                        variant="secondary"
                        onPress={() => {
                            showConfirm('¿Estás seguro de que deseas cancelar todas tus suscripciones?', async () => {
                                try {
                                    setBusy('all');
                                    await cancel();
                                    setToast({ visible: true, msg: 'Suscripciones canceladas', emoji: '🗑️' });
                                    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 900);
                                } catch {
                                    Alert.alert('Error', 'No se pudieron cancelar las suscripciones');
                                } finally {
                                    setBusy(null);
                                }
                            });
                        }}
                        disabled={busy === 'all'}
                        style={styles.actionButton}
                    />
                )}
                <Button
                    title="Cerrar sesión"
                    variant="secondary"
                    onPress={() => {
                        showConfirm('¿Estás seguro de que deseas cerrar sesión?', async () => {
                            try {
                                setBusy('logout');
                                await logout();
                                setToast({ visible: true, msg: 'Sesión cerrada', emoji: '👋' });
                                setTimeout(() => {
                                    setToast((t) => ({ ...t, visible: false }));
                                    router.replace('/auth/login');
                                }, 700);
                            } catch {
                                Alert.alert('Error', 'No se pudo cerrar sesión');
                            } finally {
                                setBusy(null);
                            }
                        });
                    }}
                    disabled={busy === 'logout'}
                    style={styles.actionButton}
                />
            </View>

            <ActionToast visible={toast.visible} message={toast.msg} emoji={toast.emoji} />
            <ConfirmModal
                visible={confirmState.visible}
                title="Confirmación"
                message={confirmState.message}
                confirmText="Sí"
                cancelText="No"
                onCancel={() => {
                    setConfirmState({ visible: false, message: '', action: undefined });
                }}
                onConfirm={async () => {
                    const action = confirmState.action;
                    setConfirmState({ visible: false, message: '', action: undefined });
                    if (action) {
                        await action();
                    }
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightBlue,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 24,
    },
    name: {
        marginTop: 16,
        marginBottom: 8,
    },
    email: {
        color: colors.muted,
        fontSize: 14,
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
    },
    totalBox: {
        marginTop: 12,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)' as any,
    },
    totalLabel: {
        color: colors.muted,
        marginBottom: 4,
        fontWeight: '600',
    },
    subscriptionsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 16,
        color: colors.text,
    },
    categoryGroup: {
        marginBottom: 20,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    categoryTitle: {
        color: colors.text,
    },
    planCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)' as any,
    },
    planCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    planCardLeft: {
        flex: 1,
    },
    planCardRight: {
        marginLeft: 12,
    },
    planName: {
        marginBottom: 4,
        color: colors.text,
    },
    planDate: {
        fontSize: 12,
        color: colors.muted,
    },
    activeBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadgeText: {
        color: '#065F46',
        fontSize: 11,
        fontWeight: '700',
    },
    cancelButton: {
        marginTop: 0,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        marginBottom: 8,
        color: colors.text,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.muted,
        marginBottom: 24,
        lineHeight: 20,
    },
    emptyButton: {
        minWidth: 200,
    },
    actionsSection: {
        marginTop: 24,
        gap: 12,
    },
    actionButton: {
        marginTop: 0,
    },
});
