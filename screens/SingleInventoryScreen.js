import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, BackHandler  } from 'react-native';
import { TextInput, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { db } from '../database';

const SingleInventoryScreen = ({ route, navigation }) => {
  const { rpie } = route.params;
  const [data, setData] = useState(null);

  useEffect(() => {
    // Set the title of the screen based on the categoryName parameter
    navigation.setOptions({
      title: rpie.rpie_id,
    });
  }, [rpie, navigation]);

  useEffect(() => {

    const fetchData = async (rpie) => {
      try {
        await db.transaction((tx) => {

          tx.executeSql(
            'SELECT * FROM rpie_specifications WHERE id = ?',
            [rpie.id],
            (_, { rows }) => {
              let results = rows.item(0);

              tx.executeSql(
                'SELECT * FROM rpie_specification_information WHERE rpie_specs_id = ?',
                [results.id],
                (_, { rows }) => {

                  results.specificationInformation = rows.item(0);
                  setData(results);
                },
                (error) => console.error('Error fetching data from rpie_specification_information:', error)
              );
            },
            (error) => console.error('Error fetching data from rpie_specifications:', error)
          );
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData(rpie);
  }, [rpie]);

  if (!data) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="rpie_index_number"
                value={data.specificationInformation.rpie_index_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="rpie_index_number_code"
                value={data.specificationInformation.rpie_index_number_code}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Installation"
                value={data.specificationInformation.installation}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="area_supported"
                value={data.specificationInformation.area_supported}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="assembly_category"
                value={data.specificationInformation.assembly_category}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="bar_code_number"
                value={data.specificationInformation.bar_code_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="capacity_unit"
                value={data.specificationInformation.capacity_unit}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="capacity_value"
                value={data.specificationInformation.capacity_value}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="catalog_number"
                value={data.specificationInformation.catalog_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="contract_end_date"
                value={data.specificationInformation.contract_end_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="contract_number"
                value={data.specificationInformation.contract_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="contract_start_date"
                value={data.specificationInformation.contract_start_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="contractor"
                value={data.specificationInformation.contractor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="equipment_hazard"
                value={data.specificationInformation.equipment_hazard}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="equipment_hazard_corrections"
                value={data.specificationInformation.equipment_hazard_corrections}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="facility_num_name"
                value={data.specificationInformation.facility_num_name}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="group_name"
                value={data.specificationInformation.group_name}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="group_risk_factor"
                value={data.specificationInformation.group_risk_factor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="installation"
                value={data.specificationInformation.installation}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="installation_date"
                value={data.specificationInformation.installation_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="life_expectancy"
                value={data.specificationInformation.life_expectancy}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="manufacturer"
                value={data.specificationInformation.manufacturer}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="model"
                value={data.specificationInformation.model}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="nomenclature"
                value={data.specificationInformation.nomenclature}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="note_date"
                value={data.specificationInformation.note_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="note_text"
                value={data.specificationInformation.note_text}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="po_number"
                value={data.specificationInformation.po_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="prime_component"
                value={data.specificationInformation.prime_component}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="room_num_loc"
                value={data.specificationInformation.room_num_loc}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="room_supported"
                value={data.specificationInformation.room_supported}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="rpie_risk_factor"
                value={data.specificationInformation.rpie_risk_factor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="rpie_spare"
                value={data.specificationInformation.rpie_spare}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="serial_number"
                value={data.specificationInformation.serial_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="spec_corrections"
                value={data.specificationInformation.spec_corrections}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="spec_unit"
                value={data.specificationInformation.spec_unit}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="spec_value"
                value={data.specificationInformation.spec_value}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="status"
                value={data.specificationInformation.status}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="status_date"
                value={data.specificationInformation.status_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="subsystem"
                value={data.specificationInformation.subsystem}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="system"
                value={data.specificationInformation.system}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="vendor"
                value={data.specificationInformation.vendor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="warranty_start_date"
                value={data.specificationInformation.warranty_start_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.Btnrow}>
            <View style={styles.buttonContainer}>
              <Button textColor="#fff" mode="contained" style={styles.Btn} >
                Edit RPIE
              </Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button textColor="#fff" mode="contained" style={styles.Btn} >
                Duplicate
              </Button>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.buttonContainer}>
              <Button textColor="#fff" mode="contained" style={styles.Btn} >
                Delete
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  Btnrow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 30
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  disabled_text: {
    backgroundColor: "#fff",
    color: "blue"
  },
  dropdown: {
    backgroundColor: "#EDE4FF",
    height: 50, // Set the height as needed
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  Btn: {
    backgroundColor: '#372160',
    marginBottom: 10
  },
  buttonContainer: {
    flex: 1,
    marginRight: 8,
  },
});


export default SingleInventoryScreen;