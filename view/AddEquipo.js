import React, { Component, useContext } from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { Button, Provider } from 'react-native-paper';
import firebase from 'firebase';

class AddEquipo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            region : {
                name : ''
            },
            pokemonCards : [],
            listPokemons : [],
            selectedPokemons : [],
            totalSelectedPokemons : 0
        }

        
    }
    
    componentWillMount() {
        /*
        
          const firebaseConfig = {
            apiKey: "AIzaSyDS2eV54kuhGt91GkKoWiR7gBDtpvMI0jU",
            authDomain: "pokeapp-83e8e.firebaseapp.com",
            databaseURL: "https://pokeapp-83e8e.firebaseio.com",
            projectId: "pokeapp-83e8e",
            storageBucket: "pokeapp-83e8e.appspot.com",
            messagingSenderId: "649843209856",
            appId: "1:649843209856:web:c37ca2f59f2a149ba15865",
            measurementId: "G-FQCP573PKZ"
          };

          if(!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
          }
          

          this.db = firebase.database();
          */
          /*
          firebase.database().ref('/user/001').set({
              name : 'carlos',
              edad : 24
          }).then(data => {
              console.log('registros insertados');
          }).catch(err => {
              console.log('no registrado');
          });
          */
          
        
    }

    componentDidMount() {
        let region = this.props.route.params.region;
        this.fetchPokemons(region);
    }

    fetchDetailPokedex = async (pokedex) => {
        try {
            let response = await fetch(pokedex.url);
            let json = await response.json();
            return json;
        } catch(err) {
            return null;
        }
    }

    fetchPokemons = async (region) => {
        
        let instance = this;
        let responseRegion = await fetch(region.url);
        let jsonRegion = await responseRegion.json();

        instance.setState({ region : jsonRegion });

        let listPokedexes = [];
        let i = 0, total = jsonRegion.pokedexes.length;
        for(let i=0; i<total; i++) {
            let responseDetailPokedex = await fetch(jsonRegion.pokedexes[i].url);
            let jsonDetailPokedex = await responseDetailPokedex.json();

            listPokedexes.push(jsonDetailPokedex);
        }

        this.setPokemonCards(listPokedexes);

    }



    setPokemonCards = (listPokedexes) => {
        let instance = this;
        var uniqueId = 0;
        var pokemonCards = [];

        let totalPokedexes = listPokedexes.length;

        //almaceno en un solo arreglo, los pokemon de todas las regiones 
        let listPokemons = [];

        //asigno un ID a cada pokemon, y una bandera para verificar la imagen
        listPokedexes.map(pokedex => {
            pokedex.pokemon_entries.map(pokemon => {
                pokemon.key = uniqueId++;
                pokemon.imageFailed = false; 
                pokemon.selected = false;
                listPokemons.push(pokemon);
            });
        })

        this.setState({ listPokemons : listPokemons }, () => {
            console.log('carga lista');
        });
    }

    setSelectPokemon = (key, selected) => {
        //descarmar un pokemon
        if(selected) {
            this.setState({ totalSelectedPokemons : this.state.totalSelectedPokemons - 1 });
            this.state.listPokemons[key].selected = false;

            //encuentro el indice en donde se ubica el pokemon
            let index = 0;

            for(let i=0; i<this.state.totalSelectedPokemons; i++) {
                if(this.state.selectedPokemons[i].key == key) {
                    this.state.selectedPokemons.splice(index, 1);
                    break;
                }
            }


        } 
        //seleccionar un pokemon 
        else {
            if(this.state.totalSelectedPokemons < 6) {
                this.setState({ totalSelectedPokemons : this.state.totalSelectedPokemons + 1 });
                this.state.listPokemons[key].selected = true;
                this.state.selectedPokemons.push(this.state.listPokemons[key]);
            }
        }
        
    }

    saveEquipo = () => {
        console.log('equipo seleccionado', this.state.selectedPokemons);
        
        firebase.database().ref('/user/001').set({
            name : 'carlos',
            edad : 24
        }).then(data => {
            console.log('registros insertados');
        }).catch(err => {
            console.log('no registrado');
        });
    }

    render() {
        return(
            <Provider>
                <View style={{ padding : 15, marginBottom : 90 }}>
                    <Text style={{ fontSize : 15 }}>Región seleccionada : {this.state.region.name}</Text>
                    <Text style={{ fontSize : 15 }}>{this.state.totalSelectedPokemons} de 6 pokemons</Text>
                    <ScrollView>

                        {this.state.listPokemons.map((pokemon) => (
                        
                                <View 
                                    key={pokemon.key}
                                    style={{ 
                                        flex: 5,
                                        flexDirection: 'column',
                                        alignItems: 'center' 
                                    }}>

                                    <Image 
                                        style={{ width : 150, height : 150 }}
                                        source={{
                                            uri : pokemon.imageFailed ? 
                                            'https://raw.githubusercontent.com/ahuacate15/biblioteca-estructura-datos/master/white-question-mark.jpg' : 
                                            `https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${pokemon.pokemon_species.name}.png`
                                        }}
                                        onError={() => {
                                            pokemon.imageFailed = false;
                                            this.state.listPokemons[pokemon.key].imageFailed = true;
                                        }} />

                                    <Text>{pokemon.pokemon_species.name}</Text>
                                    <Button 
                                        icon={pokemon.selected ? "cancel" : "plus"} 
                                        mode={pokemon.selected ? "text" : "outlined"} 
                                        disabled={!pokemon.selected && this.state.totalSelectedPokemons == 6}
                                        onPress={() => this.setSelectPokemon(pokemon.key, pokemon.selected)}>
                                        {pokemon.selected ? "des-seleccionar" : "seleccionar"}
                                    </Button>

                                </View>    
                        
                        ))}
                    </ScrollView>
                </View>

                <Button
                    style={{ position : 'absolute', bottom : 15, borderRadius : 30, alignSelf : 'center' }}
                    icon="content-save"
                    mode="contained" 
                    disabled={this.state.totalSelectedPokemons < 3 || this.state.totalSelectedPokemons > 6}
                    onPress={() => this.saveEquipo()}>
                        guardar
                </Button>
            </Provider>
        );
    }
}

export default AddEquipo;