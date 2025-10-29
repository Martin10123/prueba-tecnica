import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';

type Props = TextProps & { variant?: 'h1' | 'body' };

export default function Text({ children, style, variant = 'body', ...rest }: Props) {
  const variantStyle = variant === 'h1' ? styles.h1 : styles.body;
  return (
    <RNText style={[variantStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '700' },
  body: { fontSize: 16 },
});
