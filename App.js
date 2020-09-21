
import 'react-native-gesture-handler';
import React  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './view/Login';
import Equipos from './view/Equipos';
import AddEquipo from './view/AddEquipo';

const Stack = new createStackNavigator();

const App = () => {

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRoute="Login" >

            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: 'Inicio de sesion' }} />

            <Stack.Screen
              name="Equipos"
              component={Equipos}
              options={{ title: 'Mis equipos' }} />

            <Stack.Screen
              name="AddEquipo"
              component={AddEquipo}
              options={{ title: 'Crear equipo' }} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
