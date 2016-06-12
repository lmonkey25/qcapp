

var Validator = {
    validatePhone: function(mobile) {
        var re=/^[0-9]{8}$/;
        //var re=/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        return re.test(mobile);
    },
    validateEmail: function(email) { 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        return re.test(email); 
    },
    validateRequired: function(field, fieldName, isArabic) {
        var msg = '';
        if(!field || field == null) { 
            msg = fieldName + (isArabic ? (' مطلوب') : (' is required'));
        }
        return msg;
    },
};

module.exports = Validator;