import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, BackHandler  } from 'react-native';
import { TextInput, Button, Dialog, Portal, Paragraph, Provider } from 'react-native-paper';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { db } from '../database';

const SingleInventoryScreen = ({ route, navigation }) => {
  const { rpie } = route.params;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Set the title of the screen based on the categoryName parameter
    
    navigation.setOptions({
      title: rpie.rpie_id,
    });
  }, [rpie, navigation]);

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
  
  useFocusEffect(
    React.useCallback(() => {
      fetchData(rpie);
    }, [rpie])
  );

  if (!data) {
    return <View><Text>Loading...</Text></View>;
  }

  

  const EditBtnDialog = (rpie) => {
    // You can use the rpie object here if needed
    setShowEditDialog(true);
  };

  const hideEditDialog = () => {
    setShowEditDialog(false);
  };

  const handleConfirmEditDialog = (rpie) => {
    navigation.navigate('EditSingleInventory', { rpie: rpie });
    setShowEditDialog(false);
  };

  const deleteBtnDialog = () => {
    setShowDeleteDialog(true);
  };

  const hideDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleConfirmDeleteDialog = () => {
    deleteData(data);
    setShowDeleteDialog(false);
  };

  const deleteData = (data) => {
    db.transaction((tx) => {
      // Insert data into the rpie_specifications_trash table
      const currentDate = new Date().toISOString().split('T')[0];
      tx.executeSql(
        'UPDATE rpie_specifications SET modified_date = ?, sync_status = ? WHERE id = ?',
        [currentDate, 'deleted', data.id]
      );
      // tx.executeSql(
      //   'INSERT INTO rpie_specifications_trash (rpie_post_id, rpie_id) VALUES (?, ?)',
      //   [data.rpie_post_id, data.rpie_id],
      //   () => {
      //     // Delete data from the rpie_specifications_information table
      //     tx.executeSql(
      //       'DELETE FROM rpie_specification_information WHERE rpie_specs_id = ?',
      //       [data.id],
      //       () => {
      //         // Delete data from the rpie_specifications table
      //         tx.executeSql(
      //           'DELETE FROM rpie_specifications WHERE id = ?',
      //           [data.id],
      //           () => {
      //             // Navigate back to the previous screen or perform other actions as needed
      //             navigation.goBack();
      //           },
      //           (error) => console.error('Error deleting data from rpie_specifications:', error)
      //         );
      //       },
      //       (error) => console.error('Error deleting data from rpie_specifications_information:', error)
      //     );
      //   },
      //   (error) => console.error('Error inserting data into rpie_specifications_trash:', error)
      // );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="RPIE Index #"
                  value={data.specificationInformation.rpie_index_number}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="RPIE New Index #"
                  value={data.specificationInformation.new_rpie_id}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="RPIE Index # Code"
                  value={data.specificationInformation.rpie_index_number_code}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Facility # - Name"
                  value={data.specificationInformation.facility_num_name}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Room # - Other Loc"
                  value={data.specificationInformation.room_num_loc}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="System"
                  value={data.specificationInformation.system}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Subsystem"
                  value={data.specificationInformation.subsystem}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Assembly Category"
                  value={data.specificationInformation.assembly_category}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Nomenclature"
                  value={data.specificationInformation.nomenclature}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Bar Code #"
                  value={data.specificationInformation.bar_code_number}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Prime Component"
                  value={data.specificationInformation.prime_component}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Group Name"
                  value={data.specificationInformation.group_name}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Group Risk Factor"
                  value={data.specificationInformation.group_risk_factor}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="RPIE Risk Factor"
                  value={data.specificationInformation.rpie_risk_factor}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="RPIE Spare"
                  value={data.specificationInformation.rpie_spare}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Capacity Unit"
                  value={data.specificationInformation.capacity_unit}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Capacity Value"
                  value={data.specificationInformation.capacity_value}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Manufacturer"
                  value={data.specificationInformation.manufacturer}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Model"
                  value={data.specificationInformation.model}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Serial #"
                  value={data.specificationInformation.serial_number}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Catalog #"
                  value={data.specificationInformation.catalog_number}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Life Expectancy"
                  value={data.specificationInformation.life_expectancy}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Contractor"
                  value={data.specificationInformation.contractor}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Contract #"
                  value={data.specificationInformation.contract_number}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Contract Start Date"
                  value={data.specificationInformation.contract_start_date}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Contract End Date"
                  value={data.specificationInformation.contract_end_date}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="PO Number"
                  value={data.specificationInformation.po_number}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Vendor"
                  value={data.specificationInformation.vendor}
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
                  label="Installation Date"
                  value={data.specificationInformation.installation_date}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Warranty Start Date"
                  value={data.specificationInformation.warranty_start_date}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Spec Unit"
                  value={data.specificationInformation.spec_unit}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Spec Value"
                  value={data.specificationInformation.spec_value}
                  editable = {false}
                  style={styles.disabled_text}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Corrections"
                  value={data.specificationInformation.spec_corrections}
                  editable = {false}
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
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <TextInput
                    label="Equipment Hazard Corrections"
                    value={data.specificationInformation.equipment_hazard_corrections}
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TextInput
                    label="Area Supported"
                    value={data.specificationInformation.area_supported}
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TextInput
                    label="Room Supported"
                    value={data.specificationInformation.room_supported}
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TextInput
                    label="Note Date"
                    value={data.specificationInformation.note_date}
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TextInput
                    label="Note Text"
                    value={data.specificationInformation.note_text}
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TextInput
                    label="Status"
                    value={data.specificationInformation.status}
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TextInput
                    label="Status Date"
                    value={data.specificationInformation.status_date}
                    editable = {false}
                    style={styles.disabled_text}
                  />
                </View>
              </View>
              <View style={styles.Btnrow}>
                <View style={styles.buttonContainer}>
                  <Button textColor="#fff" mode="contained" style={styles.Btn} onPress={() => EditBtnDialog(rpie)}>
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
                  <Button textColor="#fff" mode="contained" style={styles.Btn} onPress={deleteBtnDialog}>
                    Delete
                  </Button>
                </View>
                <View style={styles.buttonContainer}>
                  <Button textColor="#fff" mode="contained" style={styles.Btn}>
                    Print
                  </Button>
                </View>
              </View>

              <Portal>
                <Dialog visible={showEditDialog} onDismiss={hideEditDialog}>
                  <Dialog.Title>Confirm to Edit RPIE</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>
                      Are you sure you want to edit this RPIE Specification?
                    </Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={hideEditDialog}>Cancel</Button>
                    <Button onPress={() => handleConfirmEditDialog(rpie)}>Edit</Button>
                  </Dialog.Actions>
                </Dialog>

                <Dialog visible={showDeleteDialog} onDismiss={hideDeleteDialog}>
                  <Dialog.Title>Confirm Delete</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>
                      Are you sure you want to delete this RPIE Specification?
                    </Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={hideDeleteDialog}>Cancel</Button>
                    <Button onPress={handleConfirmDeleteDialog}>Delete</Button>
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