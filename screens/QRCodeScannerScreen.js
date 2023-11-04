import React, { useState, useEffect, useRef } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { Portal, Dialog, Provider, Paragraph, Button } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Camera } from 'expo-camera';
import * as SQLite from 'expo-sqlite';

// Create or open your SQLite database instance
const db = SQLite.openDatabase('rpie_specification.db');

function QRCodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScannedRPIEDialog, setShowScannedRPIEDialog] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);
  const [cameraVisible, setCameraVisible] = useState(true);

  const isFocused = useIsFocused();
  const cameraRef = useRef(null);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setScannerActive(true);
      setCameraVisible(true);
      // Ensure that the camera is started when the screen is focused
      if (cameraRef.current) {
        cameraRef.current.resumePreview();
      }
    } else {
      setScannerActive(false);
      // Ensure that the camera is stopped when the screen loses focus
      if (cameraRef.current) {
        cameraRef.current.pausePreview();
      }
    }
  }, [isFocused]);

  useEffect(() => {
    const handleBackPress = () => {
      if (showScannedRPIEDialog) {
        hideScannedRPIEDialog();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [showScannedRPIEDialog]);

  const handleQRCodeScanned = async ({ type, data }) => {
    if (!showScannedRPIEDialog) {
      setResponseData(null); // Reset the response data
      // setShowScannedRPIEDialog(true);
      
      const pattern = /RPIE ID:\s+(\S+)/;
      const match = data.match(pattern);

      if (match) {
        const extractedValue = match[1];
        console.log(extractedValue);
        // Query your SQLite database
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM rpie_specifications WHERE rpie_id = ?',
            [data],
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
      } else {
        console.log('No match found');
      }
    }
  };

  const hideScannedRPIEDialog = () => {
    setShowScannedRPIEDialog(false);
  };

  const handleConfirmScannedRPIE = () => {
    navigation.navigate('SingleInventory', { rpie: responseData });
    setShowScannedRPIEDialog(false);
    setCameraVisible(false); // Hide the camera when navigating away
  };

  const navigation = useNavigation();

  return (
    <Provider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {hasPermission === null ? (
          <Text>Requesting camera permission</Text>
        ) : hasPermission === false ? (
          <Text>No access to camera</Text>
        ) : (
          <View style={{ flex: 1, width: '100%', height: '100%' }}>
            {cameraVisible && ( // Render the camera only if it's visible
              <Camera
                ref={cameraRef}
                style={{ flex: 1, width: '100%', height: '70%' }}
                type={Camera.Constants.Type.back}
                onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
              />
            )}

            {!scanned && (
              <Button
                style={{ width: 200, height: 200 }}
                onPress={() => setScanned(false)}
              >
                Tap to Scan Again
              </Button>
            )}
          </View>
        )}
      </View>

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
    </Provider>
  );
}

export default QRCodeScannerScreen;
