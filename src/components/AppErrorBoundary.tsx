/**
 * AppErrorBoundary
 *
 * A React class component that catches unhandled JavaScript errors
 * in the component tree and shows a recovery UI instead of a blank screen.
 *
 * WHY A CLASS COMPONENT?
 * React error boundaries MUST be class components. There is no hook equivalent.
 * This is not a style choice — it's a React requirement.
 *
 * PLACEMENT: Wrap the root <Stack> in _layout.tsx with this component.
 *
 * WHEN IT FIRES: Only for rendering errors (undefined variable, null access, etc.)
 * It does NOT catch: async errors, event handler errors, or network errors.
 * Those are handled by React Query's error states and the Axios interceptor.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message ?? 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In Phase 3 we'll send this to a crash reporting service (e.g. Sentry).
    console.error('[AppErrorBoundary] Unhandled render error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>💥</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            The app encountered an unexpected error. Your data is safe.
          </Text>
          <Pressable style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonLabel}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    gap: Spacing[4],
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing[2],
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.base,
    color: Colors.text.dark.secondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
  button: {
    marginTop: Spacing[4],
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  buttonLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});
