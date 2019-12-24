const poller = require('promise-poller').default
require('dotenv').config();

const dbc = require('./deathbycaptcha.js');

const username = process.env.DBC_LOGIN;     // DBC account username
const password = process.env.DBC_PASSWORD;     // DBC account password

// Proxy and Recaptcha token data
const token_params = JSON.stringify({
  'googlekey': '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
  'pageurl': 'https://old.reddit.com/login'
});

// Death By Captcha Socket Client
// const client = new dbc.SocketClient(username, password);
const client = new dbc.HttpClient(username, password) // for http client

// Get user balance
// client.get_balance((balance) => {
//   console.log(balance);
// });

console.log('Entering decode');
// Solve captcha with type 4 & token_params extra arguments
client.decode({ extra: { type: 4, token_params: token_params } }, (captcha) => {
  console.log(captcha);
  if (captcha) {
    console.log('Captcha ' + captcha['captcha'] + ' solved: ' + captcha['text']);
    // Report an incorrectly solved CAPTCHA.
    // Make sure the CAPTCHA was in fact incorrectly solved!
    // client.report(captcha['captcha'], (result) => {
    //   console.log('Report status: ' + result);
    // });
  }

});