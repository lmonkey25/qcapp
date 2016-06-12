'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    Picker,
    TouchableHighlight,
} from 'react-native';

let Dropdown = require('react-native-dropdown-android');

import { height, width, text } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let isArabic = true;

class CouponList extends Component {

    constructor(props) {
       super(props);
       this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            isLoading: true,
            loadedDataCounter: 0,
            categories: [],
            prices: [],
            selectedAmount: 0,
            selectedCountry: 0,
            selectedCategoryId: 1,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.getPriceRangs();
        this.getCategories();
        this.fetchData(this.state.selectedCategoryId, this.state.selectedAmount);
    }
    componentWillUnmount() {
    }
    getCategories() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Donation/GetCouponCategoryList?CategoryName=';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                categories: responseData,
                loadedDataCounter: this.state.loadedDataCounter + 1,
            });
        })
        .done();
    }
    getPriceRangs() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetDonorDonationPriceList?CategoryId=100&TypeId=0&CountryId=0&SubTypeId=0&DonationTypeId=0&LanguageId='
                            + (isArabic ? '1' : '2') + '&InternalCategory=0';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                prices: responseData,
                loadedDataCounter: this.state.loadedDataCounter + 1,
            });
        })
        .done();
    }
    fetchData(categoryId, amount) {
        let self = this;
        if(this.state.loadedDataCounter >= 3) {
            this.setState({loadedDataCounter: 2});
        }
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Donation/GetCouponListByCategory?CategoryId=' +
                            categoryId + '&CountryId=' + 
                            this.state.selectedCountry + '&Amount=' + amount;
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                dataSource: self.state.dataSource.cloneWithRows(responseData),
                loadedDataCounter: this.state.loadedDataCounter + 1,
            });
        })
        .done();
    }

    renderItem(item) {
        //
        return (
            <View style={[styles.item,]}>
                <Image source={{uri: item.ImageURL}} style={styles.image} />
            </View>
        );
    }

    getSelectedItem(itemsArray, selectedIndex) {
        return itemsArray[selectedIndex];
    }
    categoryChanged(categoryIndex) { 
        let categoryId  = 0;
        if(categoryIndex > 0) {
            let catItem = this.getSelectedItem(this.state.categories, categoryIndex - 1);
            let categoryId = (catItem && catItem != null) ? catItem.CategoryId : 0;
        }
        this.setState({selectedCategoryId: categoryId, }); 
        this.fetchData(categoryId, this.state.selectedAmount);        
    }
    rangeChanged(amount) {
        //if(amount > 0) {
            this.setState({selectedAmount: amount, });
            this.fetchData(this.state.selectedCategoryId, amount);
       // }
    }
    countryChanged(country) {        
        this.setState({selectedCountry: country, }); 
    }
    renderPricesOptions() {
        let data = this.state.prices;
        let prices = ['اختر القيمة'];
        if(data && data != null && data.length > 0) {
            data.map((item, index) => {
                prices.push(item.Max)
            });
        }
        return (
            <Dropdown
                style={{ height: 20, width:width * .4, }}
                values={prices}
                selected={0} onChange={(val) => { this.rangeChanged((val.selected > 0) ? val.value : val.selected) }} />
        );
    }
    renderCategoriesOptions() {
        let data = this.state.categories;
        let categories = ['اختر التصنيف'];
        if(data && data != null && data.length > 0) {
            data.map((item, index) => {
                categories.push((isArabic ? item.TitleAr : item.TitleEn))
            });
        }
        return (
            <Dropdown
                style={{ height: 20, width:width * .6, }}
                values={categories}
                selected={0} onChange={(val) => { this.categoryChanged(val.selected) }} />
        );
    }
    
    render() {
        let loader = null;
        if(this.state.loadedDataCounter < 3) {
            loader = (<QCLoading />);
        }

        return (
            <View style={styles.container}>
                <View style={styles.search}>
                    {this.renderPricesOptions()}
                    {this.renderCategoriesOptions()}
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    initialListSize={1}
                    style={styles.list} />
                {loader}
            </View>
        );
    }
}

var itemWidth = (width - 20);
var styles = StyleSheet.create({    
    container: {
        flex: 1,
        marginBottom:55,
    },
    search: {
        flexDirection: 'row',
        width: itemWidth + 20,
        height: 50,
        backgroundColor: 'white',
        marginBottom:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
        width: itemWidth,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    item: {
        width: itemWidth,
        height: itemWidth,
        marginBottom: 8,
    },
    image: {
        flex: 1,
        width: itemWidth,
        height: itemWidth,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

module.exports = CouponList;