require("dotenv").config()

var Twitter = require("twitter");

const config = {
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
};

class Tweeter {
    constructor() {
        this.client = new Twitter({
            consumer_key: config.consumerKey,
            consumer_secret: config.consumerSecret,
            access_token_key: config.accessToken,
            access_token_secret: config.accessTokenSecret
        });
    }

    getTweetsFromUser = (username) => {
        return new Promise((res, rej) => {
            this.client.get("search/tweets", {q: `from:${username}`, tweet_mode: "extended"}, (error, tweets, response) => {
                res(tweets.statuses);
            });
        });
    };

    getTweetsFromHashtag = (hashtag) => {
        return new Promise((res, rej) => {
            this.client.get("search/tweets", {q: `#${hashtag}`, tweet_mode: "extended"}, (error, tweets, response) => {
                res(tweets.statuses);
            });
        });
    };
}

export default Tweeter;
