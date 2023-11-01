import React, { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import axios from 'axios';
import { db, createTable } from '../database';

const InventoryListScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.example.com/data');
        const items = response.data;
        setData(items);
        setLoading(false);
        await saveDataToDatabase(items);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    createTable();
    fetchData();
  }, []);

  const saveDataToDatabase = async (items) => {
    db.transaction((tx) => {
      for (const item of items) {
        tx.executeSql(
          'INSERT INTO rpie_specifications (rpie_id, created_date, status) VALUES (?, ?, ?)',
          [item.rpie_id, item.created_date, item.status]
        );
      }
    });
  };

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>ID: {item.id}</Text>
          <Text>RPIE ID: {item.rpie_id}</Text>
          <Text>Created Date: {item.created_date}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
    />
  );
};

export default InventoryListScreen;