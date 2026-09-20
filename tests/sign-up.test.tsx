import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';

import { mockLink, mockSignUp, renderScreen } from './test-utils';

import SignUpScreen from '../app/(auth)/sign-up';

describe('<SignUpScreen />', () => {
  beforeEach(() => {
    mockSignUp.mockReset();
    mockLink.mockClear();
  });

  it('renders the form fields, submit button, and sign-in link', async () => {
    const { getByPlaceholderText, getByText } = await renderScreen(<SignUpScreen />);

    getByPlaceholderText('Email');
    getByPlaceholderText('Password');
    getByText('Sign up');
    getByText('Already have an account?');
    getByText('Sign in');
  });

  it('links to the sign-in route', async () => {
    await renderScreen(<SignUpScreen />);

    expect(mockLink.mock.calls.some(([props]) => props.href === '/sign-in')).toBe(true);
  });

  it('shows a validation error and does not call signUp when the form is empty', async () => {
    const { getByText, findByText } = await renderScreen(<SignUpScreen />);

    await fireEvent.press(getByText('Sign up'));
    await findByText('Enter your email and password.');

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('shows a validation error when the password is shorter than 6 characters', async () => {
    const { getByPlaceholderText, getByText, findByText } = await renderScreen(<SignUpScreen />);

    await fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    await fireEvent.changeText(getByPlaceholderText('Password'), '12345');
    await fireEvent.press(getByText('Sign up'));
    await findByText('Password must be at least 6 characters.');

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('calls signUp with the trimmed email and password on submit', async () => {
    const { getByPlaceholderText, getByText } = await renderScreen(<SignUpScreen />);
    mockSignUp.mockResolvedValueOnce(undefined);

    await fireEvent.changeText(getByPlaceholderText('Email'), '  user@example.com  ');
    await fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    await fireEvent.press(getByText('Sign up'));

    expect(mockSignUp).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  it('displays the error from the provider when signUp rejects', async () => {
    const { getByPlaceholderText, getByText, findByText } = await renderScreen(<SignUpScreen />);
    mockSignUp.mockRejectedValueOnce(new Error('User already registered'));

    await fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    await fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    await fireEvent.press(getByText('Sign up'));

    await findByText('User already registered');
    expect(mockSignUp).toHaveBeenCalledTimes(1);
  });

  it('shows the confirmation state with a sign-in link when signUp resolves', async () => {
    const { getByPlaceholderText, getByText, findByText, queryByPlaceholderText } =
      await renderScreen(<SignUpScreen />);
    mockSignUp.mockResolvedValueOnce(undefined);

    await fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    await fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    await fireEvent.press(getByText('Sign up'));

    await findByText('Check your email');
    expect(queryByPlaceholderText('Email')).toBeNull();
    expect(mockLink.mock.calls.some(([props]) => props.href === '/sign-in')).toBe(true);
  });
});