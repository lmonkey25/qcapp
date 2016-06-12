
var SMSAndroid = require('react-native-sms-android');

export function SMSOpen(smsNumber){
  SMSAndroid.sms(smsNumber, "", "sendIndirect",
    (err, message) => {
      if(err){
        console.log("sms error", err);
      }
      else{
        console.log("sms message", message);
      }
    })
}
