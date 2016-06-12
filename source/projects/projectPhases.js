'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    ListView,
    TouchableHighlight,
} from 'react-native';

import { height, width } from '../utilities/constants'


class ProjectPhases extends Component {

    constructor(props) {
       super(props);
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    showImage(uri) {

    }

    rederItem(phase) { //alert(phase.Details.length)
        let images = [];
        for(var i = 0; i < phase.Details.length; i++) {
            let imageDetails = phase.Details[i];
            let imageDetails2 = null;
            if(i + 1 < phase.Details.length) {
                imageDetails2 = phase.Details[i + 1];
            }
            ///Content/images/viedo-defult-v2.jpg

            if(!imageDetails.$ref && imageDetails.AttachmentPath) {

                let uri = imageDetails.PortalExternalPath + imageDetails.AttachmentPath.substring(1) + imageDetails.AttachmentFile;
                let extension = uri.substring(uri.lastIndexOf('.'));
                if(extension == '.mp4') {
                    uri = 'https://www.qcharity.org/Content/images/viedo-defult-v2.jpg';
                }
                //alert(uri)
                let rowImages = [];
                rowImages.push(
                    <TouchableHighlight key={'img'+i} onPress={() => this.showImage(uri)} 
                                style={[styles.item, styles.iconTouch]} underlayColor={'transparent'}>
                        <View style={[styles.item,]}>
                            <Image source={{uri: uri}} style={{width: itemWidth, height: itemWidth + 50,}} />
                            <View style={styles.titleWrapper}><Text style={styles.title}>{imageDetails.AttachmentType}</Text></View>
                        </View>
                    </TouchableHighlight>
                );

                if(imageDetails2 != null) {
                    let uri2 = imageDetails2.PortalExternalPath + imageDetails2.AttachmentPath.substring(1) + imageDetails2.AttachmentFile;
                    let extension2 = uri2.substring(uri.lastIndexOf('.'));
                    if(extension2 == '.mp4') {
                        uri2 = 'https://www.qcharity.org/Content/images/viedo-defult-v2.jpg';
                    }
                    rowImages.push(
                        <TouchableHighlight key={'img' + (++i)} onPress={() => this.showImage(uri2)} 
                                style={[styles.item, styles.iconTouch]} underlayColor={'transparent'}>
                            <View style={[styles.item,]}>
                                <Image source={{uri: uri2}} style={{width: itemWidth, height: itemWidth + 50, flex: 1,}} />
                                <View style={styles.titleWrapper}><Text style={styles.title}>{imageDetails2.AttachmentType}</Text></View>
                            </View>
                        </TouchableHighlight>
                    );
                }

                images.push(<View key={i} style={{flexDirection: 'row',}}>
                    {rowImages}
                </View>);
            }
        }
        return (
            <View>
                <Text style={styles.phaseTitle}>{phase.PhaseGroupName} | {phase.PhaseName}</Text>
                <View>
                    {images}
                </View>
            </View>
        );
    }
    
    render() {
        return ( 
            <ListView
                dataSource={this.props.dataSource}
                renderRow={this.rederItem.bind(this)}
                initialListSize={1}
                style={{flex: 1,}}
                contentContainerStyle={[styles.contentContainer]} />
        );
    }
}
var itemWidth = (width - 10) / 2;
var styles = StyleSheet.create({
    contentContainer: {
        width: width - 10,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center', 
        justifyContent:'flex-start',
    },
    phaseTitle: {
        textAlign: 'right',
        fontSize: 14,
        color: '#000000',
        paddingRight: 20,
        width: width - 10,
        marginBottom: 20,
        marginTop: 20,
        fontFamily: 'Janna New R',
    },
    iconTouch: {
        marginLeft: 2,
        marginRight: 2,
    },
    item: {
        width: itemWidth,
        height: itemWidth + 50,
        marginBottom: 8,
    },
    titleWrapper: {
        flex: 1,
        width: itemWidth,
        height: 50,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center', 
        justifyContent:'center',
        paddingRight: 10,

    },
    title: {
        flexWrap: 'nowrap',
        width: itemWidth,
        lineHeight: 25,
        color: 'white',
        fontSize: 14,
        textAlign: 'right',
        fontFamily: 'Janna New R',
    },
});
module.exports = ProjectPhases;