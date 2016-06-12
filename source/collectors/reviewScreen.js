import React, { Component } from 'react';
import {
  StyleSheet,
  AsyncStorage,
  Text,
   View,Alert,Image,TouchableHighlight,
} from 'react-native';

var Mapbox = require('react-native-mapbox-gl');
var mapRef = 'mapRef';

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
const DropDown = require('react-native-selectme');

const {
  Select,
  Option,
  OptionList, 
  updatePosition
} = DropDown;

import StarRating from 'react-native-star-rating';
//import Spinner from 'react-native-loading-spinner-overlay';
let QCLoading =  require('../../qcLoading');
var STORAGE_KEY = '@QcApploginData:key';
var RequestStorageKey='@QcRequestID:key';
var ReviewScreen = React.createClass({
  
  getInitialState:function(){
    
    return {
      user:{},
      requestID:this.props.request,
      selectedAgent:this.props.agent,
      reviewValues:[],
      review:'',
      ratingCount:3,
      loader:false,
      
    }
  },
  componentWillMount:function(){
   var self=this;
   AsyncStorage.getItem(STORAGE_KEY).then((value) => {
        this.setState({
          user:JSON.parse(value),
      });
    }).done(function(){
   // fetching the review values
   fetch('http://servicestest.qcharity.org/api/Track/GetReviewsForDonor', {  
                        method: 'GET',
                        headers: {
                          'Accept': 'application/json', 
                          'Content-Type': 'application/json',
                        }
                      }).then((response) => response.json()) 
                        .then((responseData) => { 
                          if(responseData){
                                 self.setState({reviewValues:responseData});
                                 self.setState({review:self.state.reviewValues[0].ProcessReviewId});
                               }
      }) .catch((error) => {// alert(error); 
      }).done(); 

    });
   
  },
  _reviewOption:function(reviewId){
    this.setState({review:reviewId});
  },
   _getOptionList:function() {
    return this.refs['OPTIONLIST'];
  },
  _renderReviewOptions:function(){

       if(this.state.reviewValues.length){
        return (
          <Select
              style={{borderColor:'#000',borderWidth:0}}
                width={200}
               
                ref="SELECT1"
                optionListRef={this._getOptionList}
                onSelect={this._reviewOption}
                >
                {
                  this.state.reviewValues.map(function(values){
                    return <Option id={values.ProcessReviewId} key={values.Name}>{values.Name}</Option>
                  })
                }
          </Select>
          );
       }
  } , 
  onStarRatingPress:function(rating) {
    this.setState({
      ratingCount: rating
    });
  },
  _renderAgentImage:function(){
    if(this.state.selectedAgent.image){
          return <Image style= {{ borderRadius:50,height:120, width:120}} source={{uri:this.state.selectedAgent.image}} />
        }else{
        return <Image  source={require('../../contents/icons/collector@1.5x.png')} />
       }
                  
  },
  _submitReview:function(){
    var self=this;
    self.setState({loader:true});
    var DonorID=(self.state.user.DonorId) ? self.state.user.DonorId : self.state.user.DonorID;
    fetch('http://servicestest.qcharity.org/api/Track/DonorReview?DonorId='+DonorID+'&RequestId='+this.state.requestID+'&Stars='+this.state.ratingCount+'&ReviewId='+this.state.review, {  
                        method: 'GET',
                        headers: {
                          'Accept': 'application/json', 
                          'Content-Type': 'application/json',
                        }
                      }).then((response) => response.json()) 
                        .then((responseData) => { self.setState({loader:false});
                          //Alert.alert("responseData",JSON.stringify(responseData));
      }) .catch((error) => { self.setState({loader:false}); //alert(error); 
    }).done(function(){ self.setState({loader:false});
            AsyncStorage.removeItem(RequestStorageKey,function(){
                self.props.navigator.push({
                            id:'Collectors',
                            title: 'المحصل المنزلي',
                        });
            });
            
      }); 
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
            <View>
                <View style={{position:'absolute',top:(windowSize.height/20),left:((windowSize.width/20))}}><Image source={require('../../contents/icons/face@1.5x.png')} /></View>
                <View style={{alignItems:'center',padding:20}}>
                 {this._renderAgentImage()}
                  <Text style={{marginTop:10,fontWeight:'bold'}}>{this.state.selectedAgent.name}</Text>
                  <View style={{padding:20}}>
                    <StarRating
                    starColor={'#d2b335'}
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    disabled={false}
                    maxStars={5}
                    rating={this.state.ratingCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                  />
                  </View>
                  
                    {this._renderReviewOptions()}

                     </View>              
              </View>
                   <OptionList overlayStyles={{backgroundColor:'#000',opacity:0.8}}  ref="OPTIONLIST"/> 
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
login_btn_container:{
        width:120,
        height:45,
    },
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

module.exports=ReviewScreen