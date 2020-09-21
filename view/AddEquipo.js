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
            console.log('equipo', JSON.stringify(equipo));
            this.setState({ nameEquipo : equipo.data.name });
            this.setState({ equipo : equipo }, () => {
                this.fetchPokemons(region, this.extractSelectedPokemons(equipo.data.pokemons), function() {
                    console.log('datos cargados para editar');
                });
            });
            
            
        } else {
            this.fetchPokemons(region, null, function() {
                console.log('datos cargados para agregar');
            });
        }
    }

    //convierte { "0" : "bulbasaur", "1" : "ivysaur"} a ["bulbasaur", "ivysaur"]
    extractSelectedPokemons = (data) => {
        let jsonData = JSON.parse(JSON.stringify(data));
        let processedData = [];

        Object.entries(jsonData).forEach(([key, value]) => {
            processedData.push(value);   
        });

        return processedData;
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

    /**
     * 
     * @param {*} selectedPokemons lista de pokemons a seleccionar ["bulbasaur", "ivysaur", ...]. null cuando se crea un nuevo equipo 
     */
    fetchPokemons = async (region, dataEquipo, callback) => {
        
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

        this.setPokemonCards(listPokedexes, dataEquipo, callback);

    }



    /**
     * 
     * @param {*} selectedPokemons lista de pokemons a seleccionar ["bulbasaur", "ivysaur", ...]. null cuando se crea un nuevo equipo 
     */
    setPokemonCards = (listPokedexes, dataEquipo, callback) => {
        let uniqueId = 0;

        //almaceno en un solo arreglo, los pokemon de todas las regiones 
        let listPokemons = [];

        //todos los pokemon aparecen deseleccionados (es un equipo nuevo)
        if(dataEquipo == null) {
            //asigno un ID a cada pokemon, y una bandera para verificar la imagen
            listPokedexes.map(pokedex => {
                pokedex.pokemon_entries.map(pokemon => {
                    pokemon.key = uniqueId++;
                    pokemon.imageFailed = false; 
                    pokemon.selected = false;
                    listPokemons.push(pokemon);
                });
            })
        } 
        //seleccionar algunos pokemon. (se edita un equipo)
        else {
            let mapPokemons = new Map();
            let tmpPokemon = null;
            let selectedPokemons = [];

            
            //cargo los datos en un mapa, usando el nombre de pokemon como clave 
            listPokedexes.map(pokedex => {
                pokedex.pokemon_entries.map(pokemon => {
                    pokemon.key = uniqueId++;
                    pokemon.imageFailed = false;
                    mapPokemons.set(pokemon.pokemon_species.name, pokemon);
                });
            });

            dataEquipo.map(nombre => {
                tmpPokemon = mapPokemons.get(nombre);
                tmpPokemon.selected = true;
                mapPokemons.set(nombre, tmpPokemon);
                selectedPokemons.push(tmpPokemon);
            });
            
            mapPokemons.forEach(function(pokemon) {
                listPokemons.push(pokemon);
            });

            this.setState({ totalSelectedPokemons : dataEquipo.length });
            this.setState({ selectedPokemons : selectedPokemons });
        }



        this.setState({ listPokemons : listPokemons }, () => {
            callback();
        });
    }

    setSelectPokemon = (key, selected) => {
        //desmarcar un pokemon
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

            //si el registro se edita, actualizo el arrego
            if(this.state.equipo != null) {
                this.state.equipo.data.pokemons = this.extractSelectedPokemons(this.state.selectedPokemons);
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

    
    getTotalEquiposByRegion = async () => {
        
        let totalEquipos = 0;
        let data = await firebase.database().ref('equipo/' + this.props.route.params.region.name).once('value', snapshot => {
            return snapshot.val();
        })
        
        if(data != null) {
            let jsonData = JSON.parse(JSON.stringify(data));

            try {
                Object.entries(jsonData).forEach(([key, value]) => {

                    Object.entries(value).forEach(([_key, _value]) => {
                        totalEquipos++;
                    });
                    
                });
            } catch(err) {
                return 0;
            }
            
            
        } 

        return totalEquipos;
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

        //codigo unico para cada equipo. se compone de las iniciales de la region y el total de equipos en la

        let generatedKey = '';

        try {
            generatedKey = this.props.route.params.region.name.substring(0,3) + await this.getTotalEquiposByRegion();
        } catch(err) {
            generatedKey = this.props.route.params.region.name.substring(0,3);
        }
        

        selectedPokemons.map(pokemon => {
            //guardo unicamente los nombres
            arrayPokemons.push(pokemon.pokemon_species.name);
        });


        //la ruta base para guardar el registro queda como 'equipo/kanto/104656956906067055000'
        firebase.database().ref('equipo/' + this.props.route.params.region.name + '/' + this.userInfo.id).push({
            key : generatedKey,
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

    editEquipo = async (selectedPokemons) => {

        if(this.state.nameEquipo == '') {
            this.setState({ messageSnackbar : 'Debes ingresar un nombre para tu equipo' });
            this.setState({ showSnackbar : true });
            return;
        }

        let arrayPokemons = [];
        let instance = this;
        this.setState({ loadingButton : true });
        
        selectedPokemons.map(pokemon => {
            arrayPokemons.push(pokemon.pokemon_species.name);
        });

        let equipo = this.state.equipo;
        console.log('antes de equipo', equipo);
        equipo.data.pokemons = this.extractSelectedPokemons(equipo.data.pokemons).concat(arrayPokemons);
        equipo.data.name = this.state.nameEquipo;

        console.log('antes de map', equipo);
        //elimino los duplicados
        equipo.data.pokemons = Array.from(new Set(equipo.data.pokemons));

        firebase.database().ref('equipo/' + this.props.route.params.region.name + '/' + this.userInfo.id + '/' + equipo.key).set(
            equipo.data
        ).then(data => {
            console.log('equipo actualizado', data);
            instance.setState({ loadingButton : false });
            instance.setState({ showSnackbar : true });
            instance.setState({ messageSnackbar : 'Equipo modificado correctamente '});
        }).catch(err => {
            console.log('error al cambiar equipo', data);
        })
    }
    closeSnackbar = () => {
        this.setState({ showSnackbar : false });
    }

    renderCard = (pokemon) => {
        return (
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
                        this.forceUpdate();
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
                        <Text style={{ fontSize : 15, fontWeight : 'bold' }}>Región seleccionada : {this.state.region.name}</Text>
                        <Text style={{ fontSize : 15, fontWeight : 'bold' }}>{this.state.totalSelectedPokemons} de 6 pokemons</Text>   
                    </View>
                    
                   
                    <ScrollView>
                            {this.state.listPokemons.map((pokemon) => this.renderCard(pokemon))}
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
                            onPress={() => this.editEquipo(this.state.selectedPokemons)}>
                                modificar
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