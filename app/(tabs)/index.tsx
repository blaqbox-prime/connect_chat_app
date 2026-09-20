import { FlatList, StyleSheet, Text, View } from 'react-native';

const conversations: { id: string; name: string; lastMessage: string }[] = [];

export default function ChatsScreen() {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={conversations}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No chats yet</Text>
          <Text style={styles.emptyMessage}>Your conversations will show up here.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.preview} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  emptyMessage: {
    marginTop: 4,
    fontSize: 14,
    color: '#6E6E73',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0077E6',
  },
  rowBody: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  preview: {
    marginTop: 2,
    fontSize: 14,
    color: '#8E8E93',
  },
});