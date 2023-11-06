import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator  } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import axios from 'axios';
import { db, createRpieSpecsTable, createRpieSpecsInfoTable, createDeletedRpieSpecsTable } from '../database';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const RpieChangesListScreen = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [timer, setTimer] = useState(null);

  const itemsPerPage = 10;

  const fetchData = async (page = 1, perPage = 2000) => {
    try {
      setLoading(true);

      const wordpressApiUrl = `https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/?per_page=${perPage}&page=${page}`;
      const response = await axios.get(wordpressApiUrl);
      const items = response.data;

      return items; 
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const pushChangesToServer = async () => {
  
    try {
      await db.transaction(async (tx) => {
        let results = [];
        setLoading(true);

        tx.executeSql(
          'SELECT * FROM rpie_specifications WHERE sync_status NOT LIKE ?',
          ['synced'],
          (_, { rows }) => {
            // Create a counter to keep track of processed rows
            let counter = 0;

            // Define a function to fetch specification information
            const fetchSpecificationInformation = (row, callback) => {
              tx.executeSql(
                'SELECT * FROM rpie_specification_information WHERE rpie_specs_id = ?',
                [row.id],
                (_, { rows }) => {
                  row.specificationInformation = rows.item(0);
                  callback();
                },
                (error) => console.error('Error fetching data from rpie_specification_information:', error)
              );
            };

            // Define a function to process the next row
            const processNextRow = () => {
              if (counter < rows.length) {
                // Fetch the current row
                const row = rows.item(counter);

                // Push the row to the results array
                results.push(row);

                // Fetch specification information for the current row
                fetchSpecificationInformation(row, () => {
                  // Increment the counter
                  counter++;

                  // Process the next row
                  processNextRow();
                });
              } else {
                // All rows have been processed, send data to server
                
                sendToServer();
              }
            };

            // Define a function to send data to the server
            const sendToServer = async () => {
              try {
                  console.log(JSON.stringify(results));
                const response = await axios.post(
                  'https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/update/',
                  { data: JSON.stringify(results) },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                );

                if (response.status === 200) {
                  deleteData(results);
                } else {
                  // Handle error scenario
                  console.error('Error saving data:', response.status, response.statusText);
                }
              } catch (error) {
                // Handle network error or other unexpected errors
                console.error('Failed to send data to server:', error);
                // You can display an error message or take other appropriate actions
              }
            };

            // Start processing the first row
            processNextRow();
          },
          (error) => console.error('Error fetching data from rpie_specifications:', error)
        );
      });

      setLoading(false);
      // Load data from the database and update the UI
      await fetchDataFromDatabase();
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const deleteData = (results) => {
    db.transaction((tx) => {
      for (const rpie of results) {
        console.log(rpie.sync_status);
        if (rpie.sync_status == 'local-only') {
          const currentDate = new Date().toISOString().split('T')[0];
          tx.executeSql(
            'UPDATE rpie_specifications SET modified_date = ?, sync_status = ? WHERE id = ?',
            [currentDate, 'synced', rpie.id],
            () => {
              console.log('Data Updated successfully for rpie.id:', rpie.id);
              // update data from the rpie_specifications table
              fetchDataFromDatabase();
            },
            (error) => console.error('Error updating data from rpie_specifications:', error)
          );
        }else{
          tx.executeSql(
            'DELETE FROM rpie_specification_information WHERE rpie_specs_id = ?',
            [rpie.id],
            () => {
              // Delete data from the rpie_specifications table
              tx.executeSql(
                'DELETE FROM rpie_specifications WHERE id = ?',
                [rpie.id],
                () => {
                  console.log('Data deleted successfully for rpie.id:', rpie.id);
                  // Load data from the database and update the UI
                  fetchDataFromDatabase();
                },
                (error) => console.error('Error deleting data from rpie_specifications:', error)
              );
            },
            (error) => console.error('Error deleting data from rpie_specifications_information:', error)
          );
        }
      }
    });
  };


  useFocusEffect(
    React.useCallback(() => {
      // Fetch data from the WordPress REST API
      createRpieSpecsTable();
      createRpieSpecsInfoTable();
      createDeletedRpieSpecsTable();
      
      fetchDataFromDatabase();
    }, [])
  );

  useEffect(() => {

    createRpieSpecsTable();
    createRpieSpecsInfoTable();
    createDeletedRpieSpecsTable();

    fetchDataFromDatabase();
    
  }, []);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer); // Clear the timer if it exists
    }
    setTimer(setTimeout(() => fetchDataFromDatabase(searchQuery), 500)); // Set a new timer with a delay of 500ms
    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [searchQuery, page]); // Add `page` as a dependency

  useEffect(() => {
    setData([]); // Clear the data state before fetching new data
    fetchDataFromDatabase(searchQuery);
  }, [page]);

  const saveDataToDatabase = async (items) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        for (const item of items) {
          // Check if a record with the same rpie_id already exists
          tx.executeSql(
            'SELECT * FROM rpie_specifications WHERE rpie_id = ?',
            [item.post_title],
            (_, { rows }) => {
            
              if (rows.length === 0) {
                // Record with the same rpie_id does not exist, insert a new record
                tx.executeSql(
                  'INSERT INTO rpie_specifications (rpie_post_id, rpie_id, created_date, modified_date, newly_created, sync_status, status) VALUES (?, ?, ?, ?, ?, ? , ?)',
                  [item.ID, item.post_title, item.post_date, item.post_modified, 'false', 'synced', item.acf.status.value ? item.acf.status.value : ''],
                  (_, { insertId }) => {
                    // Insert data into rpie_specification_information table
                    tx.executeSql(
                      'INSERT INTO rpie_specification_information (rpie_specs_id, installation, facility_num_name, room_num_loc, system, subsystem, assembly_category, nomenclature, rpie_index_number, rpie_index_number_code, bar_code_number, prime_component, group_name, group_risk_factor, rpie_risk_factor, rpie_spare, capacity_unit, capacity_value, manufacturer, model, serial_number, catalog_number, life_expectancy, contractor, contract_number, contract_start_date, contract_end_date, po_number, vendor, installation_date, warranty_start_date, spec_unit, spec_value, spec_corrections, equipment_hazard, equipment_hazard_corrections, area_supported, room_supported, note_date, note_text, status, status_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      [
                        insertId, 
                        item.acf.installation ? item.acf.installation : '', 
                        item.acf.facility_num_name ? item.acf.facility_num_name : '',
                        item.acf.room_num_loc ? item.acf.room_num_loc : '',
                        item.acf.system ? item.acf.system : '',
                        item.acf.subsystem ? item.acf.subsystem : '',
                        item.acf.assembly_category ? item.acf.assembly_category : '', 
                        item.acf.nomenclature ? item.acf.nomenclature : '', 
                        item.acf.rpie_index_number ? item.acf.rpie_index_number : '', 
                        item.acf.rpie_index_number_code ? item.acf.rpie_index_number_code : '',
                        item.acf.bar_code_number ? item.acf.bar_code_number : '',
                        item.acf.prime_component ? item.acf.prime_component : '',
                        item.acf.group_name ? item.acf.group_name : '',
                        item.acf.group_risk_factor ? item.acf.group_risk_factor : '',
                        item.acf.rpie_risk_factor ? item.acf.rpie_risk_factor : '',
                        item.acf.rpie_spare ? item.acf.rpie_spare : '',
                        item.acf.capacity_unit ? item.acf.capacity_unit : '',
                        item.acf.capacity_value ? item.acf.capacity_value : '',
                        item.acf.manufacturer ? item.acf.manufacturer : '',
                        item.acf.model ? item.acf.model : '',
                        item.acf.serial_number ? item.acf.serial_number : '',
                        item.acf.catalog_number ? item.acf.catalog_number : '',
                        item.acf.life_expectancy ? item.acf.life_expectancy : '',
                        item.acf.contractor ? item.acf.contractor : '',
                        item.acf.contract_number ? item.acf.contract_number : '',
                        item.acf.contract_start_date ? item.acf.contract_start_date : '',
                        item.acf.contract_end_date ? item.acf.contract_end_date : '',
                        item.acf.po_number ? item.acf.po_number : '',
                        item.acf.vendor ? item.acf.vendor : '',
                        item.acf.installation_date ? item.acf.installation_date : '',
                        item.acf.warranty_start_date ? item.acf.warranty_start_date : '',
                        item.acf.spec_unit ? item.acf.spec_unit : '',
                        item.acf.spec_value ? item.acf.spec_value : '',
                        item.acf.spec_corrections ? item.acf.spec_corrections : '',
                        item.acf.equipment_hazard ? item.acf.equipment_hazard : '',
                        item.acf.equipment_hazard_corrections ? item.acf.equipment_hazard_corrections : '',
                        item.acf.area_supported ? item.acf.area_supported : '',
                        item.acf.room_supported ? item.acf.room_supported : '',
                        item.acf.note_date ? item.acf.note_date : '',
                        item.acf.note_text ? item.acf.note_text : '',
                        item.acf.status.value ? item.acf.status.value : '',
                        item.acf.status_date ? item.acf.status_date : '',
                        // Additional values for missing columns, if needed
                      ]
                    );
                  }
                );
              } else {
                // Record with the same rpie_id already exists, update the existing record
                const existingSpecId = rows.item(0).id;


                tx.executeSql(
                  'UPDATE rpie_specifications SET rpie_post_id = ?, created_date = ?, modified_date = ?, sync_status = ?, status = ? WHERE rpie_id = ?',
                  [item.ID, item.post_date, item.post_modified, 'synced' , item.acf.status.value ? item.acf.status.value : '', item.post_title]
                );

                
                tx.executeSql(
                  'UPDATE rpie_specification_information SET installation = ?, facility_num_name = ?, room_num_loc = ?, system = ?, subsystem = ?, assembly_category = ?, nomenclature = ?, rpie_index_number = ?, rpie_index_number_code = ?, bar_code_number = ?, prime_component = ?, group_name = ?, group_risk_factor = ?, rpie_risk_factor = ?, rpie_spare = ?, capacity_unit = ?, capacity_value = ?, manufacturer = ?, model = ?, serial_number = ?, catalog_number = ?, life_expectancy = ?, contractor = ?, contract_number = ?, contract_start_date = ?, contract_end_date = ?, po_number = ?, vendor = ?, installation_date = ?, warranty_start_date = ?, spec_unit = ?, spec_value = ?, spec_corrections = ?, equipment_hazard = ?, equipment_hazard_corrections = ?, area_supported = ?, room_supported = ?, note_date = ?, note_text = ?, status = ?, status_date = ? WHERE rpie_specs_id = ?',
                  [
                    item.acf.installation ? item.acf.installation : '', 
                    item.acf.facility_num_name ? item.acf.facility_num_name : '',
                    item.acf.room_num_loc ? item.acf.room_num_loc : '',
                    item.acf.system ? item.acf.system : '',
                    item.acf.subsystem ? item.acf.subsystem : '',
                    item.acf.assembly_category ? item.acf.assembly_category : '', 
                    item.acf.nomenclature ? item.acf.nomenclature : '', 
                    item.acf.rpie_index_number ? item.acf.rpie_index_number : '', 
                    item.acf.rpie_index_number_code ? item.acf.rpie_index_number_code : '',
                    item.acf.bar_code_number ? item.acf.bar_code_number : '',
                    item.acf.prime_component ? item.acf.prime_component : '',
                    item.acf.group_name ? item.acf.group_name : '',
                    item.acf.group_risk_factor ? item.acf.group_risk_factor : '',
                    item.acf.rpie_risk_factor ? item.acf.rpie_risk_factor : '',
                    item.acf.rpie_spare ? item.acf.rpie_spare : '',
                    item.acf.capacity_unit ? item.acf.capacity_unit : '',
                    item.acf.capacity_value ? item.acf.capacity_value : '',
                    item.acf.manufacturer ? item.acf.manufacturer : '',
                    item.acf.model ? item.acf.model : '',
                    item.acf.serial_number ? item.acf.serial_number : '',
                    item.acf.catalog_number ? item.acf.catalog_number : '',
                    item.acf.life_expectancy ? item.acf.life_expectancy : '',
                    item.acf.contractor ? item.acf.contractor : '',
                    item.acf.contract_number ? item.acf.contract_number : '',
                    item.acf.contract_start_date ? item.acf.contract_start_date : '',
                    item.acf.contract_end_date ? item.acf.contract_end_date : '',
                    item.acf.po_number ? item.acf.po_number : '',
                    item.acf.vendor ? item.acf.vendor : '',
                    item.acf.installation_date ? item.acf.installation_date : '',
                    item.acf.warranty_start_date ? item.acf.warranty_start_date : '',
                    item.acf.spec_unit ? item.acf.spec_unit : '',
                    item.acf.spec_value ? item.acf.spec_value : '',
                    item.acf.spec_corrections ? item.acf.spec_corrections : '',
                    item.acf.equipment_hazard ? item.acf.equipment_hazard : '',
                    item.acf.equipment_hazard_corrections ? item.acf.equipment_hazard_corrections : '',
                    item.acf.area_supported ? item.acf.area_supported : '',
                    item.acf.room_supported ? item.acf.room_supported : '',
                    item.acf.note_date ? item.acf.note_date : '',
                    item.acf.note_text ? item.acf.note_text : '',
                    item.acf.status.value ? item.acf.status.value : '',
                    item.acf.status_date ? item.acf.status_date : '',
                    existingSpecId
                  ]
                );
              }
            },
            (_, error) => {
              reject(error);
            }
          );
        }
      }, reject, () => {
        fetchDataFromDatabase().then(resolve).catch(reject);
      });
    });
  };

  const fetchDataFromDatabase = async (query) => {
    try {
      const results = [];
      const offset = page * itemsPerPage;

      await db.transaction((tx) => {
        tx.executeSql(
          'SELECT COUNT(*) FROM rpie_specifications WHERE rpie_id LIKE ? AND sync_status NOT LIKE ?',
          [query ? `%${query}%` : '%', 'synced'],
          (_, { rows }) => {
            const totalRows = rows.item(0)['COUNT(*)'];
            console.log(totalRows);
            setTotalPages(Math.ceil(totalRows / itemsPerPage));
          },
          (error) => console.error('Error counting rows from database:', error)
        );

        tx.executeSql(
          'SELECT * FROM rpie_specifications WHERE rpie_id LIKE ? AND sync_status NOT LIKE ? LIMIT ? OFFSET ?',
          [query ? `%${query}%` : '%', 'synced', itemsPerPage, offset],
          (_, { rows }) => {
            for (let i = 0; i < rows.length; i++) {
              results.push(rows.item(i));
            }

            setLoading(false);
            setData(results);

          },
          (error) => console.error('Error fetching data from database:', error)
        );
      });

    } catch (error) {
      console.error('Failed to fetch data from database:', error);
    }
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    setPage(0);
    setData([]); // Clear the data state before fetching new data
    // fetchDataFromDatabase(query);
  };

  const handleRowPress = (rpie) => {
    navigation.navigate('SingleInventory', { rpie });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 20 }}>Syncing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by RPIE ID"
        value={searchQuery}
        onChangeText={handleSearchQueryChange}
      />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>RPIE ID</DataTable.Title>
          <DataTable.Title>Change Status</DataTable.Title>
        </DataTable.Header>

        {data.map((rpie) => (
          <TouchableOpacity key={rpie.id} onPress={() => handleRowPress(rpie)}>
            <DataTable.Row>
              <DataTable.Cell>{rpie.rpie_id}</DataTable.Cell>
              <DataTable.Cell>
                {rpie.sync_status === "local-only" ? "Device Changes Only" : 
                 rpie.sync_status === "deleted" ? "Deleted on Device Only" : 
                 rpie.sync_status}
              </DataTable.Cell>
            </DataTable.Row>
          </TouchableOpacity>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          label={`${page + 1} of ${totalPages}`}
        />
      </DataTable>

      <Button style={{ backgroundColor: "#372160", width: '50%' }} textColor="#fff" onPress={() => pushChangesToServer()}
      > Sync Changes to Server </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default RpieChangesListScreen;