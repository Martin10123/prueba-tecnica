import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../ui/atoms/Text';

export default function HomeScreen() {
  return (
    <View style={styles.wrapper}>
      <Text variant="h1">Hola Mundo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
