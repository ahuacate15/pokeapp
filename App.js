/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';

const App = () => {

  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      setloggedIn(true);
    } catch(error) {
      if(error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Inicio cancelado');
      } else if(error.code === statusCodes.IN_PROGRESS) {
        alert('Iniciando sesion');
      } else if(error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Playservices no disponible');
      } else {
        alert('Error al iniciar sesion');
      }
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <GoogleSigninButton
         style={{ width : 192, height : 48 }}
         size={GoogleSigninButton.Size.Wide}
         color={GoogleSigninButton.Color.Dark}
         onPress={this._signIn} />
      </SafeAreaView>
    </>
  );
};

export default App;
