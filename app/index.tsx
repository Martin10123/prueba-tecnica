import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Text from '../src/ui/atoms/Text';

export default function Index() {
  return (
    <View style={styles.wrapper}>
      <Text variant="h1" style={styles.title}>Membresías</Text>
      <Button title="Ver planes" onPress={() => router.push('/plans')} />
      <Button title="Perfil" onPress={() => router.push('/profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 16 },
  title: { marginBottom: 12 },
});
