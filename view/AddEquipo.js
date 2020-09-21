import React  from 'react';
import { Text, View, ScrollView, Image, AsyncStorage } from 'react-native';
import { Button, Provider, Snackbar, TextInput } from 'react-native-paper';
import firebase from 'firebase';
import firebaseConfig from './../firebase/config';

class AddEquipo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            region : {
                name : ''
            },
            equipo : null,
            nameEquipo : '',
            pokemonCards : [],
            listPokemons : [],
            selectedPokemons : [],
            totalSelectedPokemons : 0,
            userInfo : null,
            showSnackbar : false,
            messageSnackbar : '',
            loadingButton : false
        }

        
    }

    componentDidMount() {
        let instance = this;
        let region = this.props.route.params.region;
        this.fetchPokemons(region);

        if(!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        AsyncStorage.getItem('userInfo')
            .then(data => {
                instance.userInfo = JSON.parse(data);
                console.log('userInfo', data);
            });

        let equipo = this.props.route.params.equipo;

        if(equipo != null) {
            console.log('editando un equipo', equipo);
            this.setState({ equipo : equipo });
            this.setState({ nameEquipo : equipo.data.name });
        }
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
        var uniqueId = 0;
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

    saveEquipo = async (selectedPokemons) => {

        if(this.state.nameEquipo == '') {
            this.setState({ messageSnackbar : 'Debes ingresar un nombre para tu equipo '});
            this.setState({ showSnackbar : true });
            return;
        }

        let arrayPokemons = [];
        let instance = this;
        this.setState({ loadingButton : true });
        selectedPokemons.map(pokemon => {
            //guardo unicamente los nombres
            arrayPokemons.push(pokemon.pokemon_species.name);
        });

        //la ruta base para guardar el registro queda como 'equipo/104656956906067055000/kanto'
        firebase.database().ref('equipo/' + this.userInfo.id + '/' + this.props.route.params.region.name).push({
            region : this.props.route.params.region.name,
            name : this.state.nameEquipo,
            userName : this.userInfo.name,
            pokemons : arrayPokemons
        }).then(data => {
            console.log('registros insertados', data);
            instance.setState({ loadingButton : false }, () => {
                instance.setState({ showSnackbar : true });
                instance.setState({ messageSnackbar : 'Equipo registrado correctamente' });
            });
            
            
        }).catch(err => {
            console.log('no registrado', err);
            instance.setState({ loadingButton : false }, () => {
                instance.setState({ showSnackbar : true });
                instance.setState({ messageSnackbar : 'Error al registrar tu equipo' });
            });
            
            
        });
    }

    closeSnackbar = () => {
        this.setState({ showSnackbar : false });
    }

    renderCard = (pokemon) => {
        return (
            <></>
        );
    }

    render() {
        return(
            <Provider>
                <View style={{ padding : 15, marginBottom : 90, paddingBottom : 70 }}>
                    <TextInput
                        label="Nombre"
                        mode="outlined"
                        value={this.state.nameEquipo}
                        onChangeText={text => this.setState({ nameEquipo : text })}
                        />
                    <View style={{ flexDirection : 'row', justifyContent: 'space-between', marginTop : 15 }}>
                        <Text style={{ fontSize : 15 }}>Región seleccionada : {this.state.region.name}</Text>
                        <Text style={{ fontSize : 15 }}>{this.state.totalSelectedPokemons} de 6 pokemons</Text>   
                    </View>
                    
                    <ScrollView>
                            {this.state.listPokemons.map((pokemon) => (
                                <View 
                                    key={pokemon.key}
                                    style={{ 
                                        flex: 5,
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        zIndex: 0 
                                    }} >
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

                {this.state.equipo == null && (
                    <Button
                        style={{ position : 'absolute', bottom : 15, borderRadius : 30, alignSelf : 'center',  zIndex: 1 }}
                        icon="content-save"
                        mode="contained" 
                        loading={this.state.loadingButton}
                        disabled={this.state.totalSelectedPokemons < 3 || this.state.totalSelectedPokemons > 6}
                        onPress={() => this.saveEquipo(this.state.selectedPokemons)}>
                            guardar
                    </Button>
                )}

                {this.state.equipo != null && (
                    <View style={{ flex : 1, position : 'absolute', width : '100%', bottom : 15, flexDirection : 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            style={{ borderRadius : 30 }}
                            icon="content-save"
                            mode="contained" 
                            loading={this.state.loadingButton}
                            disabled={this.state.totalSelectedPokemons < 3 || this.state.totalSelectedPokemons > 6}
                            onPress={() => this.saveEquipo(this.state.selectedPokemons)}>
                                modificar
                        </Button>
                        <Button
                            style={{ borderRadius : 30 }}
                            icon="delete"
                            mode="contained" 
                            loading={this.state.loadingButton}
                            onPress={() => this.saveEquipo(this.state.selectedPokemons)}>
                                eliminar
                        </Button>
                    </View>
                    
                )}
                

                <Snackbar
                    visible={this.state.showSnackbar}
                    onDismiss={this.closeSnackbar}
                    duration={Snackbar.DURATION_SHORT}
                    action={{ label : 'Cerrar', onPress : () => this.closeSnackbar }}
                    style={{ backgroundColor : '#424242' }}
                    theme={{ colors: { accent: '#fff' }}}>{this.state.messageSnackbar}</Snackbar>
            </Provider>
        );
    }
}

export default AddEquipo;