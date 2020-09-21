import React, { useReducer } from 'react';

import firebase from '../../firebase';
import FirebaseReducer from './firebaseReducer';
import FirebaseContext from './firebaseContext';

const FirebaseState = props => {

    const initialState = {
        equipos : []
    }

    const [state, dispatch] = useReducer(FirebaseReducer, initialState);

    return (
        <FirebaseContext.Provider>
            {props.children}
        </FirebaseContext.Provider>
    );
}

export default FirebaseState;