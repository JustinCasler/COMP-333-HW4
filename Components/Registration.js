import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (!password || !confirmPassword || !username) {
      alert("Please don't leave any field blank.");
    } else if(password.length < 10 || confirmPassword.length < 10){
      alert("Password must be at least 10 charecters.");
    } else if (password === confirmPassword) {
      const inputs = {
        username: username,
        password: password,
      };
      
      axios.post(process.env.EXPO_PUBLIC_API_URL , { inputs, action: "register" })
      .then((response) => {
        if (response.data.status === 1) {
          // Registration was successful
          navigation.navigate('Login')
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
    fontSize: 36, 
    marginBottom: 20, 
  },
  input: {
    height: 70,
    fontSize: 22, 
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10, 
    marginBottom: 20,
    padding: 20, 
    width: '80%',
  },
});

export default Registration;