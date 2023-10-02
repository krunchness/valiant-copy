import React, {useRef, useState} from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View,
} from 'react-native';

class ProfileScreen extends React.Component {


  render() {
    return (
    <View style={styles.container}>
        <Text style={styles.paragraph}>Drawer on the</Text>
        <Text style={styles.paragraph}>
          Swipe from the side or press button below to see it!
        </Text>
       
      </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;