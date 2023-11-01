import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, BackHandler  } from 'react-native';
import { TextInput, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

class EditSingleInventoryScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      installation: '',
      facility_num_name: '',
      room_num_loc: '',
      system: '',
      subsystem: '',
      assembly_category: '',
      nomenclature: '',
      rpie_index_number: '',
      bar_code_number: '',
      prime_component: '',
      group_name: '',
      group_risk_factor: '',
      rpie_risk_factor: '',
      rpie_spare: '',
      capacity_unit: '',
      capacity_value: '',
      manufacturer: '',
      model: '',
      serial_number: '',
      catalog_number: '',
      life_expectancy:'',
      contractor: '',
      contract_number: '',
      contract_start_date: '',
      contract_end_date: '',
      po_number: '',
      vendor: '',
      installation_date: '',
      warranty_start_date: '',
      spec_unit: '',
      spec_value: '',
      spec_corrections: '',
      equipment_hazard: '',
      equipment_hazard_corrections: '',
      area_supported: '',
      note_date: '',
      note_text: '',
      rpie_index_number_code: '',
      showMessageDialog: false, // Initialize the dialog state
      showConfirmationDialog: false,
      status: '',
    };

    this.saveChanges = this.saveChanges.bind(this);
  }

  handleBackPress = () => {
    const { navigation } = this.props;
    navigation.navigate('Inventory List');
    return true; // Return true to indicate that the back action has been handled
  };

  handleStatusChange = (value) => {
    this.setState({ status: value });
  };


  componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    const { route } = this.props;
    const { post } = route.params;
    
    // Update state with the post.acf values
    this.setState({
      post: post,
      installation: post.acf.installation,
      facility_num_name: post.acf.facility_num_name,
      room_num_loc: post.acf.room_num_loc,
      system: post.acf.system,
      subsystem: post.acf.subsystem,
      assembly_category: post.acf.assembly_category,
      nomenclature: post.acf.nomenclature,
      rpie_index_number: post.acf.rpie_index_number,
      bar_code_number: post.acf.bar_code_number,
      prime_component: post.acf.prime_component,
      group_name: post.acf.group_name,
      group_risk_factor: post.acf.group_risk_factor,
      rpie_risk_factor: post.acf.rpie_risk_factor,
      rpie_spare: post.acf.rpie_spare,
      capacity_unit: post.acf.capacity_unit,
      capacity_value: post.acf.capacity_value,
      manufacturer: post.acf.manufacturer,
      model: post.acf.model,
      serial_number: post.acf.serial_number,
      catalog_number: post.acf.catalog_number,
      life_expectancy: post.acf.life_expectancy,
      contractor: post.acf.contractor,
      contract_number: post.acf.contract_number,
      contract_start_date: post.acf.contract_start_date,
      contract_end_date: post.acf.contract_end_date,
      po_number: post.acf.po_number,
      vendor: post.acf.vendor,
      installation_date: post.acf.installation_date,
      warranty_start_date: post.acf.warranty_start_date,
      spec_unit: post.acf.spec_unit,
      spec_value: post.acf.spec_value,
      spec_corrections: post.acf.spec_corrections,
      equipment_hazard: post.acf.equipment_hazard,
      equipment_hazard_corrections: post.acf.equipment_hazard_corrections,
      area_supported: post.acf.area_supported,
      note_date: post.acf.note_date,
      note_text: post.acf.note_text,
      rpie_index_number_code: post.acf.rpie_index_number_code,
      status: post.acf.status
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the post prop has changed
    if (prevProps.route.params.post !== this.props.route.params.post) {
      const { post } = this.props.route.params;
      this.setState({
        post: post,
        installation: post.acf.installation,
        facility_num_name: post.acf.facility_num_name,
        room_num_loc: post.acf.room_num_loc,
        system: post.acf.system,
        subsystem: post.acf.subsystem,
        assembly_category: post.acf.assembly_category,
        nomenclature: post.acf.nomenclature,
        rpie_index_number: post.acf.rpie_index_number,
        bar_code_number: post.acf.bar_code_number,
        prime_component: post.acf.prime_component,
        group_name: post.acf.group_name,
        group_risk_factor: post.acf.group_risk_factor,
        rpie_risk_factor: post.acf.rpie_risk_factor,
        rpie_spare: post.acf.rpie_spare,
        capacity_unit: post.acf.capacity_unit,
        capacity_value: post.acf.capacity_value,
        manufacturer: post.acf.manufacturer,
        model: post.acf.model,
        serial_number: post.acf.serial_number,
        catalog_number: post.acf.catalog_number,
        life_expectancy: post.acf.life_expectancy,
        contractor: post.acf.contractor,
        contract_number: post.acf.contract_number,
        contract_start_date: post.acf.contract_start_date,
        contract_end_date: post.acf.contract_end_date,
        po_number: post.acf.po_number,
        vendor: post.acf.vendor,
        installation_date: post.acf.installation_date,
        warranty_start_date: post.acf.warranty_start_date,
        spec_unit: post.acf.spec_unit,
        spec_value: post.acf.spec_value,
        spec_corrections: post.acf.spec_corrections,
        equipment_hazard: post.acf.equipment_hazard,
        equipment_hazard_corrections: post.acf.equipment_hazard_corrections,
        area_supported: post.acf.area_supported,
        note_date: post.acf.note_date,
        note_text: post.acf.note_text,
        rpie_index_number_code: post.acf.rpie_index_number_code,
        status: post.acf.status
      });
    }
  }

  // Function to save changes
  saveChanges = async () => {
    
    
    // Implement your logic to save changes here
    // Once changes are saved, you can call showMessageDialog() to show the success dialog
    this.showConfirmationDialog();
  };

  // Function to show the message dialog
  showMessageDialog = () => {
    this.setState({ showMessageDialog: true });
  };

  showConfirmationDialog = () => {
    this.setState({ showConfirmationDialog: true });
  };

  // Function to hide the message dialog
  hideMessageDialog = () => {
    this.setState({ showMessageDialog: false });
  };

  hideConfirmationDialog = () => {
    this.setState({ showConfirmationDialog: false });
  };

  confirmSaveChanges = (postId) => {
    // Hide the confirmation dialog
    this.hideConfirmationDialog();

    const updatedData = {
      data: {
        installation: this.state.installation,
        facility_num_name: this.state.facility_num_name,
        room_num_loc: this.state.room_num_loc,
        system: this.state.system,
        subsystem: this.state.subsystem,
        assembly_category: this.state.assembly_category,
        nomenclature: this.state.nomenclature,
        rpie_index_number: this.state.rpie_index_number,
        bar_code_number: this.state.bar_code_number,
        prime_component: this.state.prime_component,
        group_name: this.state.group_name,
        group_risk_factor: this.state.group_risk_factor,
        rpie_risk_factor: this.state.rpie_risk_factor,
        rpie_spare: this.state.rpie_spare,
        capacity_unit: this.state.capacity_unit,
        capacity_value: this.state.capacity_value,
        manufacturer: this.state.manufacturer,
        model: this.state.model,
        serial_number: this.state.serial_number,
        catalog_number: this.state.catalog_number,
        life_expectancy: this.state.life_expectancy,
        contractor: this.state.contractor,
        contract_number: this.state.contract_number,
        contract_start_date: this.state.contract_start_date,
        contract_end_date: this.state.contract_end_date,
        po_number: this.state.po_number,
        vendor: this.state.vendor,
        installation_date: this.state.installation_date,
        warranty_start_date: this.state.warranty_start_date,
        spec_unit: this.state.spec_unit,
        spec_value: this.state.spec_value,
        spec_corrections: this.state.spec_corrections,
        equipment_hazard: this.state.equipment_hazard,
        equipment_hazard_corrections: this.state.equipment_hazard_corrections,
        area_supported: this.state.area_supported,
        note_date: this.state.note_date,
        note_text: this.state.note_text,
        rpie_index_number_code: this.state.rpie_index_number_code,
        status: this.state.status
      }

    };


    const sendPostRequest = async () => {
      try {
        // Send a POST request using axios
        const response = await axios.post(`https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/update/${postId}`, updatedData, {
          headers: {
            'Content-Type': 'application/json',
            // You might need to include authentication headers if required
          },
        });
        console.log(response.data);
        if (response.status === 200) {
          // Data successfully saved
          this.showMessageDialog();
        } else {
          // Handle error scenario
          console.error('Error saving data:', response.status, response.statusText);
          // You can display an error message or take other appropriate actions
        }
      } catch (error) {
        console.error('Error sending POST request:', error);
        // Handle error scenario
        // You can display an error message or take other appropriate actions
      }
    };

    sendPostRequest();
    // console.log(updatedData);

    // Implement your logic to save changes here
    // Once changes are saved, you can call showMessageDialog() to show the success dialog
  };



  render() {
    const {
      installation,
      facility_num_name,
      room_num_loc,
      system,
      subsystem,
      assembly_category,
      nomenclature,
      rpie_index_number,
      bar_code_number,
      prime_component,
      group_name,
      group_risk_factor,
      rpie_risk_factor,
      rpie_spare,
      capacity_unit,
      capacity_value,
      manufacturer,
      model,
      serial_number,
      catalog_number,
      life_expectancy,
      contractor,
      contract_number,
      contract_start_date,
      contract_end_date,
      po_number,
      vendor,
      installation_date,
      warranty_start_date,
      spec_unit,
      spec_value,
      spec_corrections,
      equipment_hazard,
      equipment_hazard_corrections,
      area_supported,
      note_date,
      note_text,
      rpie_index_number_code,
      status,
      post
    } = this.state;

    // console.log(post);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Installation"
                value={installation}
                editable = {true}
                onChangeText={value => this.setState({ installation: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Facility # - Name"
                value={facility_num_name}
                editable = {true}
                onChangeText={value => this.setState({ facility_num_name: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Room # - Other Loc"
                value={room_num_loc}
                editable = {true}
                onChangeText={value => this.setState({ room_num_loc: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="System"
                value={system}
                editable = {true}
                onChangeText={value => this.setState({ system: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Subsystem"
                value={subsystem}
                editable = {true}
                onChangeText={value => this.setState({ subsystem: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Assembly Category"
                value={assembly_category}
                editable = {true}
                onChangeText={value => this.setState({ assembly_category: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Nomenclature"
                value={nomenclature}
                editable = {true}
                onChangeText={value => this.setState({ nomenclature: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="RPIE Index #"
                value={rpie_index_number}
                editable = {true}
                onChangeText={value => this.setState({ rpie_index_number: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="RPIE Index # Code"
                value={rpie_index_number_code}
                editable = {true}
                onChangeText={value => this.setState({ rpie_index_number_code: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Bar Code #"
                value={bar_code_number}
                editable = {true}
                onChangeText={value => this.setState({ bar_code_number: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Prime Component"
                value={prime_component}
                editable = {true}
                onChangeText={value => this.setState({ prime_component: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Group Name"
                value={group_name}
                editable = {true}
                onChangeText={value => this.setState({ group_name: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Group Risk Factor"
                value={group_risk_factor}
                editable = {true}
                onChangeText={value => this.setState({ group_risk_factor: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="RPIE Risk Factor"
                value={rpie_risk_factor}
                editable = {true}
                onChangeText={value => this.setState({ rpie_risk_factor: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="RPIE Spare"
                value={rpie_spare}
                editable = {true}
                onChangeText={value => this.setState({ rpie_spare: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Capacity Unit"
                value={capacity_unit}
                editable = {true}
                onChangeText={value => this.setState({ capacity_unit: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Capacity Value"
                value={capacity_value}
                editable = {true}
                onChangeText={value => this.setState({ capacity_value: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Manufacturer"
                value={manufacturer}
                editable = {true}
                onChangeText={value => this.setState({ manufacturer: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Model"
                value={model}
                editable = {true}
                onChangeText={value => this.setState({ model: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Serial #"
                value={serial_number}
                editable = {true}
                onChangeText={value => this.setState({ serial_number: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Catalog #"
                value={catalog_number}
                editable = {true}
                onChangeText={value => this.setState({ catalog_number: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Life Expectancy"
                value={life_expectancy}
                editable = {true}
                onChangeText={value => this.setState({ life_expectancy: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Contractor"
                value={contractor}
                editable = {true}
                onChangeText={value => this.setState({ contractor: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Contract #"
                value={contract_number}
                editable = {true}
                onChangeText={value => this.setState({ contract_number: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Contract Start Date"
                value={contract_start_date}
                editable = {true}
                onChangeText={value => this.setState({ contract_start_date: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Contract End Date"
                value={contract_end_date}
                editable = {true}
                onChangeText={value => this.setState({ contract_end_date: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="PO Number"
                value={po_number}
                editable = {true}
                onChangeText={value => this.setState({ po_number: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Vendor"
                value={vendor}
                editable = {true}
                onChangeText={value => this.setState({ vendor: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Installation Date"
                value={installation_date}
                editable = {true}
                onChangeText={value => this.setState({ installation_date: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Warranty Start Date"
                value={warranty_start_date}
                editable = {true}
                onChangeText={value => this.setState({ warranty_start_date: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Spec Unit"
                value={spec_unit}
                editable = {true}
                onChangeText={value => this.setState({ spec_unit: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Spec Value"
                value={spec_value}
                editable = {true}
                onChangeText={value => this.setState({ spec_value: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Corrections"
                value={spec_corrections}
                editable = {true}
                onChangeText={value => this.setState({ spec_corrections: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Equipment Hazard"
                value={equipment_hazard}
                editable = {true}
                onChangeText={value => this.setState({ equipment_hazard: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Area Supported"
                value={area_supported}
                editable = {true}
                onChangeText={value => this.setState({ area_supported: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Equipment Hazard Corrections"
                value={equipment_hazard_corrections}
                editable = {true}
                onChangeText={value => this.setState({ equipment_hazard_corrections: value })}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Note Date"
                value={note_date}
                editable = {true}
                onChangeText={value => this.setState({ note_date: value })}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Note Text"
                value={note_text}
                editable = {true}
                onChangeText={value => this.setState({ note_text: value })}
                style={styles.disabled_text}
              />
            </View>
            
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Picker
                label="Status"
                selectedValue={this.state.status}
                onValueChange={(value) => this.setState({ status: value })}
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
          <View style={styles.row}>
            
            <View style={styles.column}>
              <Button onPress={this.saveChanges}>Save Changes</Button>
            </View>
          </View>

          <Portal>
            <Dialog visible={this.state.showMessageDialog} onDismiss={this.hideMessageDialog}>
              <Dialog.Title>Update Message</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Changes have been saved successfully.</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={this.hideMessageDialog}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Portal>
            <Dialog visible={this.state.showConfirmationDialog} onDismiss={this.hideConfirmationDialog}>
              <Dialog.Title>Confirm Update</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Are you sure you want to save the changes?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={this.hideConfirmationDialog}>Cancel</Button>
                <Button onPress={() => this.confirmSaveChanges(post.ID)}>Confirm</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  disabled_text: {
    backgroundColor: "#EDE4FF",
    color: "blue"
  },
  dropdown: {
    backgroundColor: "#EDE4FF",
    height: 50, // Set the height as needed
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
});

export default EditSingleInventoryScreen;
