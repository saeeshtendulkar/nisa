import React, { useState, useEffect } from 'react';
import { 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  ListRenderItem, 
  SafeAreaView, 
  Platform, 
  StatusBar 
} from 'react-native';

interface SearchResult {
  _id: string;
  name: string;
}

export default function TabOneScreen() {
  const [query, setQuery] = useState<string>(''); // State for search query
  const [results, setResults] = useState<SearchResult[]>([]); // State for search results

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    try {
      const response = await fetch(`http://<your-server-ip>:3000/search?query=${searchQuery}`);
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching autocomplete results:', error);
    }
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    fetchSuggestions(text);
  };

  const renderItem: ListRenderItem<SearchResult> = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => alert(`You selected: ${item.name}`)}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search..."
          value={query}
          onChangeText={handleChangeText}
        />
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          style={styles.resultsList}
          keyboardShouldPersistTaps="handled" // Ensures keyboard dismiss behavior
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Avoid overlap on Android
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8, // Add spacing between search box and results
  },
  resultsList: {
    marginTop: 8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});