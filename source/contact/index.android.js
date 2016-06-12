/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text, 
    Image,
    Picker,
    TouchableWithoutFeedback,
    View
} from 'react-native';
 
var Mapbox = require('react-native-mapbox-gl');
var mapRef = 'mapRef';

class Contact extends Component {
    constructor(props){
        super(props);
        this.state = {
            mixins: [Mapbox.Mixin],
            annotations: [
                {
                    coordinates: [25.2590171, 51.5378095],
                    type: 'point',
                    title: 'English Description1',                
                    id: 'marker1',
                    annotationImage: {
                      url: 'http://teamtalentelgia.com/collector-btn.png',
                      height: 25,
                      width: 25
                    }
                }
            ],
            center: {
                latitude: 25.2590171,
                longitude: 51.5378095
            },
            title: "اتصل بنا",
            phone: "هاتف",
            email: "البريد الإلكتروني"
        };
    }

    componentDidMount() {
        let isArabic = this.props.isArabic;  
        this.setState({title : ((isArabic == true )? "اتصل بنا" : "Contact Us" )}); 
        this.setState({phone : ((isArabic == true )? "هاتف" : "Phone" )});  
        this.setState({email : ((isArabic == true )? "البريد الإلكتروني" : "Email" )});
    }

    render() {
        return ( <View style={styles.container}>
                    <View style={styles.titlecontainer}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <View style={styles.iconwrapper}>
                            <Image style={styles.topicon}
                                   source={require('../../contents/icons/face@1.5x.png')}
                            />
                        </View>
                    </View>                    
                    <View style={styles.infocontainer}>
                        <View style={styles.fieldwrapper}>
                            <Text style={styles.fieldtext}>{this.state.phone}</Text>
                        </View>
                        <View style={styles.valuewrapper}>
                            <Text style={styles.valuetext}>009744667711</Text>
                        </View>                        
                    </View>
                    <View style={styles.infocontainer}>
                        <View style={styles.fieldwrapper}>
                            <Text style={styles.fieldtext}>{this.state.email}</Text>
                        </View>
                        <View style={styles.valuewrapper}>
                            <Text style={styles.valuetext}>info@qcharity.org</Text>
                        </View>                        
                    </View>  
                    <View style={styles.mapcontainer}>
                        <Mapbox
                            annotations={this.state.annotations}
                            accessToken={'pk.eyJ1IjoidGFsZW50ZWxnaWEiLCJhIjoiY2lvNGRheDh5MDFocncza2o4YjlrZGpodSJ9.VEZSErgB0-ah8gfDsp8X7Q'}
                            centerCoordinate={this.state.center}
                            debugActive={false}
                            ref={mapRef}
                            direction={10}                            
                            rotateEnabled={true}
                            scrollEnabled={true}
                            style={styles.mapview}
                            showUserLocation={true}
                            zoomEnabled={true}
                            zoomLevel={10}                              
                            compassIsHidden={true}
                            logoIsHidden={true}                                                 
                        />
                    </View>                 
                 </View>
               );
    }   
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#ffffff',
        paddingTop:10,
        paddingBottom: 10,
        paddingLeft:20,
        paddingRight: 20,
        marginBottom:50
    }, 

    titlecontainer: {
        flexDirection: 'row',        
        height:35,
        borderBottomColor: '#b7b7b7',
        borderBottomWidth: 1,
        marginBottom: 10
    },
    title: {
        color: '#000000',
        fontSize: 14,
        fontWeight: 'bold',        
        top: 6     
    }, 
    iconwrapper: {
        flex: 1
    },
    topicon: {
        width: 30,
        height:30,
        right:0,
        top:0,
        position: 'absolute'
    },

    infocontainer: {
        flexDirection: 'row',        
        height:35,
        marginBottom: 10
    },     
    fieldwrapper: {
        flex: 0.3,
        backgroundColor: "#298d9c",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 8
    },
    fieldtext: {
        flex: 1,
        color: "#ffffff",        
        textAlign: "center"
    },
    valuewrapper: {
        flex: 0.7,
        backgroundColor: "#efefef",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 8
    },
    valuetext: {
        flex: 1,
        color: "#474747",
        textAlign: "center"
    },

    mapcontainer: {
        flex:1,
        flexDirection: "row",       
        paddingTop: 10,        
        borderTopWidth: 1,
        borderTopColor: "#b7b7b7"
    },
    mapview: {
        flex: 1
    }
});

module.exports = Contact;