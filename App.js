import React, { useState } from 'react';
import { View, StyleSheet, DrawerLayoutAndroid, Image, Text, Button, TouchableOpacity, Linking  } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import InventoryListScreen from './screens/InventoryListScreen';
import SingleInventoryScreen from './screens/SingleInventoryScreen';
import EditSingleInventoryScreen from './screens/EditSingleInventoryScreen';
import QRCodeScannerScreen from './screens/QRCodeScannerScreen';
import LoginScreen from './screens/LoginScreen';
import * as SQLite from 'expo-sqlite';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 150, // Adjust the width and height as needed
    height: 150,
    resizeMode: 'contain',
    marginTop: 30
  },
  
  button: {
    color: 'red',
  },
  menuItemsContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    flex: 1,
    backgroundColor: 'blue',
    backgroundColor: 'transparent', // Background color for the wrapper
    marginVertical: 8,
    marginLeft: 10,
    marginRight: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

  },
});

const Drawer = createDrawerNavigator();

// Function to open an external link
const openExternalLink = (url) => {
  Linking.openURL(url);
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set initial authentication status

  // Function to handle user login
  const handleLogin = () => {
    // Implement your login logic here, and set isAuthenticated to true upon successful login
    setIsAuthenticated(true);
  };
  
  return (
    <PaperProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <Drawer.Navigator 
            drawerContent={props => <CustomDrawerContent {...props}/>} 
            screenOptions={{ headerMode: 'none' }}
            initialRouteName="Dashboard"
          >
            <Drawer.Screen name="Dashboard" component={DashboardScreen}/>
            <Drawer.Screen 
              name="Inventory List" 
              component={InventoryListScreen} 
              options={({ route }) => ({
                title: 'All RPIE Specification Sheet'
              })}
            />
            <Drawer.Screen
              name="SingleInventory"
              component={SingleInventoryScreen}
              options={({ route }) => ({
                title: route.params && route.params.post
                  ? route.params.post.post_title + ' | ' + route.params.post.acf.rpie_index_number_code
                  : 'Single Inventory'
              })}
            />
            <Drawer.Screen
              name="EditSingleInventory"
              component={EditSingleInventoryScreen}
              options={({ route }) => ({
                title: route.params && route.params.post
                  ? 'Edit ' + route.params.post.post_title + ' | ' + route.params.post.acf.rpie_index_number_code
                  : 'Edit Single Inventory'
              })}
            />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="QRCodeScannerScreen" component={QRCodeScannerScreen} />
          </Drawer.Navigator>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

const CustomDrawerContent = ({ navigation }) => (
  <DrawerLayoutAndroid
    drawerWidth={20}
    drawerPosition="left"
    renderNavigationView={() => (
      <View style={styles.drawerContent}>
      </View>
    )}
  >
    <View>
      {/* Logo */}
      <View style={styles.logoContainer}>
        {/*<Image
          source={require('./assets/logo.png')} // Replace with the path to your logo image
          style={styles.logo}
        />*/}
      </View>

      <View style={styles.menuItemsContainer}>
        <View style={styles.menuItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <View>
              <Text>Dashboard</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.menuItemsContainer}>
        <View style={styles.menuItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Inventory List')}>
            <View>
              <Text>Inventory List</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/*<View style={styles.menuItemsContainer}>
        <View style={styles.menuItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View>
              <Text>Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.menuItemsContainer}>
        <View style={styles.menuItem}>
          <TouchableOpacity onPress={() => openExternalLink('https://www.example.com')}>
            <View>
              <Text>Open External Link</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>*/}
    </View>
  </DrawerLayoutAndroid>
);