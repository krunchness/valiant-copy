import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

class SingleInventoryScreen extends React.Component {
  componentDidUpdate(prevProps) {
    // Check if the 'isFocused' prop has changed

    if (this.props.isFocused !== prevProps.isFocused) {
      if (this.props.isFocused) {
        // Screen is focused, reset scanned state or perform any other actions
        // For example, you can setScanned(false) here if 'setScanned' is available in your component.
        // Alternatively, you can perform any other side effect you need.

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      }
    }
  }

  componentDidMount() {
    console.log('test');
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    console.log('unmount');
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    // const { navigation } = this.props;
    // navigation.navigate('Inventory List');
    return true; // Return true to indicate that the back action has been handled
  };


  render() {
    const { route } = this.props;
    const { post } = route.params;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Installation"
                value={post.acf.installation}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Facility # - Name"
                value={post.acf.facility_num_name}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Room # - Other Loc"
                value={post.acf.room_num_loc}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="System"
                value={post.acf.system}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Subsystem"
                value={post.acf.subsystem}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Assembly Category"
                value={post.acf.subsystem}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Nomenclature"
                value={post.acf.nomenclature}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="RPIE Index #"
                value={post.acf.rpie_index_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="RPIE Index # Code"
                value={post.acf.rpie_index_number_code}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Bar Code #"
                value={post.acf.bar_code_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Prime Component"
                value={post.acf.prime_component}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Group Name"
                value={post.acf.group_name}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Group Risk Factor"
                value={post.acf.group_risk_factor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="RPIE Risk Factor"
                value={post.acf.rpie_risk_factor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="RPIE Spare"
                value={post.acf.rpie_spare}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Capacity Unit"
                value={post.acf.capacity_unit}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Capacity Value"
                value={post.acf.capacity_value}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Manufacturer"
                value={post.acf.manufacturer}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Model"
                value={post.acf.model}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Serial #"
                value={post.acf.serial_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Catalog #"
                value={post.acf.catalog_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Life Expectancy"
                value={post.acf.life_expectancy}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Contractor"
                value={post.acf.contractor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Contract #"
                value={post.acf.contract_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Contract Start Date"
                value={post.acf.contract_start_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Contract End Date"
                value={post.acf.contract_end_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="PO Number"
                value={post.acf.po_number}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Vendor"
                value={post.acf.vendor}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Installation Date"
                value={post.acf.installation_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Warranty Start Date"
                value={post.acf.warranty_start_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Spec Unit"
                value={post.acf.spec_unit}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Spec Value"
                value={post.acf.spec_value}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Corrections"
                value={post.acf.spec_corrections}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Equipment Hazard"
                value={post.acf.equipment_hazard}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="Area Supported"
                value={post.acf.area_supported}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Equipment Hazard Corrections"
                value={post.acf.equipment_hazard_corrections}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <TextInput
                label="Note Date"
                value={post.acf.note_date}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
            <View style={styles.column}>
              <TextInput
                label="Note Text"
                value={post.acf.note_text}
                editable = {false}
                style={styles.disabled_text}
              />
            </View>
          </View>
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
  }
});

export default SingleInventoryScreen;
