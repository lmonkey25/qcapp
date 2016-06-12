'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableHighlight,
} from 'react-native';

import { 
    height, width, text, 
    DonationsMainItems, SearchTypes, 
    SearchAmountRanges, ProjectTypes,
    ProjectSubTypes,
} from '../utilities/constants'

//import { Select, Option, OptionList, updatePosition, } from  'react-native-dropdown';
var Dropdown = require('react-native-dropdown-android');

let QCButton = require('../sharedControls/qcButton');
let QCLoading =  require('../../qcLoading');
let SearchResult = require('./searchResult');

let isArabic = true;

const DonationTypes=[
    { id: '1', name_Ar: 'مساهمات', name_En: 'Donations'},
    { id: '2', name_Ar: 'مشاريع', name_En: 'Projects'},
    { id: '3', name_Ar: 'كفالات', name_En: 'Sponserships'},
];

const DonationClassifications=[
    { id: '0', name_Ar: 'كل فروع التبرع', name_En: 'All Donation Classifications'},
    { id: '1', name_Ar: 'تبرعات عامة', name_En: 'General Donations'},
    { id: '2', name_Ar: 'مشاريع موسمية', name_En: 'Seasonal Projects'},
    { id: '3', name_Ar: 'حالات انسانية', name_En: 'Poor Cases'},
    { id: '4', name_Ar: 'مشاريع مساهنة', name_En: 'Contribution Projects'},
];

const Genders=[
    { id: '0', name_Ar: 'الكل', name_En: 'All'},
    { id: '1', name_Ar: 'ذكر', name_En: 'Male'},
    { id: '2', name_Ar: 'أنثى', name_En: 'Female'},
];

let currentYear = new Date().getFullYear();
let Years = [{ id: 0, name_Ar: 'السنة', name_En: 'Year', }];
for(var i = currentYear; i >= currentYear - 60; i--) {
    Years.push({ id: i, name_Ar: '' + i + '', name_En: '' + i + '', });
}

const Months = [
    { id: '0', name_Ar: 'الشهر', name_En: 'Month'},
    { id: '1', name_Ar: 'يناير', name_En: 'Jan'},
    { id: '2', name_Ar: 'فبراير', name_En: 'Feb'},
    { id: '3', name_Ar: 'مارس', name_En: 'Mar'},
    { id: '4', name_Ar: 'ابريل', name_En: 'Apr'},
    { id: '5', name_Ar: 'مايو', name_En: 'May'},
    { id: '6', name_Ar: 'يونيو', name_En: 'Jun'},
    { id: '7', name_Ar: 'يوليو', name_En: 'Jul'},
    { id: '8', name_Ar: 'أغسطس', name_En: 'Aug'},
    { id: '9', name_Ar: 'سبتمبر', name_En: 'Sep'},
    { id: '10', name_Ar: 'أكتوبر', name_En: 'Oct'},
    { id: '11', name_Ar: 'نوفمير', name_En: 'Nov'},
    { id: '12', name_Ar: 'ديسمبر', name_En: 'Dec'},
];

class MainSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isMainSearch: true,
            campaignId: 0,

            donationTypes: [], //مساهمات - مشاريع - كفالات =====> TypeId
            //donationType = 1 = مساهمات
            donationClassifications: [], //فروع التبرع (تبرعات عامة - مشاريع موسمية - حالات انسانية - مشاريع مساهنة)
            //donationClassification = 1 = تبرعات عامة
            accountTypes: [], // مجال التبرع (Donation Categories) =====> AccountTypeId || CategoryId || MainAccountId
            //donationClassification = 3 = حالات انسانية
            needsTypes: [], // نوع المساعدة (Assistance Types)
            //donationType = 2 = مشاريع
            projectTypes: [], // أنواع المشاريع
            projectSubTypes: [], // أنواع المشاريع الفرعية
            //donationType = 3 = كفالات
            sponsershipCategories: [], // فئة المكفول (Sponsered Types)
            years: [],
            months: [],
            days: [],
            genders: [],
            //shared filters
            countries: [],
            prices: [],

            //Search Filters
            lastKeyword: '',
            selectedType: {id: 1, index: 0},
            selectedClassification: {id: 0, index: 0},
            selectedAccountType: {id: 0, index: 0},
            selectedNeedsType: {id: 0, index: 0},
            selectedProjectType: {id: 0, index: 0},
            selectedProjectSubType: {id: 0, index: 0},
            selectedSponsershipCategory: {id: 0, index: 0},
            selectedYear: {id: null, index: 0},
            selectedMonth: {id: null, index: 0},
            selectedDay: {id: null, index: 0},
            selectedGender: {id: null, index: 0},
            isMostWaiting: null,
            selectedCountry: {id: 0, index: 0},
            selectedPriceRange: {min: 0, max: 0, index: 0},
        };
    }
    componentDidMount() {
        let accountTypeId = this.state.selectedAccountType.id, 
            campaignId = this.props.campaignId, 
            typeId = this.state.selectedType.id, 
            projectTypeId = this.state.selectedProjectType.id;

        this.fetchData(accountTypeId, campaignId, typeId, projectTypeId);
    }

    fetchAllData(accountTypeId, campaignId, typeId, projectTypeId) {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Search/FillDonationSearchItems?MainAccountId='
                        + accountTypeId + '&CampaignId=' + campaignId 
                        + '&TypeId=' + typeId + '&ProjectTypeId=' + projectTypeId + '&LanguageId=1';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            let countries = [];
            countries = responseData;
            self.setState({
                countries: responseData.DonationItemsCountryForSearch,
                accountTypes: responseData.DonationItemsForSearch,
                sponsershipCategories: responseData.SponsorshipCategory,
                projectTypes: responseData.ProjectTypes,
                projectSubTypes: responseData.ProjectSubTypes,
                needsTypes: responseData.AssistanceNeedsTypes,
                prices: responseData.PriceList,
                isLoading: false,

                selectedType: {id: this.props.typeId, index: typeId - 1},
            });
        })
        .done();
    }

    getDDLOptions(arrayObj, objType) {
        let options = [];
        if(arrayObj && arrayObj != null) {
            switch(objType) {
                case 1: //prices
                    arrayObj.map((item, index) => {
                        options.push(item.Title);
                    });
                    break;
                case 2: //countries
                    arrayObj.map((item, index) => {
                        options.push(item.CountryName);
                    });
                    break;
                case 3: //gender
                    arrayObj.map((item, index) => {
                        options.push(item.name_Ar);
                    });
                    break;
                case 4: //year
                case 5: //months
                case 6: //days
                case 7: //DonationTypes
                case 8: //DonationClassifications
                    arrayObj.map((item, index) => {
                        options.push(item.name_Ar);
                    });
                    break;

                case 9: //accountTypes
                    arrayObj.map((item, index) => {
                        options.push(item.Name);
                    });
                    break;
                case 10: //needsTypes
                    arrayObj.map((item, index) => {
                        options.push(item.ArName);
                    });
                    break;
                case 11: //projectTypes or SubTypes
                    arrayObj.map((item, index) => {
                        options.push(item.ProjectTypeName);
                    });
                    break;
                case 12: //sponsershipCategories
                    arrayObj.map((item, index) => {
                        options.push(item.CategoryName);
                    });
                    break;
            }
        }

        return options;
    }

    //مجال التبرع
    getAccountTypes(campaignId) {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Search/GetMainDonationItems?campaignId='
                            + campaignId + '&LanguageId=1';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                accountTypes: responseData,
            });
        })
        .done();
    }
    //نوع المساعدة
    getNeedTypes() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Search/GetAssistanceCasesTypes?LanguageId=1';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                needsTypes: responseData,
            });
        })
        .done();
    }
    //أنواع المشاريع و المشاريع الفرعية
    getProjectTypes(projectTypeId) {
        let self = this;
        let main, typeId;
        if(projectTypeId && projectTypeId != null && projectTypeId > 0) {
            main = '0';
            typeId = projectTypeId.toString();
        }
        else {
            main = '1';
            typeId = 'null';
        }

        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Search/GetProjectTypes?ProjectTypeId='
                        + typeId + '&Main=' + main + '&LanguageId=1';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            if(main == '0') {
                self.setState({
                    projectSubTypes: responseData,
                });
            }
            else {
                self.setState({
                    projectTypes: responseData,
                });                
            }
        })
        .done();
    }
    // فئة المكفول
    getSponsershipCategories() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Search/GetSponsorshipCategory?LanguageId=1';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                sponsershipCategories: responseData,
            });
        })
        .done();
    }
    getMonthDays(month, year) {
        let monthLastDay = 30;
        let Days = [{ id: 0, name_Ar: 'اليوم', name_En: 'Day', }];
        for(var i = 1; i <= monthLastDay; i--) {
            Days.push({ id: i, name_Ar: '' + i + '', name_En: '' + i + '', });
        }
        this.setState({days: Days, });
    }
    //accountTypeId = selectedAccountType مجال التبرع
    getCountries(accountTypeId, campaignId) {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Search/GetMainDonationCountryItems?MainAccountId='
                        + accountTypeId + '&campaignId=' + campaignId + '&LanguageId=1';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                countries: responseData,
            });
        })
        .done();
    }
    //categoryId = selectedAccountType
    //typeId = selectedProjectType
    // donationTypeId = selectedType
    getPrices(categoryId, typeId, countryId, subtypeId, donationTypeId, internalCategoryId) {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Search/GetDonorDonationPriceList?CategoryId='
                        + categoryId +'&TypeId=' + typeId 
                        + '&CountryId=' + countryId + '&SubTypeId=' + subtypeId 
                        + '&DonationTypeId=' + donationTypeId + '&LanguageId=1&InternalCategory=' + internalCategoryId;
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                prices: responseData,
            });
        })
        .done();
    }

    getSelectedItem(itemsArray, selectedIndex) {
        return itemsArray[selectedIndex];
    }
    search() {//alert('search')
        this.setState({isLoading: true, });

        let keyword = this.state.lastKeyword;
        if(!keyword || keyword == null || keyword == '') {
            keyword = 'null';
        }

        let categoryId = this.state.selectedAccountType.id;
        if(categoryId <= 0) {
            categoryId = 'null';
        }

        let typeId = this.state.selectedType.id;
        if(typeId <= 0) {
            typeId = 1;
        }

        let projectsTypeId = this.state.selectedProjectType.id;
        if(projectsTypeId <= 0) {
            projectsTypeId = 'null';
        }

        let projectSubTypeId = this.state.selectedProjectSubType.id;
        if(projectSubTypeId <= 0) {
            projectSubTypeId = 'null';
        }

        let countryId = this.state.selectedCountry.id;
        if(countryId <= 0) {
            countryId = 'null';
        }

        let amountRange = this.state.selectedPriceRange;
        let minVal = amountRange.min, maxVal = amountRange.max;

        this.getSearchResult(keyword, categoryId, typeId, projectsTypeId, projectSubTypeId, countryId, minVal, maxVal);
    }
    getSearchResult(keyword, categoryId, typeId, projectsTypeId, projectSubTypeId, countryId, minVal, maxVal) {
        let self = this;
        let REQUEST_URL = ('http://servicestest.qcharity.org/api/User/GetDonorDonationListSearchNew?DonorId=0&LanguageId=' 
            + (isArabic ? '1' : '2') + '&CategoryId='
            + categoryId + '&TypeId=' + typeId 
            + ((projectsTypeId > 0) ? '&DonationTypeId=0&InternalCategory=' + projectsTypeId : '')
            + ((projectSubTypeId > 0) ? '&SubTypeId=' + projectSubTypeId : '') 
            + '&CountryId=' + countryId + '&MinPrice=' + minVal + '&MaxPrice=' + maxVal 
            + ((keyword && keyword != null) ? '&keyword=' + keyword : ''));

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            let result = responseData;
            let title;
            if(isArabic) {
                switch(typeId) {
                    case 1:
                        title = 'مساهمات';
                        break;
                    case 2:
                        title = 'مشاريع';
                        break;
                    case 3:
                        title = 'كفالات';
                        break;
                }
            }
            else {
                switch(typeId) {
                    case 1:
                        title = 'Contributions';
                        break;
                    case 2:
                        title = 'Projects';
                        break;
                    case 3:
                        title = 'Sponsership';
                        break;
                }
            }
            this.props.navigator.push({
                id: 'SearchResult',
                title: title,
                component: SearchResult,
                passProps: {result: result, typeId: typeId, isArabic: isArabic, },
            });
        })
        .done();
    }    
    pressed() {
        if(this.props.onPressed){
            this.props.onPressed();
        }
    }

    searchOptionChanged(optionType, selectedIndex) {
        let isMainSearch = this.props.isMainSearch;
        let campaignId = this.props.campaignId;

        let id = 0;
        let index = 0;
        let arrayObj = {}, item = {};
        let categoryId = this.state.selectedAccountType.id, 
            typeId = this.state.selectedProjectType.id, 
            countryId = this.state.selectedCountry.id, 
            subtypeId = this.state.selectedProjectSubType.id, 
            donationTypeId = this.state.selectedType.id, 
            internalCategoryId = null;

        let month = this.state.selectedMonth.id, 
            year= this.state.selectedYear.id;

        let priceMin = this.state.selectedPriceRange.min,
            priceMax = this.state.selectedPriceRange.max;

        if(arrayObj && arrayObj != null) {
            switch(optionType) {
                case 1: //prices
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.prices;
                        item = arrayObj[index];
                        priceMin = item.Min;
                        priceMax = item.Max;
                    }
                    else {priceMin = priceMax = 0;}
                    this.setState({
                        selectedCountry: {min: priceMin, max: priceMax, index: index},
                    }); 
                    break;
                case 2: //countries
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.countries;
                        item = arrayObj[index];
                        id = countryId = item.CountryID;
                    }
                    else {id = countryId = 0;}
                    this.setState({
                        selectedCountry: {id: id, index: index},
                    }); 
                    this.getPrices(categoryId, typeId, countryId, subtypeId, donationTypeId, internalCategoryId);
                    break;
                case 3: //gender
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = Genders;
                        item = arrayObj[index];
                        id = item.id;
                    }
                    else {id = 0;}
                    this.setState({
                        selectedGender: {id: id, index: index},
                    }); 
                    break;
                case 4: //year
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = Years;
                        item = arrayObj[index];
                        id = year = item.id;
                    }
                    else {id = year = 0;}
                    this.setState({
                        selectedYear: {id: id, index: index},
                    }); 
                    this.getMonthDays(month, year);
                    break;
                case 5: //months
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = months;
                        item = arrayObj[index];
                        id = month = item.id;
                    }
                    else {id = month = 0;}
                    this.setState({
                        selectedMonth: {id: id, index: index},
                    }); 
                    this.getMonthDays(month, year);
                    break;
                case 6: //days
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.days;
                        item = arrayObj[index];
                        id = item.id;
                    }
                    else {id = 0;}
                    this.setState({
                        selectedDay: {id: id, index: index},
                    }); 
                    break;
                case 7: //DonationTypes
                    if(selectedIndex >= 0) {
                        index = selectedIndex;
                        arrayObj = DonationTypes;
                        item = arrayObj[index];
                        id = typeId = item.id;
                    }
                    else {id = typeId = 0;}
                    this.setState({
                        selectedType: {id: id, index: index},
                    });
                    if(!isMainSearch) {
                    }
                    this.getPrices(categoryId, typeId, countryId, subtypeId, donationTypeId, internalCategoryId);
                    break;
                case 8: //DonationClassifications
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = DonationClassifications;
                        item = arrayObj[index];
                        id = item.id;
                    }
                    else {id = 0;}
                    this.setState({
                        selectedClassification: {id: id, index: index},
                    });
                    if(!isMainSearch) {
                    }
                    break;

                case 9: //accountTypes
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.accountTypes;
                        item = arrayObj[index];
                        id = categoryId = item.AccountTypeID;
                    }
                    else {id = categoryId = 0;}
                    this.setState({
                        selectedAccountType: {id: id, index: index},
                    });
                    if(!isMainSearch) {
                    }
                    this.getPrices(categoryId, typeId, countryId, subtypeId, donationTypeId, internalCategoryId);
                    this.getCountries(categoryId, campaignId);
                    break;
                case 10: //needsTypes
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.needsTypes;
                        item = arrayObj[index];
                        id  = item.NeedsTypeId;
                    }
                    else {id  = 0;}
                    this.setState({
                        selectedNeedsType: {id: id, index: index},
                    });
                    if(!isMainSearch) {
                    }
                    break;
                case 11: //projectTypes
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.projectTypes;
                        item = arrayObj[index];
                        id = typeId = item.ProjectTypeId;
                    }
                    else {id = typeId = 0;}
                    this.setState({
                        selectedProjectType: {id: id, index: index},
                    });
                    if(!isMainSearch) {
                        this.getPrices(categoryId, typeId, countryId, subtypeId, donationTypeId, internalCategoryId);
                        this.getProjectTypes(typeId);
                    }
                    break;
                case 12: //projectSubTypes
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.projectSubTypes;
                        item = arrayObj[index];
                        id = subtypeId = item.ProjectTypeId;
                    }
                    else {id = subtypeId = 0;}
                    this.setState({
                        selectedProjectSubType: {id: id, index: index},
                    });
                    if(!isMainSearch) {
                        this.getPrices(categoryId, typeId, countryId, subtypeId, donationTypeId, internalCategoryId);
                    }
                    break;
                case 13: //sponsershipCategories
                    if(selectedIndex > 0) {
                        index = selectedIndex;
                        arrayObj = this.state.sponsershipCategories;
                        item = arrayObj[index];
                        id = item.CategoryId;
                    }
                    else {id = 0;}
                    this.setState({
                        selectedSponsershipCategory: {id: id, index: index},
                    });
                    if(!isMainSearch) {
                    }
                    break;
            }
        }
    }
  
    render() {

        isArabic = this.props.isArabic;

        let isMainSearch = this.props.isMainSearch;
        let campaignId = this.props.campaignId;

        let donationTypes = DonationTypes; //مساهمات - مشاريع - كفالات =====> TypeId
        //donationType = 1 = مساهمات
        let donationClassifications = DonationClassifications; //فروع التبرع (تبرعات عامة - مشاريع موسمية - حالات انسانية - مشاريع مساهنة)
        //donationClassification = 1 = تبرعات عامة
        let accountTypes = this.state.accountTypes; // مجال التبرع (Donation Categories) =====> AccountTypeId || CategoryId || MainAccountId
        //donationClassification = 3 = حالات انسانية
        let needsTypes = this.state.needsTypes; // نوع المساعدة (Assistance Types)
        //donationType = 2 = مشاريع
        let projectTypes = this.state.projectTypes; // أنواع المشاريع
        let projectSubTypes = this.state.projectSubTypes; // أنواع المشاريع الفرعية
        //donationType = 3 = كفالات
        let sponsershipCategories = this.state.sponsershipCategories; // فئة المكفول (Sponsered Types)
        let years = Years;
        let months = Months;
        let days = this.getMonthDays(this.state.selectedMonth, this.state.selectedYear);
        let genders = Genders;
        //shared filters
        let countries = this.state.countries;
        let prices = this.state.prices;

        /*
        isMainSearch: true => display main search fields
        donationTypeId: selected id of Donation Type (مجال التبرع)
        */

        let keywordText = isArabic? 'كلمة البحث':'Search Keyword';
        let donationFieldText = isArabic? 'مجال التبرع':'Donation Field';
        let projectsText = isArabic? 'مشاريع':'Projects';
        let projectTypesText = isArabic? 'أنواع المشاريع':'Projects Types';
        let subProjectText = isArabic? 'أنواع المشاريع الفرعية':'Subprojects Types';
        let countryText = isArabic? 'الدولة':'Country';
        let amountText = isArabic? 'المبلغ':'Amount';

        
        let loading = null, contents = [];

        if(this.state.isLoading) { 
            loading = (
                <QCLoading />
            );
        }
        else {
            c
            let searchText = isArabic? 'إبحث' : 'Search';
            let dobText = isArabic? 'تاريخ الميلاد' : 'Date of Birth';

            let donationCategoryText = isArabic? 'مجال التبرع' : 'Donation Category';
            let projectTypesText = isArabic? 'أنواع المشاريع' : 'Project Types';
            let subprojectTypesText = isArabic? 'أنواع مشاريع فرعية' : 'Sub Project Types';
            let countryText = isArabic? 'الدولة' : 'Country';
            let priceText = isArabic? 'المبلغ' : 'Amount';
            let sponseredTypeText = isArabic? 'مجال المكفول' : 'Sponsered Type';
            let sexText = isArabic? 'الجنس' : 'Gender';
            let dayText = isArabic? 'اليوم' : 'Day';
            let monthText = isArabic? 'الشهر' : 'Month';
            let yearText = isArabic? 'السنة' : 'Year';

            //مجال التبرع
            //donationClassification = 1 = تبرعات عامة
            let ddlAccountTypes = (
                <View style={[styles.rowContainer,]}>
                    <Dropdown
                        style={{ height: 20, width: width - 30, }}
                        values={this.getDDLOptions(accountTypes, 9)}
                        selected={this.state.selectedAccountType.index} 
                        onChange={(data) => { this.searchOptionChanged(9, data.selected) }} />
                </View>
            );

            //مساهمات - مشاريع - كفالات =====> TypeId
            let ddlTypes = (
                <View style={[styles.rowContainer,]}>
                    <Dropdown
                        style={{ height: 20, width: width - 30, }}
                        values={this.getDDLOptions(donationTypes, 7)}
                        selected={this.state.selectedType.index} 
                        onChange={(data) => { this.searchOptionChanged(7, data.selected) }} />
                </View>
            );

            //الدول
            let ddlCountries = (
                <View style={[styles.rowContainer,]}>
                    <Dropdown
                        style={{ height: 20, width: width - 30, }}
                        values={this.getDDLOptions(countries, 2)}
                        selected={this.state.selectedCountry.index} 
                        onChange={(data) => { this.searchOptionChanged(2, data.selected); }} />
                </View>
            );

            //المبلغ
            let ddlPrices = (
                <View style={[styles.rowContainer,]}>
                    <Dropdown
                        style={{ height: 20, width: width - 30, }}
                        values={this.getDDLOptions(prices, 1)}
                        selected={this.state.selectedPriceRange.index} 
                        onChange={(data) => { this.searchOptionChanged(1, data.selected) }} />
                </View>
            );

            //فروع التبرع
            //donationType = 1 = مساهمات
            let ddlDonationClassifications = null;

            //نوع المساعدة
            //donationClassification = 3 = حالات انسانية
            let ddlNeedsTypes = null;

            //donationType = 2 = مشاريع
            let ddlProjectTypes = null;
            let ddlProjectSubTypes = null;

            // فئة المكفول 
            //donationType = 3 = كفالات
            let ddlSponsershipCategories = null;

            let ddlYears = null, ddlMonths = null, ddlDays = null;
            let ddlGenders = null, dobRow = nu;

            if(!isMainSearch) {
                ddlDonationClassifications = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(donationClassifications, 8)}
                            selected={this.state.selectedClassification.index} 
                            onChange={(data) => { this.searchOptionChanged(8, data.selected) }} />
                    </View>
                );

                ddlNeedsTypes = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(needsTypes, 10)}
                            selected={this.state.selectedNeedsType.index} 
                            onChange={(data) => { this.searchOptionChanged(10, data.selected) }} />
                    </View>
                );

                ddlProjectTypes = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(projectTypes, 11)}
                            selected={this.state.selectedProjectType.index} 
                            onChange={(data) => { this.searchOptionChanged(11, data.selected) }} />
                    </View>
                );

                ddlProjectSubTypes = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(projectSubTypes, 11)}
                            selected={this.state.selectedProjectSubType.index} 
                            onChange={(data) => { this.searchOptionChanged(12, data.selected) }} />
                    </View>
                );

                ddlSponsershipCategories = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(sponsershipCategories, 12)}
                            selected={this.state.selectedSponsershipCategory.index} 
                            onChange={(data) => { this.searchOptionChanged(13, data.selected) }} />
                    </View>
                );

                ddlYears = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(years, 4)}
                            selected={this.state.selectedYear.index} 
                            onChange={(data) => { this.searchOptionChanged(4, data.selected) }} />
                    </View>
                );
                
                ddlMonths = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(months, 5)}
                            selected={this.state.selectedMonth.index} 
                            onChange={(data) => { this.searchOptionChanged(5, data.selected) }} />
                    </View>
                );

                ddlDays = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(days, 6)}
                            selected={this.state.selectedDay.index} 
                            onChange={(data) => { this.searchOptionChanged(6, data.selected) }} />
                    </View>
                );

                dobRow = (
                    <View>
                        <View>
                            <Text style={[text,]}>{dobText}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            {ddlDays}
                            {ddlMonths}
                            {ddlYears}
                        </View>
                    </View>
                );

                ddlGenders = (
                    <View style={[styles.rowContainer,]}>
                        <Dropdown
                            style={{ height: 20, width: width - 30, }}
                            values={this.getDDLOptions(gender, 3)}
                            selected={this.state.selectedGender.index} 
                            onChange={(data) => { this.searchOptionChanged(3, data.selected) }} />
                    </View>
                ); 
            }

            contents.push(
                <View key={1} style={[styles.rowContainer,]}>
                    <TextInput autoFocus={false} maxLength={35} 
                                placeholder={keywordText}
                                style={[styles.inputTexts,]}
                                placeholderTextColor={'#e8e8e8'}
                                onChangeText={(searchText) => this.setState({lastKeyword: searchText})}
                                value={this.state.lastKeyword} />
                </View>
            );

            if(isMainSearch) {
                contents.push(ddlAccountTypes);
                contents.push(ddlTypes);
                contents.push(ddlCountries);
                contents.push(ddlPrices);
            }
            else {
                contents.push(ddlTypes);

                if(this.state.selectedType.id != 3) {
                    //مساهمات
                    if(this.state.selectedType.id == 1) {
                        contents.push(ddlDonationClassifications);

                        //تبرعات عامة
                        if(this.state.selectedClassification.id == 1) {
                            contents.push(ddlAccountTypes);
                        }
                        //حالات انسانية
                        else if(this.state.selectedClassification.id == 3) {
                            contents.push(ddlNeedsTypes);
                        }
                    }
                    //مشاريع
                    else if(this.state.selectedType.id == 2) {
                        contents.push(ddlProjectTypes);
                        contents.push(ddlProjectSubTypes);
                    }

                    contents.push(ddlCountries);
                    contents.push(ddlPrices);
                }
                //الكفالات
                else {
                    contents.push(ddlSponsershipCategories);
                    contents.push(ddlCountries);
                    contents.push(ddlPrices);
                    contents.push(ddlGenders);
                    contents.push(dobRow);
                }
            }

            contents = (
                <ScrollView
                    scrollEventThrottle={16}
                    style={{ marginBottom:0,}}
                    contentContainerStyle={{ alignItems: 'center' }}>
                    <View style={{ flex: 1, }}>
                        {contents}
                        <View style={{marginTop: 20,}}>  
                            <QCButton text={searchText} color='blue' width={120} isArabic={isArabic} 
                                        onPressed={() => this.search()} />
                        </View>
                    </View>
                </ScrollView>
            );
        }

        return (
            <View style={styles.container}>
                {loading}
                {contents}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-start',
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white',
    },
    rowContainer: {
        width: width - 30,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#cfcfcf',
        alignItems: 'center',
        justifyContent:'center',
    },    
    inputText: {
        borderColor: 'red',
        borderWidth: 1,
        //borderBottomWidth: 0,
        width: width - 35,
    },
    rowToutch: {
        flex: 1,
    },
    contentWrapers: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent:'center',
    },
    badgeWrapper: {
        width: 80,
    },
    titleWrapper: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        textAlign: 'right',
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fe345a',
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center', 
        justifyContent:'center',
    },
    badgeText: {
        color: 'white',
        textAlign: 'center',
    },
});

module.exports = MainSearch; /* making it available for use by other files */