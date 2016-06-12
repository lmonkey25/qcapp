'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
} from 'react-native';

import { height, width, } from './source/utilities/constants'

let QCCampaignCarousel = require('./qcCampaignCarousel');
let QCMainList = require('./qcMainList');
let QCLoading =  require('./qcLoading');
let InfoModal = require('./source/qcModals/infoModal');
let QuickDonationModal = require('./source/qcModals/quickDonationModal');

let Language = require('./language/language');
let isArabic = true;// Language.isArabic();

class QCHome extends Component {
	constructor(props) {
       	super(props);
       	this.state = {
            isArabic: this.props.isArabic,
       		campaignsLoading: true,
       		categoriesLoading: true,
            modalOpen: false,
            modalTitle: '',
            modalDetails: '',
            donateModalIsOpen: false,
            campaign: null,
            inProcessing: false,
            typedDonationAmount: 0,
       	};
    }
    componentDidMount() {
        if(this.props.onSearchParamsDefined) {
            this.props.onSearchParamsDefined();
        }
        //UserManager.sayHello();
        //Language.addChangeListener(this.onLanguageChange.bind(this));
    }
    componentWillUnmount() {
        //Language.removeChangeListener(this.onLanguageChange.bind(this));
    }
    onLanguageChange() {
        isArabic = Language.isArabic();
        this.setState({
            isArabic: isArabic,
        });
    }
    updateLoadingStates(index) {
    	if(index == 1) {
    		this.setState({campaignsLoading: false,});
    	}
    	else if(index == 2) {
    		this.setState({categoriesLoading: false,});
    	}
    }
    openModal(title, details) {
        this.setState({ 
            modalOpen: true,
            donateModalIsOpen: false,
            modalTitle: title,
            modalDetails: details,
        });
    }
    modalClosed() {
        this.setState({ 
            modalOpen: false,
            modalTitle: '',
            modalDetails: '',
        });
    }
    openDonationModal(campaign) {
        this.setState({ 
            campaign: campaign,
            modalOpen: false,
            donateModalIsOpen: true,
        });
    }
    donateModalClosed() {
        this.setState({ 
            donateModalIsOpen: false,
        });
    }
    /*
    alertCurrentUser(currentUser) {
        alert(currentUser.DonorId);
    }*/

    render() {
        isArabic = this.props.isArabic;
    	let loadingView = null;
        let basketItem =  null;
        if(this.state.campaign != null) {
            let campaign = this.state.campaign;
            basketItem = {
                ItemId: campaign.DefaultAccountTypeId,
                PaidThroughId: 3,
                CountryId : campaign.DefaultCountryId,
                AccountTypeId: campaign.DefaultAccountTypeId,
                IsNew: false,
                CampaignId: campaign.CampaignId,
                ItemTitle: isArabic ? campaign.ArName : campaign.EnName,
                ItemDiscription: isArabic ? campaign.ArName : campaign.EnName,
                AmountRemaining: 0,
                PaidAmount: 0,
                FixedPrice: 0,
                MobileDBId: 0,
            };
        }
    	if(this.state.campaignsLoading || this.state.categoriesLoading || this.state.inProcessing) {    		
    		loadingView = ( <QCLoading /> );
    	}
        //alert(this.state.isArabic)
        return (
          	<View style={stylesBase.container}>
	            <QCCampaignCarousel navigator={this.props.navigator} 
                    currentUser={this.props.currentUser}
            		onLoadingEnd={() => this.updateLoadingStates(1)} 
                    onInfoPressed={(title, details) => this.openModal(title, details)} 
                    onDonationPressed={(campaign) => this.openDonationModal(campaign)} 
                    isArabic={isArabic} />
	            <QCMainList navigator={this.props.navigator}
	            	onLoadingEnd={() => this.updateLoadingStates(2)} isArabic={isArabic} />

                <InfoModal isOpen={this.state.modalOpen}
                            title={this.state.modalTitle} details={this.state.modalDetails}
                            onClosed={() => this.modalClosed()} isArabic={isArabic} />
                <QuickDonationModal isOpen={this.state.donateModalIsOpen} navigator={this.props.navigator}
                            currentUser={this.props.currentUser}                         
                            onClosed={() => this.donateModalClosed()} isArabic={isArabic}
                            onStartRequest={() => this.setState({inProcessing: true, donateModalIsOpen: false, })}
                            onEndRequest={() => this.setState({inProcessing: false,})}
                            item={basketItem} />
                {loadingView}
          	</View>
        );
    }
}

var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-1,
    },
});

module.exports = QCHome;