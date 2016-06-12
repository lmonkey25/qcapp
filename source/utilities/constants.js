import { Dimensions } from 'react-native'

export const {height, width} = Dimensions.get('window');


//export const QCLoading =  require('../../qcLoading');

export const text = { fontFamily: 'Janna New R', };

//export const UserManager = require('../../globalActions/userActions');
export const AccountController = require('./accountController');
export const Validator = require('../../globalActions/validator');
export const STORAGE_KEY = '@QcApploginData:key';

export const Countries=[
    { id: '1', country_name: 'Afghanistan', code: '+93'},
    { id: '2', country_name: 'Palestine', code: '+970'},
    { id: '3', country_name: 'India', code: '+91'},
    { id: '4', country_name: 'Jordan', code: '+962'},
    { id: '5', country_name: 'Yemen', code: '+967'},
    { id: '6', country_name: 'Iran', code: '+98'},
    { id: '7', country_name: 'Philippines', code: '+63'},
    { id: '8', country_name: 'Bangladesh', code: '+880'},
    { id: '10', country_name: 'Iraq', code: '+964'},
    { id: '11', country_name: 'Pakistan', code: '+92'},
    { id: '16', country_name: 'Syria', code: '+963'},
    { id: '17', country_name: 'Sri Lanka', code: '+94'},
    { id: '28', country_name: 'Indonesia', code: '+62'},
    { id: '31', country_name: 'Kyrgyzstan', code: '+996'},
    { id: '35', country_name: 'Somalia', code: '+252'},
    { id: '40', country_name: 'Nigeria', code: '+234'},
    { id: '46', country_name: 'Benin', code: '+229'},
    { id: '47', country_name: 'Burkina Faso', code: '+226'},
    { id: '48', country_name: 'Senegal', code: '+221'},
    { id: '50', country_name: 'Ghana', code: '+233'},
    { id: '52', country_name: 'Togo', code: '+228'},
    { id: '58', country_name: 'Niger', code: '+227'},
    { id: '66', country_name: 'France', code: '+33'},
    { id: '542', country_name: 'Qatar', code: '+974'},
];

export const DonationsMainItems=[
    { id: '1053', name_Ar: 'التعليم', name_En: 'Education'},
    { id: '1054', name_Ar: 'الصحة', name_En: 'Education'},
    { id: '1055', name_Ar: 'كفالات ورعاية الاجتماعية', name_En: 'Education'},
    { id: '1056', name_Ar: 'المياه و الآبار', name_En: 'Education'},
    { id: '1057', name_Ar: 'الاسكان و البنية التحتية', name_En: 'Education'},
    { id: '1058', name_Ar: 'تحسين الدخل', name_En: 'Education'},
    { id: '1059', name_Ar: 'مساجد و ثقافة', name_En: 'Education'},
    { id: '1060', name_Ar: 'حملات اغاثة', name_En: 'Education'},
    { id: '1061', name_Ar: 'الصدقات', name_En: 'Education'},
    { id: '1062', name_Ar: 'الزكاة', name_En: 'Education'},
    { id: '1063', name_Ar: 'الوقفيات', name_En: 'Education'},
    { id: '1064', name_Ar: 'مشاريع رمضان', name_En: 'Education'},
];

export const SearchTypes=[
    { id: '1', name_Ar: 'مساهمات', name_En: 'Education'},
    { id: '2', name_Ar: 'مشاريع', name_En: 'Education'},
    { id: '3', name_Ar: 'كفالات', name_En: 'Education'},
];

export const SearchAmountRanges=[
    { isMin: false, value_min: '1', value_max: '100', range: '1-100',},
    { isMin: false, value_min: '100', value_max: '500', range: '100-500',},
    { isMin: false, value_min: '500', value_max: '1000', range: '500-1000',},
    { isMin: false, value_min: '1000', value_max: '5000', range: '1000-5000',},
    { isMin: false, value_min: '5000', value_max: '1000', range: '5000-10000',},
    { isMin: false, value_min: '10000', value_max: '50000', range: '10000-50000',},
    { isMin: false, value_min: '50000', value_max: '75000', range: '50000-75000',},
    { isMin: false, value_min: '75000', value_max: '100000', range: '75000-100000',},
    { isMin: false, value_min: '100000', value_max: '150000', range: '100000-150000',},
    { isMin: false, value_min: '150000', value_max: '200000', range: '150000-200000',},
    { isMin: false, value_min: '200000', value_max: '500000', range: '200000-500000',},
    { isMin: true, value_min: '500000', value_max: '0', range: 'أكثر من 500000',},
];

export const ProjectTypes=[
    { id: '1', name_Ar: 'مشاريع تعليمية وثقافية', name_En: 'Education'},
    { id: '2', name_Ar: 'مساجد', name_En: 'Education'},
    { id: '3', name_Ar: 'مشاريع صحية', name_En: 'Education'},
    { id: '4', name_Ar: 'مشاريع مياه', name_En: 'Education'},
    { id: '5', name_Ar: 'مشاريع مدرة للدخل', name_En: 'Education'},
    { id: '6', name_Ar: 'مراكز متعددة الخدمات', name_En: 'Education'},
    { id: '7', name_Ar: 'مراكز تحفيظ قؤآن', name_En: 'Education'},
    { id: '8', name_Ar: 'بيوت فقراء', name_En: 'Education'},
    { id: '9', name_Ar: 'مشاريع التنمية المحلية', name_En: 'Education'},
    { id: '29', name_Ar: 'مشاريع إجتماعية', name_En: 'Education'},
    { id: '30', name_Ar: 'إغاثة', name_En: 'Education'},
    { id: '31', name_Ar: 'أخرى', name_En: 'Education'},
];


export const ProjectSubTypes=[
    { parentId: 1, id: '35', name_Ar: 'رياض أطفال', name_En: 'Education'},
    { parentId: 1, id: '36', name_Ar: 'مدارس ابتدائية', name_En: 'Education'},
    { parentId: 1, id: '37', name_Ar: 'إعدادية', name_En: 'Education'},
    { parentId: 1, id: '38', name_Ar: 'ثانوية', name_En: 'Education'},
    { parentId: 1, id: '39', name_Ar: 'جامعية', name_En: 'Education'},
    { parentId: 1, id: '40', name_Ar: 'مركز تدريب مهني', name_En: 'Education'},
    { parentId: 1, id: '139', name_Ar: 'طباعة كتب', name_En: 'Education'},
    { parentId: 1, id: '141', name_Ar: 'تأثيت مدارس', name_En: 'Education'},
    { parentId: 1, id: '142', name_Ar: 'تدريب وتأهيل', name_En: 'Education'},
    { parentId: 1, id: '143', name_Ar: 'دعم تسيير', name_En: 'Education'},
    { parentId: 1, id: '153', name_Ar: 'فصول دراسية', name_En: 'Education'},
    { parentId: 1, id: '154', name_Ar: 'بناء مكتبة', name_En: 'Education'},
    { parentId: 1, id: '175', name_Ar: 'تحسين التعليم', name_En: 'Education'},

    { parentId: 2, id: '145', name_Ar: 'صيانة مساجد', name_En: 'Education'},
    
    { parentId: 3, id: '41', name_Ar: 'مستوصف', name_En: 'Education'},
    
    { parentId: 4, id: '43', name_Ar: 'آبار سطحية', name_En: 'Education'},
    
    { parentId: 5, id: '1', name_Ar: 'تمليك ماكينة خياطة', name_En: 'Education'},
    
    { parentId: 6, id: '161', name_Ar: 'بناء مركز متعدد الخدمات', name_En: 'Education'},
    
    { parentId: 7, id: '172', name_Ar: 'تأثيث', name_En: 'Education'},
    
    { parentId: 8, id: '163', name_Ar: 'بناء بيوت فقراء', name_En: 'Education'},
    
    { parentId: 9, id: '18', name_Ar: 'صلة الرحمة', name_En: 'Education'},
    
    { parentId: 29, id: '146', name_Ar: 'توزيع أغذية', name_En: 'Education'},
    
    { parentId: 30, id: '195', name_Ar: 'المياه والإصحاح', name_En: 'Education'},
    
    { parentId: 31, id: '156', name_Ar: 'معدات كهربائية', name_En: 'Education'},
];

//http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
export const formatingNumRegx = /(\d)(?=(\d{3})+\.)/g;
export const formatingNumFormat = '$1,';