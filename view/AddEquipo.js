import React, { Component } from 'react';
import { Text, View, ScrollView, Image, FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import {OptimizedFlatList} from 'react-native-optimized-flatlist';

class AddEquipo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            region : {
                name : ''
            },
            pokemonCards : []
        }
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

            listPokedexes[i++] = jsonDetailPokedex;
        }

        this.setPokemonCards(listPokedexes);

    }



    setPokemonCards = (listPokedexes) => {
        let instance = this;
        var uniqueId = 1;
        var pokemonCards = [];

        let totalPokedexes = listPokedexes.length;

        for(let i=0; i<totalPokedexes; i++) {
           try {
                let entries = listPokedexes[i].pokemon_entries;
                let totalEntries = entries.length;

                for(let j=0; j<totalEntries; j++) {
                    pokemonCards.push(
                        <View 
                            uniqueId={uniqueId++} 
                            style={{ 
                                flex: 5,
                                flexDirection: 'column',
                                alignItems: 'center' 
                             }}>
                            <Image 
                                style={{ width : 150, height : 150 }}
                                source={{
                                    uri : `https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${entries[j].pokemon_species.name}.png`
                                }}
                                onError={() => {
                                    //this.props.source = { uri : 'https://www.iconsdb.com/icons/preview/white/github-11-xxl.png' }
                                }} />
                            <Text>{entries[j].pokemon_species.name}</Text>
                        </View>
                    );
            }
           } catch(err) {

           }

        }

        this.setState({ pokemonCards : pokemonCards });
    }

    render() {
        return(
            <View>
                <Text>Región seleccionada: {this.state.region.name}</Text>
                <ScrollView>
                    {this.state.pokemonCards}
                </ScrollView>
            </View>
        );
    }
}

export default AddEquipo;