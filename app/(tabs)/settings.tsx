import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSession } from '../../lib/auth-context';

export default function SettingsScreen() {
  const { session, signOut } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.account}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{session?.user.email}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#D70015" />
        ) : (
          <Text style={styles.buttonText}>Sign out</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    gap: 24,
  },
  account: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
  },
  button: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD1D6',
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#D70015',
    fontSize: 16,
    fontWeight: '600',
  },
});