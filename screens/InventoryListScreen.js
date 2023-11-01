import React, { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import axios from 'axios';
import { db, createRpieSpecsTable, createRpieSpecsInfoTable } from '../database';

const InventoryListScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/?per_page=2000&page=1');
        const items = JSON.parse(response.data);

        // setData(items);
        await saveDataToDatabase(items);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    createRpieSpecsTable();
    createRpieSpecsInfoTable();
    fetchData();
    
  }, []);

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
                  'INSERT INTO rpie_specifications (rpie_post_id, rpie_id, created_date, modified_date, status) VALUES (?, ?, ?, ?, ?)',
                  [item.ID, item.post_title, item.post_date, item.post_modified, 'complete'],
                  (_, { insertId }) => {
                    // Insert data into rpie_specification_information table
                    tx.executeSql(
                      'INSERT INTO rpie_specification_information (rpie_specs_id, installation, facility_num_name, room_num_loc, system, subsystem, assembly_category, nomenclature, rpie_index_number, rpie_index_number_code, bar_code_number, prime_component, group_name, group_risk_factor, rpie_risk_factor, rpie_spare, capacity_unit, capacity_value, manufacturer, model, serial_number, catalog_number, life_expectancy, contractor, contract_number, contract_start_date, contract_end_date, po_number, vendor, installation_date, warranty_start_date, spec_unit, spec_value, spec_corrections, equipment_hazard, equipment_hazard_corrections, area_supported, room_supported, note_date, note_text, status, status_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
                        item.acf.status ? item.acf.status : '',
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
                  'UPDATE rpie_specifications SET rpie_post_id = ?, created_date = ?, modified_date = ?, status = ? WHERE rpie_id = ?',
                  [item.ID, item.post_date, item.post_modified, 'complete', item.post_title]
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
                    item.acf.status ? item.acf.status : '',
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

  const fetchDataFromDatabase = async () => {
    try {
      const results = [];

      await db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM rpie_specifications',
          [],
          (_, { rows }) => {
            console.log(rows.length);
            console.log('test');
            for (let i = 0; i < rows.length; i++) {
              
              results.push(rows.item(i));
            }
          },
          (error) => console.error('Error fetching data from database:', error)
        );
      });
      setData(results);
    } catch (error) {
      console.error('Failed to fetch data from database:', error);
    }
  };

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
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