const puppeteer = require('puppeteer');
const dbc = require('./deathbycaptcha.js');
require('dotenv').config();

const chromeOptions = {
  headless: false,
  defaultViewport: null,
  slowMo: 50,
};

const username = process.env.DBC_USERNAME;
const password = process.env.DBC_PASSWORD;
const client = new dbc.HttpClient(username, password) // for http client

const token_params = JSON.stringify({
  'googlekey': '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
  'pageurl': 'https://old.reddit.com/login'
});

// client.get_user(user => {
//   response = user;
//   console.log(user);
// });


(async function main() {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.goto('https://old.reddit.com/login');


  await page.type('#user_reg', 'lucas_rmp');
  await page.type('#passwd_reg', '18069970');
  await page.type('#passwd2_reg', '18069970');
  await page.type('#email_reg', 'lucas.rmagalhaes@gmail.com');

  try {

    client.decode({ extra: { type: 4, token_params: token_params, } }, async captcha => {
      if (captcha) {
        console.log(captcha);
        if (!captcha.is_correct) {
          client.report(captcha['captcha'], (result) => {
            console.log('Report status: ' + result);
          });
        }
        else {
          console.log(captcha['text']);
          page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML=${captcha['text']}`).then(() => {
            console.log("IT WORKS!");
          });
        }
      }
    });
  }
  catch (err) {
    console.error("AN ERROR OCURRED", err);
  }
})()