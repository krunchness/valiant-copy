import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, AppState } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';
import { Dialog, Portal, Paragraph } from 'react-native-paper'; // Import Dialog and other components from react-native-paper

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScannedRPIEDialog, setShowScannedRPIEDialog] = useState(false);
  const [responseData, setResponseData] = useState(null); // declare the responseData state

  
  // Create or open your SQLite database instance
  const db = SQLite.openDatabase('rpie_specification.db');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    console.log('test scanned');
    if (data != '') {
      // Query your SQLite database
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
    } else {
      console.log('No match found');
    }
  };

  const hideScannedRPIEDialog = () => {
    setShowScannedRPIEDialog(false);
  };

  const handleConfirmScannedRPIE = () => {
    // Handle the case when the user wants to view the scanned RPIE
    // You can navigate to another screen or perform other actions as needed
    setShowScannedRPIEDialog(false);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        setScanned(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button title={'Allow Camera Permission'} onPress={() => requestPermissionsAsync()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.barcodeBox}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      
      <Portal>
        <Dialog visible={showScannedRPIEDialog} onDismiss={hideScannedRPIEDialog}>
          <Dialog.Title>Confirm Scanned RPIE</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to view this scanned RPIE QR Code?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideScannedRPIEDialog}>Cancel</Button>
            <Button onPress={handleConfirmScannedRPIE}>View</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeBox: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
});
