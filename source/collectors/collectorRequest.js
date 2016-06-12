'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    AsyncStorage,
    Text,
    StatusBar,
    View,
    Alert,
    Modal,
    Image,
    TouchableHighlight,
} from 'react-native';

var Mapbox = require('react-native-mapbox-gl');
var mapRef = 'mapRef';
import { height, width, text, } from '../utilities/constants';

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
let QCLoading =  require('../../qcLoading');
let isArabic = true;
import Communications from 'react-native-communications';

var STORAGE_KEY = '@QcApploginData:key';
var RequestStorageKey='@QcRequestID:key';

var CollectorRequest = React.createClass({
    mixins: [Mapbox.Mixin],
    getInitialState:function() {
        return {
            center: {
                latitude: 25.2512423,
                longitude: 51.5388977
            },
            loader:false,
            currentPosition:'',
            annotations: [],
            user:{},
            requestID:'',
            agent:null,
            animationType: 'none',
            transparent: false,
            requestModal:false,
            hasAgents:false,
            selectedAgent:null,
            requestCancelModal:false,
            requestStatus:0,
        }
    },
    componentWillMount:function(){
        //this.removeAllAnnotations(mapRef);
        var self=this;
       var IntervalID;
        navigator.geolocation.getCurrentPosition( (position) => { 
            var initialPosition = JSON.stringify(position);
            this.setState({currentPosition:JSON.parse(initialPosition)}); },
            (error) => Alert.alert("Error","Unable to find your Location. Please turn on your location"),
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000} 
           );
           
          AsyncStorage.getItem(STORAGE_KEY).then((value) => {
            this.setState({
              user:JSON.parse(value),
          });
        }).done();
        AsyncStorage.getItem(RequestStorageKey).then((value) => {
                  self.setState({requestID:value});
               }).done();
         IntervalID=setInterval(function(){//alert(self.state.requestID)
          if(self.state.currentPosition.coords && self.state.requestID){
               self._requestAgentList(mapRef,self.state.requestID);
               clearInterval(IntervalID);
           }
         },100);
    },
    componentDidMount:function(){ 
        isArabic = this.props.isArabic;
        var self=this;
        var intervalId;
        intervalId=setInterval(function(e){
            if(self.state.hasAgents && (self.state.requestStatus!=4 || self.state.requestStatus!=5)){ 
                if(self.state.requestStatus==5){
                    self.props.navigator.push({
                        id:'ReviewScreen',
                        request:self.state.requestID,
                        agent:self.state.selectedAgent
                    });
                    clearInterval(intervalId);
                }
                else if(self.state.requestStatus==4){
                    self.props.navigator.push({
                        id:'Collectors',
                        title: 'المحصل المنزلي',
                    });
                    clearInterval(intervalId);
                }
                else{
                  self._getSelectedAgentInfo(self.state.agent);    
                }
            }
            if(self.state.hasAgents && self.state.requestStatus==2){
                self.removeAllAnnotations(mapRef);
                var annotation=[{
                    coordinates: [parseFloat(self.state.agent.Lat),parseFloat(self.state.agent.Long)],
                              type: 'point',
                              id: self.state.agent.AgentId,
                              annotationImage: {
                                  url: 'http://teamtalentelgia.com/collector-btn.png',
                                  height: 25,
                                  width: 25
                                }
                }];
                self.addAnnotations(mapRef,annotation);                
            }
        },3000);
    },
    _setrequestModalVisible:function(visible) {
        this.setState({requestModal: visible});
    },
    _disablerequestCancelModal:function(){
        this.setState({requestCancelModal:false});
    },
    _requestAgentCancel:function() {
        this._setrequestCancelModalVisible(true);
    },
    _cancelRequestAgent:function() {
        debugger;
        var self=this;
        self._disablerequestCancelModal();
        var DonorID=(self.state.user.DonorId) ? self.state.user.DonorId : self.state.user.DonorID; 
        fetch('http://servicestest.qcharity.org/api/Track/DonorCancelRequest?DonorId=' + DonorID 
            + '&RequestId=' + self.state.requestID, {  
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json()) 
        .then((responseData) => { 
            if(responseData.Result){
                // Alert.alert("Success",JSON.stringify(responseData));
                self.props.navigator.push({
                    id:'ReviewScreen',
                    passProps: {
                        request:self.state.requestID,
                        agent:self.state.selectedAgent,
                    },
                });
            }
            else {
                // Alert.alert("Failure",JSON.stringify(responseData));
            } 
        })
        .catch((error) => {})
        .done(function() {
            self.removeAllAnnotations(mapRef);
            self.setState({hasAgents:false});
        });
    },
    _setrequestCancelModalVisible:function(visible) {
        this.setState({requestCancelModal: visible});
    },
    _disablerequestModal:function(){
        this.setState({requestModal:false});
    },
    _updateMap:function(map,gender) {debugger;
        this._disablerequestModal();
        var self=this;
        self.setState({loader:true});
        var DonorID=(self.state.user && self.state.user.DonorId) ? self.state.user.DonorId : 0;
        if(DonorID > 0) {
            fetch('http://servicestest.qcharity.org/api/Track/DonorRequestAgent?DonorId=' + DonorID
                + '&Sex=' + gender 
                + '&Long=' + this.state.currentPosition.coords.longitude + '&Lat=' + this.state.currentPosition.coords.latitude, {  
                method: 'GET',
                headers: {
                  'Accept': 'application/json', 
                  'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json()) 
            .then((responseData) => { 
                if(responseData.Result){
                    // Alert.alert("Success",JSON.stringify(responseData));
                    self.setState({loader:false});
                    self.setState({requestID:responseData.RequestId});
                    AsyncStorage.setItem(RequestStorageKey, JSON.stringify(responseData.RequestId), function() {
                        self._requestAgentList(map,responseData.RequestId);
                    });
                        
                }
                else {
                    self.setState({loader:false});
                    //Alert.alert("Failure",JSON.stringify(responseData));
                } 
            })
            .catch((error) => { 
                self.setState({loader:false});
                // alert(error);
            }).done();
        }
    },    
    _getSelectedAgentInfo:function(agent) {
        var self=this;
        var DonorID=(self.state.user && self.state.user.DonorId) ? self.state.user.DonorId : 0;
        if(DonorID > 0) {
            fetch('http://servicestest.qcharity.org/api/track/GetAgentInformationWithRequestStatus?DonorId=' + DonorID
                + '&AgentId=' + agent.AgentId, {  
                method: 'GET',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json()) 
            .then((responseData) => {
                //Alert.alert("RequestRes",JSON.stringify(responseData));
                if(responseData) {
                    var agentinfo = {
                        id:agent.AgentId,
                        name:responseData.Name,
                        age:responseData.Age,
                        image:responseData.Image,
                        mobile:responseData.Mobile,
                        lat:responseData.Lat,
                        long:responseData.Long,
                        distance:agent.Distance,
                        hours:agent.Hours,
                        mints:agent.Minits,
                    };
                    self.setState({selectedAgent:agentinfo});
                    self.setState({requestStatus:responseData.RequestStatusId});
                }
            })
            .catch((error) => { // alert(error);
            }).done(); 
        }
    },
    _requestAgentList:function(map,_requestID){
        var self=this;
        var agentsData=[];
        self.setState({loader:true});
        var DonorID=(self.state.user.DonorId) ? self.state.user.DonorId : 0;
        if(DonorID > 0) {
            fetch('http://servicestest.qcharity.org/api/Track/GetDonorNearestAgents?DonorId='
                + DonorID 
                + '&Long=' + this.state.currentPosition.coords.longitude 
                + '&Lat=' + this.state.currentPosition.coords.latitude
                + '&RequestId=' + _requestID, {  
                method: 'GET',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json()) 
            .then((responseData) => { 
                if(responseData.lstNearestAgent.length > 0) {
                    self.setState({loader:false});
                    self.setState({hasAgents:true});
                    var agentList=responseData.lstNearestAgent;
                    var i=0;
                    agentList.sort(function(a,b) {
                        return (a.Distance > b.Distance) ? 1 : ((b.Distance > a.Distance) ? -1 : 0);
                    });
                    //Alert.alert("AgentData",JSON.stringify(agentList));
                    agentList.forEach(function(agent) {
                        if(i==0) {
                            self.setState({agent:agent});
                            self._getSelectedAgentInfo(agent);
                        }
                        agentsData[i]={
                            coordinates: [parseFloat(agent.Lat),parseFloat(agent.Long)],
                            type: 'point',
                            id: agent.AgentId,
                            annotationImage: {
                                url: 'http://teamtalentelgia.com/collector-btn.png',
                                height: 25,
                                width: 25
                            }
                        };
                        i++;   
                    });  
                }
            })
            .catch((error) => { 
                self.setState({loader:false}); //alert(error); 
            })
            .done(function() {
                self.setState({loader:false});
                self.removeAllAnnotations(map);
                self.addAnnotations(map,agentsData); 
            });
        }
    },
    _renderRequstmodel:function() {
        if(this.state.requestModal) {
            let selectText = isArabic ? 'اختر نوع المحصل' : 'Select a Gender';
            let femaleText = isArabic ? 'أنثى' : 'Female';
            let maleText = isArabic ? 'ذكر' : 'Male';

            return (
                <Modal animationType={this.state.animationType}
                    transparent={this.state.transparent} visible={this.state.requestModal}
                    onRequestClose={() => {this._disablerequestModal}}>
                    <View style={[styles.modal_container,{backgroundColor:'rgba(0, 0, 0, 0.5)'}]}>
                        <View style={[styles.modal_innerContainer, {backgroundColor: '#fff'}]}>
                            <View>
                                <View style={{padding:20,flex:1,borderBottomWidth:1,borderColor:'#ccc'}}>
                                    <Text style={[text]}>{selectText}</Text>
                                </View>
                                <View style={{padding:10,left:-20,top:20}}>
                                    <TouchableHighlight onPress={() => this._updateMap(mapRef,'F')}>
                                        <Text style={[text]}>{femaleText} <Image source={require('../../contents/icons/female@1.5x.png')} /></Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={{padding:10,right:-80,top:-30}}>
                                    <TouchableHighlight onPress={() => this._updateMap(mapRef,'M')} >
                                        <Text style={[text]}>{maleText} <Image source={require('../../contents/icons/male@1.5x.png')} /></Text>
                                    </TouchableHighlight>
                                </View>
                            </View>                                
                        </View>
                    </View>
                </Modal>
            );
        }
    }, 
    _renderAgentImage:function() {
        if(this.state.selectedAgent.image) {
            return <Image style= {{ borderRadius:40,height:110, width:110}} source={{uri:this.state.selectedAgent.image}} />
        }
        else {
            return <Image  source={require('../../contents/icons/collector@1.5x.png')} />
        }
    },
    _renderCollectorInfo:function(){
        if(this.state.hasAgents && this.state.selectedAgent && this.state.requestStatus==2) {
            let hoursText = isArabic ? 'ساعات' : 'Hours';
            let minText = isArabic ? 'دقائق' : 'Minutes';
            let arriveText = isArabic ? 'ليصل' : 'to arrive';

            return(
                <View style={{height:(windowSize.height/3.5)}}>
                    <View style={{alignItems:'center',bottom:(windowSize.height/30)}}>
                        <View  style={{position:'absolute',top:(windowSize.height/12),left:(windowSize.width/12)}}>
                            <TouchableHighlight onPress={()=>{this._requestAgentCancel()}}>
                                <Image   source={require('../../contents/icons/cancel-btn-normal@1.5x.png')} />
                            </TouchableHighlight>
                        </View>
                        <View style={{position:'absolute',top:(windowSize.height/18),left:(windowSize.width/3)}}>{this._renderAgentImage()}</View>
                        <View style={{position:'absolute',top:(windowSize.height/12),left:(windowSize.width)-(windowSize.width/3.5)}}>
                            <TouchableHighlight onPress={()=>Communications.phonecall(this.state.selectedAgent.mobile,true)}>
                                <Image source={require('../../contents/icons/call-btn-normal@1.5x.png')} />
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{alignItems:'center',bottom:-(windowSize.height/5)}}>
                        <Text style={[text]}>{this.state.selectedAgent.name}</Text>
                        <Text style={[text]}>{this.state.selectedAgent.hours} {hoursText} {this.state.selectedAgent.mints} {minText} {arriveText}</Text>
                    </View>
                </View>
            );
        }
    },
    _renderCancelPopup:function(){
        if(this.state.requestCancelModal) {
            let question = isArabic ? 'هل ترغب فعلا في إلغاء الطلب؟' : 'Are you sure you want to cancel request?';
            let yes = isArabic ? 'نعم' : 'Yes';
            let no = isArabic ? 'لا' : 'No';
            return (
                <Modal animationType={this.state.animationType}
                    transparent={this.state.transparent} visible={this.state.requestCancelModal}
                    onRequestClose={() => {this._disablerequestCancelModal}}>
                    <View style={[styles.modal_container,{backgroundColor:'rgba(0, 0, 0, 0.5)'}]}>
                        <View style={[styles.modal_innerContainer, {backgroundColor: '#fff'}]}>
                            <View>
                                <View style={{padding:20,flex:1,borderBottomWidth:1,borderColor:'#ccc'}}>
                                    <Text style={[text]}>{question}</Text>
                                </View>
                                <View style={{padding:10,left:-10,top:20}}>
                                    <TouchableHighlight onPress={() => this._cancelRequestAgent()}>
                                        <Text style={[styles.login_button, text]} >{yes}</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={{padding:10,right:-140,top:-45}}>
                                    <TouchableHighlight onPress={() => this._disablerequestCancelModal()}>
                                        <Text style={[styles.button, text]}>{no}</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>                                
                        </View>
                    </View>
                </Modal>
            );
        }
    },
    _renderRequestButton:function(){
        if(!this.state.hasAgents && this.state.currentPosition.coords && !this.state.requestID){
            let titleText = isArabic ? 'طلب محصل منزلي' : 'Request a Agent';
            return (
                <View  style={{justifyContent:'center',padding:20,marginLeft:80}}>
                    <TouchableHighlight onPress={this._requestAgent}>
                        <Text style={[styles.login_button, text]}>{titleText}</Text>
                    </TouchableHighlight>
                </View>
            );
        }
        else if(this.state.requestStatus==1 || this.state.requestStatus==7) {
            let titleText = isArabic ? 'لقد تم إرسال طلبك بنجاح. انتظر الرد.' : 'Request has been sent, waiting for response!';
            return(
                <View  style={{alignItems:'center',padding:20}}>
                    <Text style={[text]}>{titleText}</Text>
                </View>
            );
        }
    },  
    _requestAgent:function(){
        this._setrequestModalVisible(true);
    },
    render:function(){
        let loading = null;
        if(this.state.loader) {   
            loading = (
                <QCLoading />
            );
        }
        return (
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <Mapbox
                        annotations={this.state.annotations}
                        accessToken={'pk.eyJ1IjoidGFsZW50ZWxnaWEiLCJhIjoiY2lvNGRheDh5MDFocncza2o4YjlrZGpodSJ9.VEZSErgB0-ah8gfDsp8X7Q'}
                        centerCoordinate={this.state.center}
                        debugActive={false}
                        direction={10}
                        ref={mapRef}
                        //onRegionChange={this.onRegionChange}
                        rotateEnabled={true}
                        scrollEnabled={true}
                        style={styles.container}
                        showsUserLocation={true}
                        styleURL={this.mapStyles.emerald}
                        //userTrackingMode={this.userTrackingMode.none}
                        zoomEnabled={true}
                        zoomLevel={10}
                        compassIsHidden={true}
                        logoIsHidden={true} />
                </View>
                {this._renderRequestButton()}
                {this._renderRequstmodel()}
                {this._renderCollectorInfo()}
                {this._renderCancelPopup()}
                {loading}
            </View>
        );
    }
});

var styles = StyleSheet.create({   
    container: {
        flex: 1,
        backgroundColor:'rgb(232, 232, 232)',
        shadowColor:'rgb(255,255,255)',
        marginBottom: 50,
    },  
    container_top_bar:{
        marginTop:20,
        height:40,
    },
    body:{
        backgroundColor:'rgb(82, 89, 95)',
        shadowColor:'rgb(255,255,255)',
    },
    whiteFont: {
        color: '#FFF'
    },   
    login_btn_container:{
        width:140,
        height:45,
    },
    left_button:{
        position: 'absolute',
        left: 30,
        top: 5,
        right: 0,
        height: 30,
        fontSize: 14
    },
    /*login_btn_container:{
        width:120,
        height:45,
    },*/
    button:{
        backgroundColor:'#0f9eac',
        width:120,
        color:'#FFF',
        height:35,
        marginTop:10,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
        fontSize:16,
    },
    right_button:{
        position: 'absolute',
        top: 5,
        right: 30,
        height: 30,
        fontSize: 14
    },
    login_button:{
        backgroundColor:'#fe345a',
        width:140,
        color:'#FFF',
        height:35,
        marginTop:10,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
        fontSize:16,
        padding:10
    },
    modal_container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    modal_innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
    },
    modal_row: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
});

module.exports=CollectorRequest