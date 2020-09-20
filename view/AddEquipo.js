import React, { Component } from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
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
            totalSelectedPokemons : 0
        }
    }
    /*
    componentWillMount() {
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
          

          
          firebase.database().ref('/user/001').set({
              name : 'carlos',
              edad : 24
          }).then(data => {
              console.log('registros insertados');
          }).catch(err => {
              console.log('no registrado');
          });

          firebase.database().ref('/user').once('value', (data) => {
              console.log('datos', data.toJSON());
          });
        
    }
    */

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

        this.setState({ listPokemons : listPokemons });

        for(let i=0; i<uniqueId; i++) {
            pokemonCards.push(
                <View 
                    key={this.state.listPokemons[i].key}
                    style={{ 
                        flex: 5,
                        flexDirection: 'column',
                        alignItems: 'center' 
                     }}>

                    <Image 
                        style={{ width : 150, height : 150 }}
                        source={{
                            uri : this.state.listPokemons[i].imageFailed ? 
                            'https://raw.githubusercontent.com/ahuacate15/biblioteca-estructura-datos/master/white-question-mark.jpg' : 
                            `https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${this.state.listPokemons[i].pokemon_species.name}.png`
                        }}
                        onError={() => {
                            this.state.listPokemons[i].imageFailed = false;
                        }} />

                    <Text>{this.state.listPokemons[i].pokemon_species.name}</Text>
                    <Button 
                        icon="plus" 
                        mode="contained" 
                        disabled={this.state.listPokemons[i].selected}
                        onPress={() => this.selectPokemon(this.state.listPokemons[i].key)}>
                        seleccionar
                    </Button>

                </View>
            );


        }
        this.setState({ pokemonCards : pokemonCards });
    }

    selectPokemon = (key) => {
        if(this.state.totalSelectedPokemons < 6) {
            this.setState({ totalSelectedPokemons : this.state.totalSelectedPokemons + 1 });
            //this.state.listPokemons[0].selected = true;
            //this.forceUpdate();
            /*
            this.setState({
                listPokemons: update(this.state.listPokemons, {9: {name: {$selected: true }}})
            })*/
        }
    }

    render() {
        return(
            <View>
                <Text>Región seleccionada : {this.state.region.name}</Text>
                <Text>Equipo seleccionado : {this.state.totalSelectedPokemons} de 6</Text>
                <ScrollView>
                    {this.state.pokemonCards}
                </ScrollView>
            </View>
        );
    }
}

export default AddEquipo;