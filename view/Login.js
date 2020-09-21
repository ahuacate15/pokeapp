import React, { useState, useEffect } from 'react';
import { SafeAreaView, AsyncStorage } from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

const Login = ({navigation}) => {

    const [loggedIn, setloggedIn] = useState(false);
    const [userInfo, setuserInfo] = useState([]);
  
    const goToHome = () => {
        navigation.navigate('Equipos');
    }

    

    useEffect(() => {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], 
        webClientId: '649843209856-e85capg4rv57feu5nmbj9j6sa7lcf2s1.apps.googleusercontent.com', 
        offlineAccess: true,
        forceCodeForRefreshToken: true
      });
    });
  
    signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo.user));
        goToHome();
      } catch (error) {
        console.log('error', error);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
      }
    };
  
    return (
      <>
        <SafeAreaView>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn} />
        </SafeAreaView>
      </>
    );   
}

export default Login;