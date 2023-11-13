import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import Registration from './Components/Registration';
import Login from './Components/Login'
import Overview from './Components/Overview'
import NewRating from './Components/NewRating'

const Stack = createStackNavigator();

export default function App() {
  return (
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
      name="Overview"
      component={Overview}
      options={{
        headerLeft: null, // Remove back button in the header
      }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{
        headerLeft: null, // Remove back button in the header
      }}
    />
    <Stack.Screen
      name="Registration"
      component={Registration}
    />
    <Stack.Screen
      name="NewRating"
      component={NewRating}
    />
  </Stack.Navigator>
</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
