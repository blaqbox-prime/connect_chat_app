import { StyleSheet, Text, View } from 'react-native';

export default function StatusesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No statuses yet</Text>
      <Text style={styles.message}>Statuses you and your contacts post will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  message: {
    marginTop: 4,
    fontSize: 14,
    color: '#6E6E73',
    textAlign: 'center',
  },
});