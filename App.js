import {
  View,
  Text,
  FlatList,
  SectionList,
  TextInput,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useState, useMemo } from 'react';
import { PRODUCTS } from './data/products';
import ProductCard from './components/ProductCard';

export default function App() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('Semua');
  const [numColumns, setNumColumns] = useState(1);
  const [sortType, setSortType] = useState('default');
  const [isSection, setIsSection] = useState(false); // 🔥 E3 toggle

  const categories = ['Semua', 'Aksesoris', 'Tas', 'Pakaian', 'Sepatu', 'Beauty', 'Makeup'];

  // 🔥 FILTER + SORT (SUDAH DI-FIX pakai useMemo & tidak mutate data asli)
  const finalData = useMemo(() => {
    let filtered = PRODUCTS.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'Semua' || item.category === category;
      return matchSearch && matchCategory;
    });

    let sorted = [...filtered];

    if (sortType === 'lowPrice') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === 'highPrice') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortType === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [search, category, sortType]);

  // 🔥 E3: DATA SECTION
  const sectionData = useMemo(() => {
    return categories
      .filter(cat => cat !== 'Semua')
      .map(cat => ({
        title: cat,
        data: finalData.filter(item => item.category === cat),
      }))
      .filter(section => section.data.length > 0);
  }, [finalData]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerBox}>
        <View>
          <Text style={styles.shopName}>💕 PinkyShop</Text>
          <Text style={styles.subTitle}>Toko Lucu & Aesthetic</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{finalData.length} Produk</Text>
        </View>
      </View>

      {/* SEARCH */}
      <View>
        <TextInput
          placeholder="🔍 Cari barang lucu..."
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />

        {/* 🔥 CLEAR BUTTON */}
        {search !== '' && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setSearch('')}
          >
            <Text>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FILTER KATEGORI */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setCategory(cat)}>
            <Text
              style={[
                styles.categoryBtn,
                category === cat && styles.activeCategory
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MENU */}
      <View style={styles.rowMenu}>
        <TouchableOpacity onPress={() => setSortType('lowPrice')}>
          <Text style={styles.menuBtn}>Harga ⬇️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSortType('highPrice')}>
          <Text style={styles.menuBtn}>Harga ⬆️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSortType('rating')}>
          <Text style={styles.menuBtn}>⭐</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setNumColumns(numColumns === 1 ? 2 : 1)}>
          <Text style={styles.menuBtn}>Grid</Text>
        </TouchableOpacity>

        {/* 🔥 TOGGLE SECTION */}
        <TouchableOpacity onPress={() => setIsSection(!isSection)}>
          <Text style={styles.menuBtn}>Section</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 LIST / SECTION MODE */}
      {isSection ? (
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard item={item} numColumns={1} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>😢 Produk tidak ditemukan</Text>
              <Text style={{ color: '#999' }}>
                Coba kata kunci lain atau kategori berbeda
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <FlatList
          key={numColumns}
          data={finalData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard item={item} numColumns={numColumns} />
          )}
          numColumns={numColumns}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>😢 Produk tidak ditemukan</Text>
              <Text style={{ color: '#999' }}>
                Coba kata kunci lain atau kategori berbeda
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4EC',
  },

  headerBox: {
    backgroundColor: '#FFB6C1',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  subTitle: {
    fontSize: 12,
    color: '#fff',
  },

  badge: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },

  badgeText: {
    color: '#FF69B4',
    fontWeight: 'bold',
  },

  search: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 15,
  },

  clearBtn: {
    position: 'absolute',
    right: 20,
    top: 18,
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  categoryBtn: {
    backgroundColor: '#fff',
    padding: 8,
    margin: 5,
    borderRadius: 20,
  },

  activeCategory: {
    backgroundColor: '#FFB6C1',
  },

  rowMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    flexWrap: 'wrap',
  },

  menuBtn: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
    color: '#FF69B4',
    fontWeight: 'bold',
    margin: 3,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
    color: '#FF1493',
  },

  empty: {
    alignItems: 'center',
    marginTop: 50,
  },

  emptyText: {
    fontSize: 18,
    color: '#FF69B4',
  },
});