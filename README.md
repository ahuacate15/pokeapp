# pokeapp

## Problemas al compilar la aplicacion
Si el proyecto no refresca tus cambios, ejecuta los siguientes comandos:
- `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
- despliega la aplicacion con `npx react-native run-android`
- finalmente, ejecuta `npm start`
- si la app sigue sin mostrar tus cambios, desinstalala y ejecuta los pasos nuevamente

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
