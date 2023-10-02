import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Text, StyleSheet, View, Linking } from 'react-native';

function DashboardScreen() {
  const navigation = useNavigation();

  const openExternalLink = (url) => {
    Linking.openURL(url);
  };

  const [scanned, setScanned] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardWrapper}>
          <Text style={styles.paragraph}>All RPIE Specification Sheet</Text>
        </View>
        <View style={styles.cardWrapper}>
          <Button mode="contained" onPress={() => navigation.navigate('Inventory List')}>
            Go to Specification Sheet
          </Button>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.cardWrapper}>
          <Text style={styles.paragraph}>Upload RPIE Specification Sheet</Text>
        </View>
        <View style={styles.cardWrapper}>
          <Button mode="contained" onPress={() => openExternalLink("https://valiantservices.dcodeprojects.co.in/upload-rpie-specification/?action=upload-valiant-rpie")}>
            Go to Upload Specification Sheet
          </Button>
        </View>
      </View>

      <Button mode="contained" onPress={() => navigation.navigate('QRCodeScannerScreen')}>
        Scan QR Code
      </Button>
      
      {/* Display a message if a QR code has been scanned */}
      {scanned && <Text>QR Code Scanned!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#6528F7',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 20,
    marginBottom: 50
  },
  cardWrapper: {
    paddingVertical: 20,
  },
  paragraph: {
    color: '#EDE4FF',
    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});

export default DashboardScreen;