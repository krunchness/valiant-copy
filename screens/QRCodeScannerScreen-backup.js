import React, { useState, useEffect } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Portal, Dialog, Provider, Paragraph, Button } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';

function QRCodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScannedRPIEDialog, setShowScannedRPIEDialog] = useState(false);
  const [dialogPost, setDialogPost] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [scannerActive, setScannerActive] = useState(true); // To control scanner activity

  const isFocused = useIsFocused(); // Check if the screen is focused

  useEffect(() => {
    // Check for camera permissions when the component mounts
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    // Start the scanner when the screen is focused
    if (isFocused) {
      setScanned(false); // Reset scanned state
      setScannerActive(true); // Enable scanner when screen is in focus
    } else {
      setScannerActive(false); // Disable scanner when screen loses focus
    }
  }, [isFocused]);

  useEffect(() => {
    // Handle hardware back button press to hide the dialog
    const handleBackPress = () => {
      if (showScannedRPIEDialog) {
        hideScannedRPIEDialog();
        return true;
      }
      return false;
    };

    // Subscribe to the hardware back button event
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup the event listener when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [showScannedRPIEDialog]);

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log(data);
    if (!showScannedRPIEDialog) {
      setResponseData(null); // Reset the response data
      setShowScannedRPIEDialog(true);

      const pattern = /RPIE ID:\s+(\S+)/;
      const match = data.match(pattern);

      if (match) {
        const extractedValue = match[1];
        const getScannedRPIEApiUrl = `https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/get_scanned_rpie/${extractedValue}`;

        try {
          const response = await axios.get(getScannedRPIEApiUrl);
          setResponseData(response.data);
        } catch (error) {
          console.error('Error duplicating post:', error);
        }
      } else {
        console.log('No match found');
      }
    }
  };

  const hideScannedRPIEDialog = () => {
    setShowScannedRPIEDialog(false);
  };

  const handleConfirmScannedRPIE = () => {
    navigation.navigate('SingleInventory', { post: responseData });
    setShowScannedRPIEDialog(false);
  };

  return (
    <Provider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {hasPermission === null ? (
          <Text>Requesting camera permission</Text>
        ) : hasPermission === false ? (
          <Text>No access to camera</Text>
        ) : (
          <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <BarCodeScanner
              onBarCodeScanned={scannerActive && (scanned ? undefined : handleBarCodeScanned)}
              // Disable the scanner when 'scanned' is true or scannerActive is false
              style={{ width: '100%', height: '70%' }}
            />

            <Button style={{ width: 200, height: 200 }} onPress={() => setScanned(false)}>
              Tap to Scan Again
            </Button>
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