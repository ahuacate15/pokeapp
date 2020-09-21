import React from 'react';
import { Text, View, Keyboard, AsyncStorage } from 'react-native';
import { TextInput, Menu, Button, Provider, List, TouchableRipple, Card, Paragraph } from 'react-native-paper';
import firebase from 'firebase';
import firebaseConfig from './../firebase/config';

class Equipos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            regions : [],
            selectedRegion : {},
            selectedRegionText : 'kanto',
            menuVisible : false,
            menuItems : [],
            userInfo : null,
            listEquipos : []
        }
    }

    componentDidMount() {
        let instance = this;
        

        if(!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        AsyncStorage.getItem('userInfo')
            .then(data => {
                instance.userInfo = JSON.parse(data);
                instance.fetchRegions();
            });

    }

    
    convertListEquiposToArray = (listEquipos) => {
        try {
            //al utilizar directamente listEquipo, react native agrega mas elementos haciendo
            //mas compleja la re-estructuracion de la lsita
            let list = JSON.parse(JSON.stringify(listEquipos));
            let formattedList = [];

            Object.entries(list).forEach(([key, value]) => {
                formattedList.push({
                    key : key,
                    data : value
                });   
            });
            return formattedList;
        } catch(err) {
            return [];
        }

        
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
        this.setState({ selectedRegionText : region.name }, () => {
            this.fetchEquiposByRegion();
        });
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

    fetchEquiposByRegion = () => {
        //por defecto muestro los equipos de kanto
        firebase.database().ref('equipo/' + this.state.selectedRegionText + '/' + this.userInfo.id).on('value', (data) => {
            this.setState({ listEquipos : this.convertListEquiposToArray(data) });
        })
    }

    goToAddEquipo = () => {
        this.props.navigation.navigate('AddEquipo', { region : this.state.selectedRegion });
    }

    goToEditEquipo = (equipo) => {
        this.props.navigation.navigate('AddEquipo', { region : this.state.selectedRegion, equipo : equipo});
    }

    deleteEquipo = (equipo) => {
        console.log('equipo a eliminar', equipo);
        firebase.database().ref('equipo/' + this.state.selectedRegionText + '/' + this.userInfo.id + '/' + equipo.key).remove()
            .then(data => {
                console.log('dato eliminado', data);
            })
            .catch(err => {
                console.log('error al eliminar dato', err);
            })
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
                            <TouchableRipple onPress={this.openMenu}>
                                <TextInput
                                    label="Región"
                                    mode="outlined"
                                    pointerEvents="none"
                                    editable={false}
                                    value={this.state.selectedRegionText}
                                    onChangeText={name => this.setState({selectedRegionText : name }) }
                                    right={ <TextInput.Icon name="chevron-down" onPress={this.openMenu}/> }
                                />
                            </TouchableRipple>
                        }>
                        {this.state.menuItems}
                    </Menu>
                    <View style={{ marginTop : 15 }}>

                    {this.state.listEquipos.length == 0 && (
                        <Card>
                            <Card.Title title="Sin resultados"></Card.Title>
                            <Card.Content>
                                <Paragraph>Parece que no posees equipos en esta región</Paragraph>
                            </Card.Content>
                        </Card>
                    )}
                    {this.state.listEquipos.map((equipo) => (
                        <TouchableRipple 
                            key={equipo.key}
                            onPress={() => this.goToEditEquipo(equipo)}>
                            <List.Item
                                title={equipo.data.name}
                                description={`Código : ${equipo.data.key}`}
                                left={props => <List.Icon {...props} icon="pokemon-go" />}
                                right={
                                    props => 
                                        <TouchableRipple onPress={() => this.deleteEquipo(equipo)}>
                                            <List.Icon {...props} icon="delete" />
                                        </TouchableRipple>
                                    }
                            />
                        </TouchableRipple>
                    ))}
                    </View>

                    
                    
                </View>

                <View style={{ flex : 1, position : 'absolute', width : '100%', bottom : 15, flexDirection : 'row', justifyContent : 'center', alignItems : 'center' }}>
                        <Button 
                            style={{ borderRadius : 30, marginRight : 5 }} 
                            icon="plus" 
                            mode="contained"
                            onPress={() => this.goToAddEquipo()}>Crear equipo</Button>
                        <Button 
                            style={{ borderRadius : 30, marginLeft : 5 }} 
                            icon="plus" 
                            mode="outlined"
                            onPress={() => this.goToAddEquipo()}>ingresar código</Button>
                    </View>
            </Provider>
        );
    }
}

export default Equipos;