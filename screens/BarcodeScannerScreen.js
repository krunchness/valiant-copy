import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, AppState } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Dialog, Portal, Paragraph, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { db } from '../database';

function BarcodeScannerComponent({ scanned, handleBarCodeScanned }) {
  useEffect(() => {
    // Update the onBarCodeScanned prop when the scanned state changes
  }, [scanned]);

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={{ height: 400, width: 400 }}
    />
  );
}

export default function BarcodeScannerScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  const [showScannedRPIEDialog, setShowScannedRPIEDialog] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }


  useFocusEffect(
    React.useCallback(() => {
      setHasPermission(null); // Reset hasPermission to null
      askForCameraPermission(); // Request camera permission again
      setScanned(false); // Reset scanned state to false
      setText('Not yet scanned'); // Reset text state
    }, [])
  );

  useEffect(() => {
    askForCameraPermission();
  }, []);

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

      console.log(match);
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM rpie_specifications WHERE rpie_id = ?',
          [match],
          (_, { rows }) => {
            if (rows.length > 0) {

              for (let i = 0; i < rows.length; i++) {
                const storedData = rows.item(0);

                if (storedData !== null) {
                  try {
                    setResponseData(storedData);
                    setShowScannedRPIEDialog(true);

                  } catch (parseError) {
                    console.error('Error parsing stored data:', parseError);
                  }
                } else {
                  console.log('No match found');
                  setResponseData(null);
                }
              }
            } else {
              console.log('No match found');
              setResponseData(null);
            }
          },
          (tx, error) => {
            console.error('Error executing SQL query:', error);
            setResponseData(null);
          }
        );
      });
    }
  };

  const hideScannedRPIEDialog = () => {
    setShowScannedRPIEDialog(false);
  };

  const handleConfirmScannedRPIE = () => {
    navigation.navigate('SingleInventory', { rpie: responseData });
    setShowScannedRPIEDialog(false);
  };

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

  return (
    <View style={styles.container}>
      <BarcodeScannerComponent scanned={scanned} handleBarCodeScanned={handleBarCodeScanned} />
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
