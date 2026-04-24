import { View, Text, StyleSheet } from 'react-native';

export default function ProductCard({ item, numColumns }) {
  const isGrid = numColumns === 2;

  return (
    <View style={[styles.card, isGrid ? styles.grid : styles.list]}>
      
      <Text style={styles.image}>{item.image}</Text>

      <View style={isGrid ? null : styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.category}>{item.category}</Text>

        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.price}>Rp {item.price}</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF0F5',
    margin: 8,
    padding: 12,
    borderRadius: 15,
    elevation: 3,
  },

  // 🔹 MODE LIST (1 kolom)
  list: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 🔹 MODE GRID (2 kolom)
  grid: {
    flex: 1,
    alignItems: 'center',
  },

  image: {
    fontSize: 40,
    marginRight: 10,
  },

  info: {
    flex: 1,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FF1493',
  },

  category: {
    fontSize: 12,
    color: '#888',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rating: {
    fontSize: 12,
    color: '#FFA500',
  },

  price: {
    fontSize: 13,
    color: '#FF69B4',
    fontWeight: 'bold',
  },
});