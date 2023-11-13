import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
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

        if (isNaN(rating) || rating < 1 || rating > 5) {
        setMessage("Rating must be an integer between 1 and 5");
        return;
        }

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
          <Text>{`Username: ${username}`}</Text>
          {message && <Text style={styles.errorText}>{message}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Artist"
            onChangeText={(text) => handleChange('artist', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Song"
            onChangeText={(text) => handleChange('song', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Rating"
            onChangeText={(text) => handleChange('rating', text)}
            keyboardType="numeric"
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" onPress={() => navigation.goBack()} />
        </View>
      );
    
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    margin: 20,
},
songContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
},
songText: {
    fontSize: 16,
    fontWeight: 'bold',
},
starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
},
});

  
export default NewRating;