import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password === confirmPassword) {
      const inputs = {
        username: username,
        password: password,
      };
      // Make the POST request to your backend
      
      axios.post(process.env.EXPO_PUBLIC_API_URL , { inputs, action: "register" })
      .then((response) => {
        console.log(response)
        if (response.data.status === 1) {
          // Registration was successful
          alert('Success!');
        } else if (response.data.status === 0) {
          // Registration failed, display the error message from the backend
          alert('Username taken!');
          
        }
      })
      .catch((error) => {
        console.log(error)
        alert("An error occurred while processing your request.");
      });
    } else {
      alert('Password and Confirm Password do not match.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </ScrollView>
  );
};

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: window.height,
  },
  title: {
    fontSize: 36, // Larger font size
    marginBottom: 20, // Increased margin
  },
  input: {
    height: 70, // Increased input height
    fontSize: 22, // Larger font size for inputs
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10, // Increased border radius
    marginBottom: 20, // Increased margin
    padding: 20, // Increased padding
    width: '80%',
  },
});

export default Registration;