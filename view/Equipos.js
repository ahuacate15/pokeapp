import React, { Component, useEffect, useState } from 'react';
import { Text, View, FlatList, Keyboard } from 'react-native';
import { TextInput, Menu, Button, Provider } from 'react-native-paper';

class Equipos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            regions : [],
            selectedRegion : {},
            selectedRegionText : '',
            menuVisible : false,
            menuItems : []
        }
    }

    componentDidMount() {
        this.fetchRegions();
    }

    openMenu = () => {
        this.setState({ menuVisible : true });
        Keyboard.dismiss();
    }

    closeMenu = () => {
        this.setState({ menuVisible : false });
    }

    setRegions = (regions) => {
        let instance = this;
        this.setState({ regions : regions });

        var uniqueId = 1;
        var menuItems = [];
        regions.map(region => {
            menuItems.push(<Menu.Item key={uniqueId++} title={region.name} onPress={() => instance.selectRegion(region)} />);
        });
        //selecciono por defecto la primer region
        if(regions.length > 0) {
            this.selectRegion(regions[0]);
        }

        this.setState({ menuItems : menuItems });

        
    }

    selectRegion = (region) => {
        this.setState({ selectedRegion : region });
        this.setState({ selectedRegionText : region.name });
        this.closeMenu();
    }

    fetchRegions = () => {
        let instance = this;
        fetch('https://pokeapi.co/api/v2/region/')
            .then(response => response.json())
            .then(regions => {
                instance.setRegions(regions.results);
            })
            .catch((err) => {
                console.log('error', err);
            })
    }

    goToAddEquipo = () => {
        console.log('navigato to addEquipo');
        this.props.navigation.navigate('AddEquipo', { region : this.state.selectedRegion });
    }

    render() {
        let uniqueId = 1;
        return(    
            <Provider>        
                <View
                    style={{
                        flex : 1,
                        flexDirection: 'column',
                        padding : 15
                    }}>
                    <Menu
                        visible={this.state.menuVisible}
                        onDismiss={this.closeMenu}
                        style={{
                            marginTop : 10,
                            width : '92.5%'
                        }}
                        anchor={
                            <TextInput
                                label="Región"
                                mode="outlined"
                                pointerEvents="none"
                                editable={false}
                                value={this.state.selectedRegionText}
                                onChangeText={name => this.setState({selectedRegionText : name }) }
                                right={
                                    <TextInput.Icon name="chevron-down" onPress={this.openMenu}/>
                                }
                            />
                        }>
                        {this.state.menuItems}
                    </Menu>
                    
                    <Button 
                        style={{ position : 'absolute', bottom : 15, borderRadius : 30, alignSelf : 'center' }} 
                        icon="camera" 
                        mode="contained"
                        onPress={() => this.goToAddEquipo()}>Crear equipo</Button>
                </View>
            </Provider>
        );
    }
}

export default Equipos;