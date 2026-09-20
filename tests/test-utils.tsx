import { jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import type { ReactElement, ReactNode } from 'react';

export const mockSignIn = jest.fn<(email: string, password: string) => Promise<void>>();
export const mockSignUp = jest.fn<(email: string, password: string) => Promise<void>>();
export const mockSignOut = jest.fn<() => Promise<void>>();

type SessionValue = {
  isLoading: boolean;
  session: null;
  signIn: typeof mockSignIn;
  signUp: typeof mockSignUp;
  signOut: typeof mockSignOut;
};

export const mockUseSession = jest.fn<() => SessionValue>();

const baseSessionValue: SessionValue = {
  isLoading: false,
  session: null,
  signIn: mockSignIn,
  signUp: mockSignUp,
  signOut: mockSignOut,
};

mockUseSession.mockReturnValue(baseSessionValue);

jest.mock('../lib/auth-context', () => ({
  useSession: () => mockUseSession(),
}));

export const mockLink = jest.fn(
  ({ children, href }: { children: ReactNode; href?: string }) => <Text>{children}</Text>,
);

jest.mock('expo-router', () => ({
  Link: mockLink,
}));

export function renderScreen(component: ReactElement) {
  return render(component);
}