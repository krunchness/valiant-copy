import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView, TextInput, Dimensions } from 'react-native';
import { DataTable, Button, Dialog, Portal, Paragraph, ActivityIndicator, MD2Colors } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

const sampleData = [
  { id: 1, title: 'Inventory 1' },
  { id: 2, title: 'Inventory 2' },
  { id: 3, title: 'Inventory 3' },
  { id: 4, title: 'Inventory 4' },
  { id: 5, title: 'Inventory 5' },
];

class InventoryListScreen extends React.Component {
  state = {
    searchQuery: '',
    data: sampleData,
    filteredData: sampleData,
    currentPage: 0,
    rowsPerPage: 2,
  };

  searchFilter = (query) => {
    this.setState({ searchQuery: query });
    const filteredData = this.state.data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    this.setState({ filteredData, currentPage: 0 });
  };

  renderActions = (id) => {
    return (
      <View style={styles.actionColumn}>
        <Button
          icon="eye"
          onPress={() => console.log('View pressed', id)}
        />
        <Button
          icon="delete"
          onPress={() => console.log('Delete pressed', id)}
        />
        <Button
          icon="content-duplicate"
          onPress={() => console.log('Duplicate pressed', id)}
        />
        <Button
          icon="pencil"
          onPress={() => console.log('Edit pressed', id)}
        />
      </View>
    );
  };

  render() {
    const { currentPage, rowsPerPage, filteredData } = this.state;
    const fromRow = currentPage * rowsPerPage;
    const toRow = Math.min((currentPage + 1) * rowsPerPage, filteredData.length);

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={this.searchFilter}
          value={this.state.searchQuery}
        />
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>

          {filteredData.slice(fromRow, toRow).map((item) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.title}</DataTable.Cell>
              <DataTable.Cell numeric>{this.renderActions(item.id)}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={currentPage}
            numberOfPages={Math.ceil(filteredData.length / rowsPerPage)}
            onPageChange={(page) => this.setState({ currentPage: page })}
            label={`${fromRow + 1}-${toRow} of ${filteredData.length}`}
          />
        </DataTable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  searchInput: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  actionColumn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default InventoryListScreen;