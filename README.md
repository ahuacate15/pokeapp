# pokeapp

## Referencia PokeAPI
Regiones disponibles  
**GET** `https://pokeapi.co/api/v2/region/`

Sub-regiones disponibles  
**GET** `https://pokeapi.co/api/v2/region/{id or name}/`


## Ejecutar el proyecto
Conecta tu movil, activa el debugger por USB y ejecuta el comando `npm start`

Para refrescar la aplicacion, presiona *r* desde la CLI de react-native
## Problemas al compilar la aplicacion
Si el proyecto no refresca tus cambios, ejecuta el siguiente comando
`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`

Despliega la aplicacion en tu dispositivo con `npx react-native run-android`

