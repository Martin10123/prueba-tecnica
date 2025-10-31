import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { fetchPlans } from '../../src/core/plans/service';
import { Plan, PlanCategory } from '../../src/core/types';
import { useUser } from '../../src/core/user/UserProvider';
import { listSubscriptions } from '../../src/core/subscriptions/service';
import { Button, Text } from '../../src/ui/atoms';
import { colors } from '../../src/ui/atoms/colors';
import ActionToast from '../../src/ui/atoms/ActionToast';
import Avatar from '../../src/ui/atoms/Avatar';
import ConfirmModal from '../../src/ui/atoms/ConfirmModal';

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

const formatCOP = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

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
    const [inactiveSubs, setInactiveSubs] = useState<any[]>([]);

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

    useEffect(() => {
        (async () => {
            if (!user?.id) return;
            try {
                const all = await listSubscriptions(user.id, false);
                const inact = all.filter(s => s.active === false);
                setInactiveSubs(inact);
            } catch { setInactiveSubs([]); }
        })();
    }, [user?.id]);

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
            run();
            return;
        }
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

    const styles = React.useMemo(() => createStyles(), []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.topBar}>
                <Button title="← Volver" variant="secondary" onPress={() => router.back()} />
            </View>
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
                        <Text variant="h1">{formatCOP(totalMonthly)}</Text>
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

            {inactiveSubs.length > 0 && (
                <View style={{ marginTop: 16 }}>
                    <Text variant="h2" style={styles.sectionTitle}>Historial</Text>
                    {inactiveSubs.map((sub) => (
                        <View key={`inactive-${sub.planId}-${sub.startedAt}`} style={styles.planCard}>
                            <View style={styles.planCardHeader}>
                                <View style={styles.planCardLeft}>
                                    <Text variant="h3" style={styles.planName}>{sub.planName}</Text>
                                    <Text style={styles.planDate}>Desde {formatDate(sub.startedAt)}</Text>
                                </View>
                                <View style={styles.planCardRight}>
                                    <View style={[styles.activeBadge, { backgroundColor: '#F3F4F6' }]}>
                                        <Text style={[styles.activeBadgeText, { color: '#374151' }]}>Inactivo</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
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

function createStyles() {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.lightBlue },
        content: { padding: 20, paddingBottom: 100 },
        topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
        header: { alignItems: 'center', paddingVertical: 24, marginBottom: 24 },
        name: { marginTop: 16, marginBottom: 8 },
        email: { color: colors.muted, fontSize: 14, marginBottom: 12 },
        statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
        statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
        statusText: { fontSize: 12, fontWeight: '600', color: colors.text },
        totalBox: { marginTop: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' as any },
        totalLabel: { color: colors.muted, marginBottom: 4, fontWeight: '600' },
        subscriptionsSection: { marginBottom: 24 },
        sectionTitle: { marginBottom: 16, color: colors.text },
        categoryGroup: { marginBottom: 20 },
        categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
        categoryIcon: { fontSize: 24, marginRight: 8 },
        categoryTitle: { color: colors.text },
        planCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' as any },
        planCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
        planCardLeft: { flex: 1 },
        planCardRight: { marginLeft: 12 },
        planName: { marginBottom: 4, color: colors.text },
        planDate: { fontSize: 12, color: colors.muted },
        activeBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
        activeBadgeText: { color: '#065F46', fontSize: 11, fontWeight: '700' },
        cancelButton: { marginTop: 0 },
        emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
        emptyIcon: { fontSize: 64, marginBottom: 16 },
        emptyTitle: { marginBottom: 8, color: colors.text },
        emptyText: { textAlign: 'center', color: colors.muted, marginBottom: 24, lineHeight: 20 },
        emptyButton: { minWidth: 200 },
        actionsSection: { marginTop: 24, gap: 12 },
        actionButton: { marginTop: 0 },
    });
}

