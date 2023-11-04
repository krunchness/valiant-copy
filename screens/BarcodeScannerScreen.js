import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, AppState } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';
import { Dialog, Portal, Paragraph, Button } from 'react-native-paper'; // Import Dialog and other components from react-native-paper
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { db } from '../database';

export default function BarcodeScannerScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  const [showScannedRPIEDialog, setShowScannedRPIEDialog] = useState(false);
  const [responseData, setResponseData] = useState(null); // declare the responseData state

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  useFocusEffect(
    React.useCallback(() => {
      // Fetch data from the WordPress REST API
      askForCameraPermission();      
      setScanned(false);
    }, [])
  );

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    if (data != '') {
      setText(data);
      let match = '';
      if (data.toLowerCase().includes('rpie')) {
        console.log('The string contains RPIE');
        const pattern = /RPIE ID:\s+(\S+)/;
         match = data.match(pattern);
         match = match[1];
      } else {
        match = data;
        console.log('The string does not contain RPIE');
      }
      
      // const extractedValue = match[1];
      console.log(match);
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM rpie_specifications WHERE rpie_id = ?',
          [match],
          (_, { rows }) => {
            if (rows.length > 0) {
              
              for (let i = 0; i < rows.length; i++) {
                const storedData = rows.item(0);

                // Check if storedData is not null before parsing
                if (storedData !== null) {
                  try {
                    setResponseData(storedData);
                    setShowScannedRPIEDialog(true);

                  } catch (parseError) {
                    console.error('Error parsing stored data:', parseError);
                    // Handle the parsing error as needed for each record
                  }
                }else{
                  console.log('No match found');
                  setResponseData(null);
                }
              }
            } else {
              // No data found in the database
              console.log('No match found');
              setResponseData(null); // Set response data to null or handle the case as needed
            }
          },
          (tx, error) => {
            console.error('Error executing SQL query:', error);
            setResponseData(null); // Handle the SQL query error as needed
          }
        );
      });
    }

    
  };

  const hideScannedRPIEDialog = () => {
    setShowScannedRPIEDialog(false);
  };

  const handleConfirmScannedRPIE = () => {
    // Handle the case when the user wants to view the scanned RPIE
    // You can navigate to another screen or perform other actions as needed
    navigation.navigate('SingleInventory', { rpie: responseData });
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

      {scanned && (
        <Button
          style={{ backgroundColor: '#372160' }}
          textColor="#fff"
          onPress={() => setScanned(false)}
        >
          Scan again?
        </Button>
      )}
      <Portal>
        <Dialog visible={showScannedRPIEDialog} onDismiss={hideScannedRPIEDialog}>
          <Dialog.Title>Confirm Scanned RPIE</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to view this scanned RPIE QR Code?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideScannedRPIEDialog}> Cancel</Button>
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
