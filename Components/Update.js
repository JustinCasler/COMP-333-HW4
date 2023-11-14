import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const UpdateRating = ({ route, navigation }) => {
  const [ratingData, setRatingData] = useState({});
  const [message, setMessage] = useState('');
  const [inputs, setInputs] = useState({});
  const id = route.params.id;
  
  var username
  if (route.params) {
    username = route.params.username;
  }
  useEffect(() => {
    // Fetch the song details based on the ID
    axios
      .get(process.env.EXPO_PUBLIC_API_URL, {
        params: { action: 'getRating', id },
      })
      .then((response) => {
        console.log(id);
        console.log(response.data);
        setRatingData(response.data);
        setInputs(response.data); // set initial form data
      })
      .catch((error) => {
        console.error('Error fetching song details: ', error);
      });
  }, [id]);

  const handleChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = () => {
    // Perform update request
    axios
      .post(process.env.EXPO_PUBLIC_API_URL, { inputs, action: 'update', id })
      .then((response) => {
        if (response.data.status === 1) {
          // Song was updated
          navigation.navigate('Overview', { username: username});
        } else {
          // Update failed, display the error message from the backend
          setMessage(response.data.message);
        }
      })
      .catch(() => {
        setMessage('An error occurred while processing your request.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Song Rating</Text>
      {message && <Text style={styles.errorText}>{message}</Text>}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Artist</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter artist"
            onChangeText={(text) => handleChange('artist', text)}
            value={inputs.artist || ''}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Song Title</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter song"
            onChangeText={(text) => handleChange('song', text)}
            value={inputs.song || ''}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Rating</Text>
        <Picker
            style={styles.input}
            selectedValue={(inputs.rating ?? '').toString()}
            onValueChange={(value) => handleChange('rating', value)}
        >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Update" onPress={handleSubmit} color="green" />
        <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 20,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default UpdateRating;
