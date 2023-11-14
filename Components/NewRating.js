import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const NewRating = ({ route, navigation }) => {
    var username
    if (route.params) {
       username = route.params.username;
    }
    const [inputs, setInputs] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (name, value) => {
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!inputs.artist || !inputs.song || !inputs.rating) {
            setMessage("All fields are required");
            return;
        }

        const rating = parseInt(inputs.rating, 10);

        // Perform your axios post request here
        axios.post(process.env.EXPO_PUBLIC_API_URL, { inputs, action: "addnew", username: username })
        .then((response) => {
            if (response.data.status === 1) {
                // Song was added
                console.log(response.data);
                navigation.navigate('Overview', { username: username });
            } else {
                // Registration failed, display the error message from the backend
                console.log(response.data);
                setMessage(response.data.message);
            }
        })
        .catch((error) => {
            setMessage("An error occurred while processing your request.");
        });
    
    };

    return (
        <View style={styles.container}>
          <Text style={styles.username}>{`Username: ${username}`}</Text>
          {message && <Text style={styles.errorText}>{message}</Text>}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Artist</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter artist"
              onChangeText={(text) => handleChange('artist', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Song Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter song"
              onChangeText={(text) => handleChange('song', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rating</Text>
            <Picker
              style={styles.input}
              selectedValue={inputs.rating}
              onValueChange={(value) => handleChange('rating', value)}
            >
              <Picker.Item label="*" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
                <Button title="Submit" onPress={handleSubmit} color="green" />
            </View>
            <View style={styles.buttonWrapper}>
                <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
            </View>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        margin: 20,
      },
      username: {
        marginBottom: 20,
        fontSize: 14,
        textAlign: 'center',
      },
      inputContainer: {
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
      },
      errorText: {
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
      },
      buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      buttonWrapper: {
        width: '30%',
      },
    });
    
    export default NewRating;