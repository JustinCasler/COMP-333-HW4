import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const Overview = ({ route, navigation }) => {
  var username
  if (route.params) {
     username = route.params.username;
  }

  useEffect(() => {
    // Check if the username exists (user is logged in)
    if (!username) {
      // Redirect to the Login screen
      navigation.navigate('Login');
    }
  }, [username, navigation]);

  return (
    <View>
      {username ? (
        <Text>Hi, {username}!</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Overview;