# pokeapp

## Detalles de la aplicación
### Copiar un equipo por el código
Al momento de crear un equipo, se genera de forma automática un código único para cada registro.  
Presiona el botón **ingresar código** para poder copiar un equipo ya existente.

![Pantalla principal](https://user-images.githubusercontent.com/19592284/93779030-bf120a80-fbe3-11ea-9978-faa98b7ec15a.png)

![Moda ingresar codigo](https://user-images.githubusercontent.com/19592284/93779032-bfaaa100-fbe3-11ea-841c-22d25fd84056.png)

![Llenar codigo](https://user-images.githubusercontent.com/19592284/93779033-bfaaa100-fbe3-11ea-8fa2-225d22705f01.png)

![Equipo copiado](https://user-images.githubusercontent.com/19592284/93779034-c0433780-fbe3-11ea-81dd-7cab8a79e20b.png)

### Crear un equipo
Al presionar el botón **crear** deberás elegir un nombre para tu equipo pokemon, además de elegir entre 3 a 6 ítem.

![Crear equipo](https://user-images.githubusercontent.com/19592284/93779035-c0433780-fbe3-11ea-9c25-dd41a9b76c9d.png)

### Cambio de región
Puedes moverte entre regiones utilizando el *select* de la pantalla principal.  
Debes tomar en cuenta que los **codigos de equipo** que ingreses, deben pertenecer a la región seleccionada.

![Cambio region](https://user-images.githubusercontent.com/19592284/93779036-c0433780-fbe3-11ea-9f4f-03dac3c650e1.png)

## Problemas al compilar la aplicación
Si el proyecto no refresca tus cambios, ejecuta los siguientes comandos:
- `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
- despliega la aplicacion con `npx react-native run-android`
- finalmente, ejecuta `npm start`
- si la app sigue sin mostrar tus cambios, desinstala y ejecuta los pasos nuevamente

## Referencia PokeAPI

Regiones disponibles  
**GET** `https://pokeapi.co/api/v2/region/`  
```javascript
{
    count : 8,
    results : [
        {
            name : "kanto",
            //detalle de la region
            url : "https://pokeapi.co/api/v2/region/1/"
        }
    ]
}
```
**GET** `https://pokeapi.co/api/v2/region/{id}`

```javascript
{
    id : 1,
    locations : [...],
    name : "kanto",
    names : [...],
    pokedexes : [
        {
            name : "kanto",
            //pokemons de la region
            url : "https://pokeapi.co/api/v2/pokedex/2/" 
        }
    ]
}

```

Lista de pokemons  
**GET** `https://pokeapi.co/api/v2/pokedex/2/`

```javascript
{
    pokemon_entries : [
        {
            entry_number : 1,
            pokemon_species : {
                name : "bulbasur",
                url : "https://pokeapi.co/api/v2/pokemon-species/1/"
            }
        }
    ]
}
```

Para acceder a la imagen de los pokemon, utiliza el siguiente enlace (reemplazando el parametro por el nombre del mismo que aparece en la pokedex):  
`https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/{name}.png`  
