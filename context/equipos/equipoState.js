import React, { useReducer } from 'react';

import EquipoReducer from './equipoReducer';
import EquipoContext from './equipoContext';

const EquipoState = props => {

    const initialState = {
        equipos : []
    }

    const [state, dispatch] = useReducer(EquipoReducer, initialState);

    return (
        <EquipoContext.Provider>
            {props.children}
        </EquipoContext.Provider>
    );
}

export default EquipoState;