var SMSiOS = require('react-native-communications');

export function SMSOpen(smsNumber){
  SMSiOS.text(smsNumber);
}
