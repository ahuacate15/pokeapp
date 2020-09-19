
import 'react-native-gesture-handler';
import React  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './view/Login';
import Equipos from './view/Equipos';

const Stack = new createStackNavigator();

const App = () => {

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRoute="Login">

            <Stack.Screen
              name="Login"
              component={Login} />

            <Stack.Screen
              name="Equipos"
              component={Equipos} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
