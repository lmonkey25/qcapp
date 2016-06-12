'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    View,
    Text,
    TextInput,
    Image,
    TouchableHighlight,
} from 'react-native';

var Contacts = require('react-native-contacts');
import LocalizedStrings from 'react-native-localization';
import { height, width, text, } from '../utilities/constants';

let QCLoading =  require('../../qcLoading');
var GlobalResource = require('./GlobalResource');
let CharityCheckbox = require('../sharedControls/qcCheckboxVIcon');
var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/';

var i = 0;
var selectedUsers = [];
var inProcess = false;

var userId = null;
let isArabic = true;

class AddMember extends Component {
    
    constructor(props) {
       super(props);
       
       this.state = {
            inProcess: true,
            lastKeyword: '',
            allContacts: [],
            dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2
           }),
       };
    }
    
    componentDidMount() {
        isArabic = this.props.isArabic;
        stringsGlobal.setLanguage(isArabic ? 'ar' : 'en');
        stringsLocal.setLanguage(isArabic ? 'ar' : 'en');

        Contacts.getAll((err, contacts) => {
            if(err && err.type === 'permissionDenied'){
                alert("You didn't give permission to this app to access your contact list");
                this.setState({ inProcess: false });
            } 
            else {
                this.setState({ allContacts: contacts, inProcess: false });
            }
        });
    }
    
    searchContacts(keyword, forceReFetch) {
    
        selectedUsers = [];
        var lastKeyword = this.state.lastKeyword;
        var searchKeyword = lastKeyword.trim();
        if(searchKeyword != null && searchKeyword != '') {
            this.setState({inProcess: true,});
            var result = [];
            var contactFound = false;
            var allContact= this.state.allContacts;
            for(var i =0; i < allContact.length; i++) {
                var currentContact = allContact[i];
                if(currentContact && (currentContact.familyName ||
                currentContact.givenName)) {
                    var stringToSearchIn = currentContact.familyName + ' ' + currentContact.givenName;
                    if(stringToSearchIn.indexOf(searchKeyword) > -1) {
                        result.push(currentContact);
                    }
                }
            }
            
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result),
                inProcess: false,
            });
        }
    }
    
    fetchData(keyword, forceReFetch) {
        selectedUsers = [];
        var lastKeyword = this.state.lastKeyword;
        //this.setState({ lastKeyword: keyword, });
        var searchKeyword = lastKeyword.trim();//'محمد صلاح';
        //alert(searchKeyword);
        if(searchKeyword != null && searchKeyword != '') {/*alert('ok');*/
            if(true/*forceReFetch || (searchKeyword.toLowerCase() != lastKeyword.toLowerCase())*/) {
                var url = encodeURI(REQUEST_URL + this.props.group.GroupId + '/members/invitatable/' + searchKeyword);
                //alert(url);
                this.setState({inProcess: true,});
                var thisObj = this;
                fetch(url)
                .then((response) =>  {
        
                    response.json()
                    .then((responseData) => {
                
                        if(response.status == 201 || response.status == 200) {  
                            thisObj.setState({
                                dataSource: thisObj.state.dataSource.cloneWithRows(responseData),
                                inProcess: false,
                            });
                        }
                        else {alert('Bad Request');
                            thisObj.setState({inProcess: false});
                        }
                    });
                })
                /*.then((responseData) => {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(responseData),
                        inProcess: false,
                    });
                })*/
                .done();
            }
            else {
                
            }
        }
        else {
            this.setState({
                lastKeyword: '',
                dataSource: this.state.dataSource.cloneWithRows({}),
                inProcess: false,
            });
        }
    }
    
    goAddMemers() {
    //alert('ok');
        if(selectedUsers.length > 0) {
            var index = 0; 
            inProcess = true;
            this.setState({
                inProcess: true,
            });
            while(index < selectedUsers.length) {
                
                //var invited = this.inviteMember(index, this);
                this.inviteContact(selectedUsers[index], index, this);
                /*if(!invited) {
                    break;
                }  */               
                index++;
            }
        }
        else {alert(stringsLocal.selectUser);}
    }
    
    inviteContact(recordID, index, classObj) {
        var contact = null;
        var allContacts = this.state.allContacts;
        for(var i = 0; i < allContacts.length; i++) {
            if(allContacts[i].recordID == recordID) {
                contact = allContacts[i];
            }
        }
        
        if(contact && contact != null) {
            var phoneNumbers = contact.phoneNumbers;
            if(phoneNumbers && phoneNumbers.length > 0) {
                for(var j = 0; j < phoneNumbers.length; j++) {
                    var phone = phoneNumbers[j].number;
                    /*phone = phone.replace('-', '');
                    phone = phone.replace(' ', '');*/
                    //alert(phone);
                    let initationURL = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/' 
                            + this.props.group.GroupId+'/members/inviteByPhone/' 
                            + phone.replace(/\D/g,'');
                    //alert(initationURL);
                    fetch(initationURL, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },      
                    })
                    .then(function (response) {//alert(response.status);
                        if(response.status == 403) {
                            alert(stringsLocal.userIsNotRegistered.replace("{0}",
                                    phone));
                        }
                        else if(response.status == 400) {
                            alert(stringsLocal.serverError);
                        }
                        if(index == selectedUsers.length - 1) {
                            inProcess = false;
                            classObj.searchContacts(classObj.state.lastKeyword, true);
                        
                            if(response.status == 201) {
                                alert(stringsLocal.invitationSuccess.replace("{0}",
                                    classObj.props.group.GroupName));
                            }
                            else if (response.status == 200) { 
                                alert(stringsLocal.dublictedInvitation);
                            }
                            
                            classObj.setState({
                                inProcess: false,
                            });
                        }
                        else {
                            inProcess = true;
                        }
                        if(response.status == 201 || response.status == 200) {                  
                            return true;
                        }
                        else {
                            return false;
                        }
                    })
                    .catch (function (error) {
                        alert(stringsLocal.invitationError.replace("{0}", error));
                        inProcess = false;
                        return false;
                    });
                }
            }
        }
    }
    inviteMember(index, classObj) {
    
        var invited=fetch('http://portal.qcharity.net/QCPointsApiTest/api/groups/' 
                        + this.props.group.GroupId+'/members/invite/' 
                        + selectedUsers[index] , {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },      
        })
        .then(function (response) {
            if(index == selectedUsers.length - 1) {
                inProcess = false;
                classObj.fetchData(classObj.state.lastKeyword, true);
                        
                if(response.status == 201 || response.status == 200) { 
                    alert(stringsLocal.invitationSuccess.replace("{0}",
                                classObj.props.group.GroupName));
                    
                }
                classObj.setState({
                    inProcess: false,
                });
            }
            else {
                inProcess = true;
            }
            if(response.status == 201 || response.status == 200) {                  
                return true;
            }
            else {
                return false;
            }
        })
        .catch (function (error) {
            alert(stringsLocal.invitationError.replace("{0}", error));
            inProcess = false;
            return false;
        });
        return invited;
    }
    
    renderContact(user) {
        var points = user.TotalGainedPoints ? user.TotalGainedPoints : 0;
        var donorPhotoPath = user.thumbnailPath;
        var memberPic;
        if(donorPhotoPath && donorPhotoPath != '') {
            memberPic = {uri: donorPhotoPath};
        }
        else {
            memberPic = (user.IsMale ? require('../../contents/icons/MemberMale.png') :
                        require('../../contents/icons/MemberFemale.png'));
        }
        var memberDetails = (<View style={[stylesBase.rightContainer, styleLang.rightContainer]}>
                    <Text style={[stylesBase.title, styleLang.title, text]}>{user.givenName} {user.familyName}</Text>
                </View>);
        var memberImg = <Image source={memberPic}
                                style={[stylesBase.thumbnail, styleLang.thumbnail, {width: 70,}]} />;
                                
        var memberCheck = (
            <CharityCheckbox checked={false} label=''
                onChange={(checked, checkbox) => {
                    if(checked){selectedUsers.push(user.recordID);} 
                    else { 
                        var index = selectedUsers.indexOf(user.recordID);
                        if(index > -1){
                            selectedUsers.splice(index, 1);
                    }}
                }} />
        );
        var firstComponet, lastComponent;
        if(!isArabic) {
            firstComponet = memberCheck;
            lastComponent = memberDetails;
        }
        else {
            firstComponet = memberDetails;
            lastComponent = memberCheck;
        }
        return (
            <View style={[stylesBase.itemWrapper, styleLang.itemWrapper, ((i++ % 2) === 0) && stylesBase.evenItemWrapper,]}>
                {firstComponet}
                {memberImg}
                {lastComponent}
            </View>
        );
    }
     
    renderUser(user) {
        var points = user.TotalGainedPoints ? user.TotalGainedPoints : 0;
        var donorPhotoPath = user.DonorPhotoPath;
        var memberPic;
        if(donorPhotoPath && donorPhotoPath != '') {
            memberPic = {uri: donorPhotoPath};
        }
        else {
            memberPic = (user.IsMale ? require('../../contents/icons/MemberMale.png') :
                        require('../../contents/icons/MemberFemale.png'));
        }
        var memberDetails = (<View style={[stylesBase.rightContainer, styleLang.rightContainer]}>
                    <Text style={[stylesBase.title, styleLang.title, text]}>{user.FullName}</Text>
                    <View style={[stylesBase.pointsWrapper]}>
                        <Text style={[stylesBase.memberPoints, styleLang.memberPoints, text]}>{points} {stringsGlobal.points}</Text>
                    </View>
                </View>);
        var memberImg = <Image source={memberPic}
                                style={[stylesBase.thumbnail, styleLang.thumbnail, {width: 70,}]} />;
                                
        var memberCheck = (
            <CharityCheckbox checked={false} label=''
                onChange={(checked, checkbox) => {
                    if(checked){selectedUsers.push(user.DonorID);} 
                    else { 
                        var index = selectedUsers.indexOf(user.DonorID);
                        if(index > -1){
                            selectedUsers.splice(index, 1);
                    }}
                }} />
        );
        var firstComponet, lastComponent;
        if(!isArabic) {
            firstComponet = memberCheck;
            lastComponent = memberDetails;
        }
        else {
            firstComponet = memberDetails;
            lastComponent = memberCheck;
        }
        return (
            <View style={[stylesBase.itemWrapper, styleLang.itemWrapper, ((i++ % 2) === 0) && stylesBase.evenItemWrapper,]}>
                {firstComponet}
                {memberImg}
                {lastComponent}
            </View>
        );
    }
    
    render() {//alert(this.allContacts);
        
        var group=this.props.group;
        var groupIcon = (group.ImageVPath != null && group.ImageVPath != '' ? {uri: group.ImageVPath } : require('./icons/GroupDefault.png'));
        var groupIconStyle = (group.ImageVPath != null && group.ImageVPath != '' ? [stylesBase.thumbnail, stylesBase.groupImage] : stylesBase.thumbnail);
        
        var groupImg = (<Image source={groupIcon}
                                style={groupIconStyle} />);
        var groupDetails = (<View style={[stylesBase.rightContainer, styleLang.rightContainer]}>
                            <Text style={[stylesBase.title, styleLang.title, text]}>{this.props.group.GroupName}</Text>
                            <Text style={[stylesBase.details, styleLang.details, text]}>{this.props.group.TotalMembers} {stringsGlobal.member}</Text>
                        </View>);
        var firstGroupComponent, secondGroupComponent;
        if(!isArabic) {
            firstGroupComponent = groupImg;
            secondGroupComponent = groupDetails;
        }
        else {
            firstGroupComponent = groupDetails;
            secondGroupComponent = groupImg;
        }
        
        var btnAdd = (<TouchableHighlight 
                        style={[stylesBase.button, styleLang.button, this.state.inProcess ? {backgroundColor: 'gray'} : {}]}
                        onPress={(this.state.inProcess ? null : () => this.goAddMemers())}
                        underlayColor={this.state.inProcess ? 'gray' : '#06aebb'}>
                    <View style={stylesBase.btnWrapper}>
                        <Text style={[stylesBase.btnText, styleLang.btnText, text]}>{stringsLocal.add}</Text>
                    </View>
                </TouchableHighlight>);
        var inputAdd = (<View style={[stylesBase.searchWrapper]}>
                    <TextInput autoFocus={true} maxLength={55} 
                                placeholder={stringsLocal.inputPlaceholder}
                                style={[stylesBase.inputText, styleLang.inputText, text]}
                                placeholderTextColor={'#8a8a8a'}
                                onChangeText={(text) => this.setState({lastKeyword: text})}
                                //onSubmitEditing={(text) => this.fetchData(text)}
                                onSubmitEditing={(text) => this.searchContacts(text)}
                                value={this.state.lastKeyword} />
                    <TouchableHighlight 
                        style={[stylesBase.searchIcon, styleLang.searchIcon]}
                        //onPress={() => this.fetchData()}
                        onPress={() => this.searchContacts()}
                        underlayColor={'#06aebb'}>
                        <Image source={require('./icons/Search.png')} 
                                style={[stylesBase.searchIcon, styleLang.searchIcon]}/>
                    </TouchableHighlight>
                </View>);
        var firstAddComponent, secondAddComponent;
        if(!isArabic) {
            firstAddComponent = inputAdd;
            //secondAddComponent = btnAdd;
        }
        else {
            firstAddComponent = inputAdd;
            //secondAddComponent = inputAdd;
        }
        var loading = null;
        if(this.state.inProcess) {
            //ViewManagerUtil.showLoader();
            loading = <QCLoading />
        }
        
        return (
        <View style={stylesBase.container}>
            <View style={stylesBase.headerWrapper}>
                <View style={[stylesBase.header]}>
                    <View style={[stylesBase.headerDetails]}>
                        {firstGroupComponent}
                        {secondGroupComponent}
                    </View>
                    <View style={[stylesBase.headerPoints, styleLang.headerPoints]}>
                        <Text style={[stylesBase.points, text]}>{this.props.group.TotalPoints}</Text>
                        <Text style={[stylesBase.points, text]}>{stringsGlobal.points}</Text>
                    </View>
                </View>
            </View>
            <View style={[stylesBase.addMembers]}>
                {firstAddComponent}
                {/*secondAddComponent*/}
            </View>
            {loading}
            <ListView
                        dataSource={this.state.dataSource}
                        automaticallyAdjustContentInsets={false}
                        //renderRow={this.renderUser.bind(this.User)}
                        renderRow={this.renderContact.bind(this)}
                        initialListSize={1}
                        style={stylesBase.listView}
                        contentContainerStyle={{alignItems: 'stretch',}} />
            {btnAdd}
        </View>
        );
    }
}

let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
let stringsLocal = new LocalizedStrings({
    en: {
        selectUser: 'Please, select user(s) you want to add',
        invitationSuccess: 'Selected user(s) has been invited to join "{0}" group.',
        invitationError: 'Request failed {0}',
        inputPlaceholder: 'write a name',
        add: 'ADD',
        userIsNotRegistered: 'This phone number "{0}" is not registered at our system, and an error occurred while trying to register it.',
        serverError: 'Server Error',
        dublictedInvitation: 'This user is either invited or a member already',
    },
    ar: {
        selectUser: 'من فضلك، اختر المستخدمين المراد دعوتهم للإنضمام للمجموعة أولا.',
        invitationSuccess: 'لقد تم إرسال دعوة الانضمام لمجموعة "{0}" بنجاح.',
        invitationError: 'لم تنجح الدعوة {0}',
        inputPlaceholder: 'اكتب اسم المستخدم',
        add: 'أضف',
        userIsNotRegistered: 'الرقم {0} غير مسجل لدينا و تعذر تسجيله و دعوته للانضمام.',
        serverError: 'عفوا.. لقد حدث خطأ أثناء دعوة أحد الأشخاص.',
        dublictedInvitation: 'هذا الرقم اما ان يكون مدعو من قبل او انه بالفعل عضو بالمجموعة',
    },
});

var stylesBase = StyleSheet.create({
    pointsWrapper: {
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#06aebb',
        height:30,//width: 70,
        paddingHorizontal: 5,
    },
    memberPoints: { 
        color: '#fff',
    },
    header: {
        flex:1, 
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
    },
    headerDetails: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center', 
        margin: 8,
    },
    headerPoints: {
        position: 'absolute', 
        top:0, 
        bottom: 0,
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 40,
        backgroundColor: '#fe345a',
        width:70,
    },
    addMembers: {
        flex: 1, 
        flexDirection: 'row', 
        marginTop: 2,
    },
    searchWrapper: {
        backgroundColor: '#cac9cf', 
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3, 
        flex: 1,
    },
    inputText: {
        height: 30, 
        backgroundColor: 'white', 
        borderRadius: 0,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    searchIcon: {
        height: 25, 
        width: 25, 
        position: 'absolute', 
        top: 3,
    },
    button: {
        backgroundColor: '#06aebb',
        //width:70,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#f1f0f0',
        //justifyContent: 'flex-start',
        padding: 8,
        paddingTop: 5,
        paddingBottom: 0,
    },
    headerWrapper: {
        borderWidth: 1,
        borderColor: '#989898',
    },
    itemWrapper: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#989898',
        flex: 1, 
        flexDirection: 'row',
        padding: 10, justifyContent: 'flex-start',  
    },
    evenItemWrapper: {
        backgroundColor: '#f2f2f2',
    },
    thumbnail: {
        resizeMode: 'cover',
    },
    groupImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 1,
        borderColor: '#8e8e8e',
        alignSelf: 'flex-end',
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 5,
        bottom: 0,
    },
    title: {
        color: '#000000',
        marginBottom: 8,
    },
    details: {
        color: '#4e4e4e',
    },
    points: {
        color: '#ffffff',
    },
    btnWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    btnText: {
        flex: 4,
        color: '#fff',
        marginTop: 0,
    },
    listView: {
        flex: 9,
        paddingTop: 1,
        marginTop: 15,
    },
    loading: {
       flex: 9,
       alignItems: 'center',
       justifyContent: 'center',
    },
});
var styleLang;
if(!isArabic) {
    styleLang = StyleSheet.create({
    pointsWrapper: {
        alignSelf: 'flex-start',
    },
    memberPoints: {
        fontSize: 13,
    },
    headerPoints: {
        right: 0,
    },
    inputText: {
        textAlign: 'left',
    },
    searchIcon: {
        right: 5,
    },
    button: {
        marginRight: 1,
    },
    thumbnail: {
        marginRight: 10,
        marginLeft: 10,
    },
    rightContainer: {
        alignItems: 'flex-start',
    },
    title: {
        textAlign : 'left',
        fontSize: 18,
    },
    details: {
        textAlign : 'left',
        fontSize: 14,
    },    
    btnText: {
        fontSize: 14,
    },
    });
}
else {
    styleLang = StyleSheet.create({
    pointsWrapper: {
        //alignSelf: 'flex-start',
    },
    memberPoints: {
        fontSize: 13,
    },
    headerPoints: {
        left: 0,
    },
    inputText: {
        textAlign: 'right',
    },
    searchIcon: {
        left: 5,
    },
    button: {
        marginLeft: 1,
    },
    thumbnail: {
        marginRight: 10,
        marginLeft: 10,
    },
    rightContainer: {
        alignItems: 'flex-end',
    },
    title: {
        textAlign : 'right',
        fontSize: 18,
    },
    details: {
        textAlign : 'right',
        fontSize: 14,
    },    
    btnText: {
        fontSize: 14,
    },
    });
}
module.exports = AddMember;