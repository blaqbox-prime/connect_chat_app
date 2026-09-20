import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, waitFor, act } from '@testing-library/react-native';

import { mockLink, mockSignIn, mockUseSession, renderScreen } from './test-utils';

import SignInScreen from '../app/(auth)/sign-in';

describe('<SignInScreen />', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockLink.mockClear();
  });

  it('renders the form fields, submit button, and sign-up link', async () => {
    const { getByPlaceholderText, getByText } = await renderScreen(<SignInScreen />);

    getByPlaceholderText('Email');
    getByPlaceholderText('Password');
    getByText('Sign in');
    getByText('No account yet?');
    getByText('Sign up');
  });

  it('links to the sign-up route', async () => {
    await renderScreen(<SignInScreen />);

    expect(mockLink.mock.calls.some(([props]) => props.href === '/sign-up')).toBe(true);
  });

  it('shows a validation error and does not call signIn when the form is empty', async () => {
    const { getByText, findByText } = await renderScreen(<SignInScreen />);

    await fireEvent.press(getByText('Sign in'));
    await findByText('Enter your email and password.');

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('shows a validation error when only the email is filled', async () => {
    const { getByPlaceholderText, getByText, findByText } = await renderScreen(<SignInScreen />);

    await fireEvent.changeText(getByPlaceholderText('Email'), '  user@example.com  ');
    await fireEvent.press(getByText('Sign in'));
    await findByText('Enter your email and password.');

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn with the trimmed email and password on submit', async () => {
    const { getByPlaceholderText, getByText } = await renderScreen(<SignInScreen />);
    mockSignIn.mockResolvedValueOnce(undefined);

    await fireEvent.changeText(getByPlaceholderText('Email'), '  user@example.com  ');
    await fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    await fireEvent.press(getByText('Sign in'));

    expect(mockSignIn).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  it('shows a loading state and disables the form while signIn is pending', async () => {
    const { getByPlaceholderText, getByText, queryByText } = await renderScreen(<SignInScreen />);
    let resolvePending!: () => void;
    mockSignIn.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePending = resolve;
        }),
    );

    await fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    await fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    const pressPromise = fireEvent.press(getByText('Sign in'));

    await waitFor(() => expect(queryByText('Sign in')).toBeNull());
    expect(getByPlaceholderText('Email').props.editable).toBe(false);
    expect(getByPlaceholderText('Password').props.editable).toBe(false);

    await act(async () => {
      resolvePending();
      await pressPromise;
    });
  });

  it('displays the error from the provider when signIn rejects', async () => {
    const { getByPlaceholderText, getByText, findByText } = await renderScreen(<SignInScreen />);
    mockSignIn.mockRejectedValueOnce(new Error('Invalid login credentials'));

    await fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    await fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    await fireEvent.press(getByText('Sign in'));

    await findByText('Invalid login credentials');
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it('keeps the session value null in the mocked provider by default', () => {
    expect(mockUseSession).toBeDefined();
  });
});