require('dotenv').config()
require('es6-promise').polyfill();
require('isomorphic-fetch');

var Twitter = require('twitter');

const config = {
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
};

const client = new Twitter({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token_key: config.accessToken,
    access_token_secret: config.accessTokenSecret
});

const username = process.env.USERNAME;

client.get('search/tweets', {q: `from:${username}`}, function(error, tweets, response) {
    // console.log(error);
    // console.log(tweets);
    // console.log(response);
    console.log(tweets.statuses[0]);
 });

// const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'Authorization': `OAuth oauth_consumer_key="${config.consumerKey}", oauth_signature_method="HMAC-SHA1",oauth_timestamp="1565222746", oauth_token="${config.accessToken}", oauth_version="1.0"`
// };

// // > GET /1.1/search/tweets.json?q=from%3AALogicalBrain HTTP/1.1
// // > Host: api.twitter.com
// // > User-Agent: insomnia/6.5.4
// // > Cookie: lang=en; guest_id=v1%3A156522234089308821; personalization_id="v1_pg68jN1bXzwnYJLpZcmebw=="
// // > Authorization: OAuth 
// //        oauth_consumer_key="g2r9F7Kf5ZRbQb17Pj5e9Qxkr", 
// //        oauth_nonce="UhrBtyQKzLB5q3wgp2pxJo44MEDCVFIW", 
// //        oauth_signature="aSY7MlqcSVu4D5JIBVm2nTrVmak%3D", 
// //        oauth_signature_method="HMAC-SHA1", 
// //        oauth_timestamp="1565222746", 
// //        oauth_token="1128572439040970753-YaYfXgdpDFRoyqNRnXeRH3R2ezd3WL", 
// //        oauth_version="1.0"
// // > Accept: */*

// fetch("https://api.twitter.com/1.1/search/tweets.json?q=from%3AALogicalBrain", {mode: 'cors', headers: headers}).then((res) => {
//     console.log(res);
// });

