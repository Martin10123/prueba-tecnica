import { Appearance } from 'react-native';

const light = {
  lightBlue: "#E9F1FA",
  brightBlue: "#00ABE4",
  white: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#D0E2F2",
};

const dark = {
  lightBlue: "#0B1220", // app background dark
  brightBlue: "#22C3FF",
  white: "#0F172A", // surfaces
  text: "#E5E7EB",
  muted: "#9CA3AF",
  border: "#1F2A44",
};

let scheme: 'light' | 'dark' = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
let override: 'system' | 'light' | 'dark' = 'system';

Appearance.addChangeListener(({ colorScheme }) => {
  if (override === 'system') {
    scheme = colorScheme === 'dark' ? 'dark' : 'light';
  }
});

export const colors = new Proxy(light, {
  get: (_target, prop: keyof typeof light) => {
    const effective = override === 'system' ? scheme : (override as 'light' | 'dark');
    const theme = effective === 'dark' ? dark : light;
    return (theme as any)[prop];
  },
});

export function setThemeMode(mode: 'system' | 'light' | 'dark') {
  override = mode;
  if (override !== 'system') {
    scheme = override;
  } else {
    scheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
}

export function getThemeMode(): 'system' | 'light' | 'dark' {
  return override;
}
