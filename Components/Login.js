import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Login({ navigation }) {
  const [inputs, setInputs] = useState({});

  const handleChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = () => {
    if (!inputs.username || !inputs.password) {
      alert("Please don't leave any field blank.");
    } else {

      // Perform your login logic here
      axios
        .post(process.env.EXPO_PUBLIC_API_URL, { inputs, action: "login" })
        .then((response) => {
          if (response.data.status === 1) {
            // Login was successful
            navigation.navigate('Overview', { username: inputs.username }); // You can replace 'Home' with the actual name of your home screen
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
            alert("An error occurred while processing your request.");
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to PlaylistPulse</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={inputs.username || ""}
        onChangeText={(text) => handleChange('username', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={inputs.password || ""}
        onChangeText={(text) => handleChange('password', text)}
      />
      
      <View style={styles.buttonContainer} >
        <Button title="Login" onPress={handleSubmit} style={styles.button}/>
        <View style={styles.space} />
        <Button title="Clear" onPress={() => { setInputs({}); }} style={styles.button}/>
      </View>
      
      <Text style={styles.linkText} onPress={() => navigation.navigate('Registration')}>Don't have an account? Create one here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
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
  linkText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center', 
  },
  button: {
    margin: 30, 
  },
  space: {
    width: 20, // or whatever size you need
    height: 20,
  },
});