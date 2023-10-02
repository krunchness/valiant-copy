import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { insertUser, loginUser } from '../database'; // Import database functions
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Get navigation object

  const handleRegister = () => {
    insertUser(email, password)
      .then((message) => {
        alert(message);
      })
      .catch((error) => {
        alert('User registration failed');
      });
  };

  const handleLogin = () => {
    loginUser(email, password)
      .then((message) => {
        alert(message);
        // Implement navigation logic here for a successful login
        navigation.navigate('Dashboard'); // Navigate to DashboardScreen
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login or Register</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default LoginScreen;