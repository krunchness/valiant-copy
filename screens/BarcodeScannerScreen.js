import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, AppState } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';
import { Dialog, Portal, Paragraph } from 'react-native-paper'; // Import Dialog and other components from react-native-paper

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  const [showScannedRPIEDialog, setShowScannedRPIEDialog] = useState(false);
  const [responseData, setResponseData] = useState(null); // declare the responseData state

  // Create or open your SQLite database instance
  const db = SQLite.openDatabase('rpie_specification.db');

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    if (data != '') {
      setText(data);
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM rpie_specification_sheet',
          [],
          (_, { rows }) => {
            if (rows.length > 0) {
              
              for (let i = 0; i < rows.length; i++) {
                const storedData = rows.item(i).data;

                // Check if storedData is not null before parsing
                if (storedData !== null) {
                  try {
                    const parsedData = JSON.parse(storedData);

                    const foundObject = parsedData.find((obj) => obj.post_title === data);
                    if (foundObject) {
                      // Assuming foundObject is the object you want to set as responseData
                      console.log(foundObject);
                      setResponseData(foundObject);
                      setShowScannedRPIEDialog(true); // Show the dialog when barcode is scanned
                      break;
                    } else {
                      // Handle the case when no match is found
                      console.log('No match found');
                      setResponseData(null); // Set response data to null or handle the case as needed
                    }
                  } catch (parseError) {
                    console.error('Error parsing stored data:', parseError);
                    // Handle the parsing error as needed for each record
                  }
                }
              }
            } else {
              // No data found in the database
              // console.log('No match found');
              // setResponseData(null); // Set response data to null or handle the case as needed
            }
          },
          (tx, error) => {
            console.error('Error executing SQL query:', error);
            setResponseData(null); // Handle the SQL query error as needed
          }
        );
      });
      console.log('Type: ' + type + '\nData: ' + data)
    }

    
  };

  const hideScannedRPIEDialog = () => {
    setShowScannedRPIEDialog(false);
  };

  const handleConfirmScannedRPIE = () => {
    // Handle the case when the user wants to view the scanned RPIE
    // You can navigate to another screen or perform other actions as needed
    navigation.navigate('SingleInventory', { post: responseData });
    setShowScannedRPIEDialog(false);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 600, width: 400 }} />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
      <Portal>
        <Dialog visible={showScannedRPIEDialog} onDismiss={hideScannedRPIEDialog}>
          <Dialog.Title>Confirm Scanned RPIE</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to view this scanned RPIE QR Code?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideScannedRPIEDialog} title={'Cancel?'} />
            <Button onPress={handleConfirmScannedRPIE} title={'View'}></Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});
