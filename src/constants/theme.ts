import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { StyleSheet } from 'react-native';

// Renk Paleti - Tasarim_Export.html referansı
export const colors = {
  primary: '#FF7F50',        // Coral Orange (ana vurgu)
  primaryLight: '#FFA07A',   // Light Coral
  primaryDark: '#E56B3E',    // Dark Coral
  secondary: '#1F2937',      // Koyu gri
  background: '#F3F4F6',     // Açık gri arka plan
  surface: '#FFFFFF',        // Beyaz yüzey
  white: '#FFFFFF',
  black: '#000000',

  // Durum renkleri
  success: '#10B981',        // Yeşil (artış/başarı)
  successLight: '#D1FAE5',   // Açık yeşil arka plan
  danger: '#EF4444',         // Kırmızı (düşüş/hata)
  dangerLight: '#FEE2E2',    // Açık kırmızı arka plan
  warning: '#F59E0B',        // Sarı (uyarı)
  warningLight: '#FEF3C7',   // Açık sarı arka plan
  info: '#3B82F6',           // Mavi (bilgi)
  infoLight: '#DBEAFE',      // Açık mavi arka plan

  // Gri tonları
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Gradient için
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
  },

  // Chart renkleri
  chart: {
    blue: '#3B82F6',
    pink: '#EC4899',
    green: '#10B981',
    orange: '#FF7F50',
    purple: '#8B5CF6',
  },
};

// Tipografi
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    light: 'Inter-Light',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 8,
  },
  orange: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

// React Native Paper tema konfigürasyonu
export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.orange[100],
    secondary: colors.secondary,
    secondaryContainer: colors.gray[100],
    background: colors.background,
    surface: colors.surface,
    error: colors.danger,
    errorContainer: colors.dangerLight,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onBackground: colors.gray[900],
    onSurface: colors.gray[800],
    outline: colors.gray[200],
    surfaceVariant: colors.gray[50],
  },
  roundness: borderRadius.lg,
};

// Ortak stiller
export const commonStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['3xl'],
    padding: spacing.lg,
    ...shadows.lg,
  },
  cardSmall: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing.base,
    ...shadows.md,
  },

  // Flex
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Typography
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[700],
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: '400',
    color: colors.gray[600],
  },
  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[400],
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Button
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    ...shadows.orange,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },

  // Badge
  badgeSuccess: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeDanger: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWarning: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeInfo: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Icon container
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerOrange: {
    backgroundColor: colors.orange[50],
  },
  iconContainerRed: {
    backgroundColor: colors.dangerLight,
  },
  iconContainerGreen: {
    backgroundColor: colors.successLight,
  },
  iconContainerBlue: {
    backgroundColor: colors.infoLight,
  },
});

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  paperTheme,
  commonStyles,
};
