/**
 * LoginScreen
 *
 * Features:
 *  - Harlon brand header
 *  - Password field with show/hide toggle
 *  - Real-time Zod validation via react-hook-form
 *  - Loading state on submission
 *  - Error message display
 *  - Dark mode ready
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { useAuth } from '@/hooks/useAuth';

// ─── Validation Schema ────────────────────────────────────────────────────────

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <Text style={styles.logoLetter}>H</Text>
            </View>
            <Text style={styles.brandName}>Harlon</Text>
            <Text style={styles.brandTagline}>Admin Console</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardSubtitle}>
                Sign in to manage your store
              </Text>
            </View>

            {/* API Error */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Admin Password"
                  placeholder="Enter your password"
                  isPassword
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  editable={!isLoading}
                />
              )}
            />

            {/* Submit */}
            <Button
              label="Sign In"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              fullWidth
              size="lg"
            />
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Harlon Admin · v1.0.0
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[8],
    gap: Spacing[8],
  },

  // ─── Brand ──────────────────────────────────────────────────────────────
  brand: {
    alignItems: 'center',
    gap: Spacing[2],
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  logoLetter: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: -1,
  },
  brandName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ─── Card ───────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: Spacing[6],
    gap: Spacing[5],
  },
  cardHeader: {
    gap: Spacing[1],
  },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: FontSize.base,
    color: Colors.text.dark.secondary,
  },

  // ─── Error Banner ────────────────────────────────────────────────────────
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.danger.bg,
    borderWidth: 1,
    borderColor: Colors.danger.muted,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    gap: Spacing[3],
  },
  errorIcon: {
    fontSize: FontSize.base,
    marginTop: 1,
  },
  errorText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.danger.default,
    lineHeight: FontSize.sm * 1.5,
  },

  // ─── Footer ─────────────────────────────────────────────────────────────
  footer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.text.dark.muted,
  },
});
