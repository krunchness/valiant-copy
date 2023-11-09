import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, BackHandler } from 'react-native';
import { TextInput, Button, Dialog, Portal, Paragraph, Provider } from 'react-native-paper';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../database';

const EditSingleInventoryScreen = ({ route, navigation }) => {
  const { rpie } = route.params;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [data, setData] = useState(null);
  const [oldRpie, setOldRpie] = useState('');


  useEffect(() => {
    // Set the title of the screen based on the categoryName parameter
    navigation.setOptions({
      title: 'Edit RPIE : ' + rpie.rpie_id,
    });


  }, [rpie, navigation]);

  useFocusEffect(
    React.useCallback(() => {
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
                    console.log('test');
                    setData(results);
                    setOldRpie(rows.item(0).new_rpie_id);
                    console.log(oldRpie);
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
    }, [rpie])
  );

  if (!data) {
    return <View><Text>Loading...</Text></View>;
  }

  const handleTextChange = (field, text) => {
    if (field === 'status') {

      if (text !== 'none') {
        setData({
          ...data,
          specificationInformation: {
            ...data.specificationInformation,
            [field]: text,
            status_date: new Date().toISOString().split('T')[0],
          },
        });
      }else{
        setData({
          ...data,
          specificationInformation: {
            ...data.specificationInformation,
            [field]: text,
            status_date: "",
          },
        });
      }
    }else if(field === 'new_rpie_id'){
      setData({
        ...data,
        specificationInformation: {
          ...data.specificationInformation,
          [field]: text,
          rpie_index_number: oldRpie,
        },
      });
    }else {
      setData({
        ...data,
        specificationInformation: {
          ...data.specificationInformation,
          [field]: text,
        },
      });
    }
  };

  const EditBtnDialog = (rpie) => {
    // You can use the rpie object here if needed
    setShowEditDialog(true);
  };

  const hideEditDialog = () => {
    setShowEditDialog(false);
  };

  const CancelBtn = (rpie) => {
    navigation.navigate('SingleInventory', { rpie: rpie });
  };

  const handleConfirmEditDialog = (rpie) => {
      try {
        const updatePromises = [];
        db.transaction((tx) => {
          const currentDate = new Date().toISOString().split('T')[0];
          updatePromises.push(new Promise((resolve, reject) => {
            tx.executeSql(
              'UPDATE rpie_specifications SET sync_status = ?, rpie_id = ? WHERE id = ?',
              ['local-only' , data.specificationInformation.new_rpie_id, rpie.id],
              resolve,
              reject
            );
          })); 

          updatePromises.push(new Promise((resolve, reject) => {
            tx.executeSql(
              'UPDATE rpie_specification_information SET installation = ?, facility_num_name = ?, room_num_loc = ?, system = ?, subsystem = ?, assembly_category = ?, nomenclature = ?, rpie_index_number = ?, new_rpie_id = ?, rpie_index_number_code = ?, bar_code_number = ?, prime_component = ?, group_name = ?, group_risk_factor = ?, rpie_risk_factor = ?, rpie_spare = ?, capacity_unit = ?, capacity_value = ?, manufacturer = ?, model = ?, serial_number = ?, catalog_number = ?, life_expectancy = ?, contractor = ?, contract_number = ?, contract_start_date = ?, contract_end_date = ?, po_number = ?, vendor = ?, installation_date = ?, warranty_start_date = ?, spec_unit = ?, spec_value = ?, spec_corrections = ?, equipment_hazard = ?, equipment_hazard_corrections = ?, area_supported = ?, room_supported = ?, note_date = ?, note_text = ?, status = ?, status_date = ? WHERE rpie_specs_id = ?',
              [
                data.specificationInformation.installation,
                data.specificationInformation.facility_num_name,
                data.specificationInformation.room_num_loc,
                data.specificationInformation.system,
                data.specificationInformation.subsystem,
                data.specificationInformation.assembly_category,
                data.specificationInformation.nomenclature,
                data.specificationInformation.rpie_index_number,
                data.specificationInformation.new_rpie_id,
                data.specificationInformation.rpie_index_number_code,
                data.specificationInformation.bar_code_number,
                data.specificationInformation.prime_component,
                data.specificationInformation.group_name,
                data.specificationInformation.group_risk_factor,
                data.specificationInformation.rpie_risk_factor,
                data.specificationInformation.rpie_spare,
                data.specificationInformation.capacity_unit,
                data.specificationInformation.capacity_value,
                data.specificationInformation.manufacturer,
                data.specificationInformation.model,
                data.specificationInformation.serial_number,
                data.specificationInformation.catalog_number,
                data.specificationInformation.life_expectancy,
                data.specificationInformation.contractor,
                data.specificationInformation.contract_number,
                data.specificationInformation.contract_start_date,
                data.specificationInformation.contract_end_date,
                data.specificationInformation.po_number,
                data.specificationInformation.vendor,
                data.specificationInformation.installation_date,
                data.specificationInformation.warranty_start_date,
                data.specificationInformation.spec_unit,
                data.specificationInformation.spec_value,
                data.specificationInformation.spec_corrections,
                data.specificationInformation.equipment_hazard,
                data.specificationInformation.equipment_hazard_corrections,
                data.specificationInformation.area_supported,
                data.specificationInformation.room_supported,
                data.specificationInformation.note_date,
                data.specificationInformation.note_text,
                data.specificationInformation.status,
                data.specificationInformation.status_date,
                rpie.id
              ],
              resolve,
              reject
            );
          }));

        });

        Promise.all(updatePromises)
          .then(() => {
            console.log('Data updated successfully');
            navigation.navigate('SingleInventory', { rpie: rpie });
          })
          .catch((error) => {
            console.error('Error updating data:', error);
          });

      } catch (error) {
        console.error('Failed to update data:', error);
      }
      setShowEditDialog(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="RPIE Index # (Disabled for edit)"
              value={data.specificationInformation.rpie_index_number}
              editable={false}
              style={styles.field_disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="RPIE New Index #"
              value={data.specificationInformation.new_rpie_id}
              onChangeText={(text) => handleTextChange('new_rpie_id', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="RPIE Index # Code"
              value={data.specificationInformation.rpie_index_number_code}
              onChangeText={(text) => handleTextChange('rpie_index_number_code', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Facility # - Name"
              value={data.specificationInformation.facility_num_name}
              onChangeText={(text) => handleTextChange('facility_num_name', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Room # - Other Loc"
              value={data.specificationInformation.room_num_loc}
              onChangeText={(text) => handleTextChange('room_num_loc', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="System"
              value={data.specificationInformation.system}
              onChangeText={(text) => handleTextChange('system', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Subsystem"
              value={data.specificationInformation.subsystem}
              onChangeText={(text) => handleTextChange('subsystem', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Assembly Category"
              value={data.specificationInformation.assembly_category}
              onChangeText={(text) => handleTextChange('assembly_category', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Nomenclature"
              value={data.specificationInformation.nomenclature}
              onChangeText={(text) => handleTextChange('nomenclature', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Bar Code #"
              value={data.specificationInformation.bar_code_number}
              onChangeText={(text) => handleTextChange('bar_code_number', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Prime Component"
              value={data.specificationInformation.prime_component}
              onChangeText={(text) => handleTextChange('prime_component', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Group Name"
              value={data.specificationInformation.group_name}
              onChangeText={(text) => handleTextChange('group_name', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Group Risk Factor"
              value={data.specificationInformation.group_risk_factor}
              onChangeText={(text) => handleTextChange('group_risk_factor', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="RPIE Risk Factor"
              value={data.specificationInformation.rpie_risk_factor}
              onChangeText={(text) => handleTextChange('rpie_risk_factor', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="RPIE Spare"
              value={data.specificationInformation.rpie_spare}
              onChangeText={(text) => handleTextChange('rpie_spare', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Capacity Unit"
              value={data.specificationInformation.capacity_unit}
              onChangeText={(text) => handleTextChange('capacity_unit', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Capacity Value"
              value={data.specificationInformation.capacity_value}
              onChangeText={(text) => handleTextChange('capacity_value', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Manufacturer"
              value={data.specificationInformation.manufacturer}
              onChangeText={(text) => handleTextChange('manufacturer', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Model"
              value={data.specificationInformation.model}
              onChangeText={(text) => handleTextChange('model', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Serial #"
              value={data.specificationInformation.serial_number}
              onChangeText={(text) => handleTextChange('serial_number', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Catalog #"
              value={data.specificationInformation.catalog_number}
              onChangeText={(text) => handleTextChange('catalog_number', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Life Expectancy"
              value={data.specificationInformation.life_expectancy}
              onChangeText={(text) => handleTextChange('life_expectancy', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Contractor"
              value={data.specificationInformation.contractor}
              onChangeText={(text) => handleTextChange('contractor', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Contract #"
              value={data.specificationInformation.contract_number}
              onChangeText={(text) => handleTextChange('contract_number', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Contract Start Date"
              value={data.specificationInformation.contract_start_date}
              onChangeText={(text) => handleTextChange('contract_start_date', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Contract End Date"
              value={data.specificationInformation.contract_end_date}
              onChangeText={(text) => handleTextChange('contract_end_date', text)}
              editable={true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="PO Number"
              value={data.specificationInformation.po_number}
              onChangeText={(text) => handleTextChange('po_number', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Vendor"
              value={data.specificationInformation.vendor}
              onChangeText={(text) => handleTextChange('vendor', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Installation"
              value={data.specificationInformation.installation}
              onChangeText={(text) => handleTextChange('installation', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Installation Date"
              value={data.specificationInformation.installation_date}
              onChangeText={(text) => handleTextChange('installation_date', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Warranty Start Date"
              value={data.specificationInformation.warranty_start_date}
              onChangeText={(text) => handleTextChange('warranty_start_date', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Spec Unit"
              value={data.specificationInformation.spec_unit}
              onChangeText={(text) => handleTextChange('spec_unit', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Spec Value"
              value={data.specificationInformation.spec_value}
              onChangeText={(text) => handleTextChange('spec_value', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              label="Corrections"
              value={data.specificationInformation.spec_corrections}
              onChangeText={(text) => handleTextChange('spec_corrections', text)}
              editable = {true}
              style={styles.disabled_text}
            />
          </View>
        </View>
        <Provider>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Equipment Hazard"
                value={data.specificationInformation.equipment_hazard}
                onChangeText={(text) => handleTextChange('equipment_hazard', text)}
                editable = {true}
                style={styles.disabled_text}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Equipment Hazard Corrections"
                value={data.specificationInformation.equipment_hazard_corrections}
                onChangeText={(text) => handleTextChange('equipment_hazard_corrections', text)}
                editable = {true}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Area Supported"
                value={data.specificationInformation.area_supported}
                onChangeText={(text) => handleTextChange('area_supported', text)}
                editable = {true}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Room Supported"
                value={data.specificationInformation.room_supported}
                onChangeText={(text) => handleTextChange('room_supported', text)}
                editable = {true}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Note Date"
                value={data.specificationInformation.note_date}
                onChangeText={(text) => handleTextChange('note_date', text)}
                editable = {true}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Note Text"
                value={data.specificationInformation.note_text}
                onChangeText={(text) => handleTextChange('note_text', text)}
                editable = {true}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Picker
                label="Status"
                selectedValue={data.specificationInformation.status}
                onValueChange={(text) => handleTextChange('status', text)}
                style={styles.dropdown}
              >
                <Picker.Item label="-- Select Current Status --" value="none" />
                <Picker.Item label="Inventory Complete" value="inventory-complete" />
                <Picker.Item label="DMLSS Entry Complete" value="dmlss-entry-complete" />
                <Picker.Item label="QC Complete " value="qc-complete" />
                <Picker.Item label="Final DMLSS Complete" value="final-dmlss-complete" />
              </Picker>
            </View>
          </View>
          <View style={styles.Btnrow}>
            <View style={styles.buttonContainer}>
              <Button textColor="#fff" mode="contained" style={styles.Btn} onPress={() => EditBtnDialog(rpie)} >
                Update
              </Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button textColor="#fff" mode="contained" style={styles.Btn} onPress={() => CancelBtn(rpie)} >
                Cancel
              </Button>
            </View>
          </View>

          <Portal>
            <Dialog visible={showEditDialog} onDismiss={hideEditDialog}>
              <Dialog.Title>Confirm to Edit RPIE</Dialog.Title>
              <Dialog.Content>
                <Paragraph>
                  Are you sure you want to update this RPIE Specification?
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideEditDialog}>Cancel</Button>
                <Button onPress={() => handleConfirmEditDialog(rpie)}>Update</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </Provider>
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
  field_disabled_text: {
    backgroundColor: "#EDE4FF",
    color: "#fff"
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


export default EditSingleInventoryScreen;
