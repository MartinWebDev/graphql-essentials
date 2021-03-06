import crypto from "crypto";

import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} from "graphql";

import { GraphQLDateTime } from "./GraphQLTypes/GraphQLDateTime";

// Additional stuff for Twitter
import Tweeter from "./tweeter";
import { globalAgent } from "https";

// "Database"
const friendDatabase = {};
friendDatabase[`123456789`] = {
    firstName: "Martin",
    lastName: "Wood", 
    gender: "Male", 
    language: "English",
    contact: [
        { type: "Primary", email: "martin@graphql.com", phone: "01234597890" }
    ]
};

/**
 * Enums
 */
const GenderType = new GraphQLEnumType({
    name: "Gender",
    values: {
        MALE: { value: "Male" },
        FEMALE: { value: "Female" },
        OTHER: { value: "Other" }
    }
});

/**
 * Contact for Friend (Type and Input)
 */
const ContactType = new GraphQLObjectType({
    name: "Contact", 
    description: "This is the contact details",
    fields: () => ({
        type: { type: GraphQLString, resolve: c => c.type },
        email: { type: GraphQLString, resolve: c => c.email },
        phone: { type: GraphQLString, resolve: c => c.phone }
    })
});

const ContactInput = new GraphQLInputObjectType({
    name: "ContactInput", 
    description: "This is the contact input",
    fields: () => ({
        type: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLString }
    })
});

/**
 * Friend (Type and Input)
 */
const FriendType = new GraphQLObjectType({
    name: "Friend", 
    description: "This is the friend info",
    fields: () => ({
        id: { type: GraphQLID, resolve: f => f.id },
        firstName: { type: GraphQLString, resolve: f => f.firstName },
        lastName: { type: GraphQLString, resolve: f => f.lastName },
        gender: { type: GenderType, resolve: f => f.gender },
        language: { type: GraphQLString, resolve: f => f.language },
        contact: { type: GraphQLList(ContactType), resolve: f => f.contact }
    })
});

const FriendInput = new GraphQLInputObjectType({
    name: "FriendInput", 
    description: "This is the friend input",
    fields: () => ({
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLNonNull(GenderType) },
        language: { type: GraphQLNonNull(GraphQLString) },
        contact: { type: GraphQLNonNull(GraphQLList(ContactInput)) }
    })
});

/**
 * Additional stuff just for twitter
 */
const TwitterSearchType = new GraphQLEnumType({
    name: "TwitterSearchType",
    values: {
        SCREENNAME: { value: "ScreenName" },
        HASHTAG: { value: "Hashtag" }
    }
});

const TwitterSearchInput = new GraphQLInputObjectType({
    name: "TwitterSearchInput",
    description: "Twitter object types for input",
    fields: () => ({
        type: { type: TwitterSearchType },
        value: { type: GraphQLString }
    })
});

const TweetType = new GraphQLObjectType({
    name: "Tweet", 
    description: "Twitter Tweet information",
    fields: () => ({
        date: { type: GraphQLDateTime, resolve: t => t.created_at },
        id: { type: GraphQLString, resolve: t => t.id.toString() },
        text: { type: GraphQLString, resolve: t => t.full_text || t.text },
        username: { type: GraphQLString, resolve: t => t.user.screen_name },
        retweets: { type: GraphQLInt, resolve: t => t.retweet_count },
        likes: { type: GraphQLInt, resolve: t => t.favorite_count }
    })
});

const TweetMultiSearchType = new GraphQLObjectType({
    name: "TweetMultiSearch", 
    description: "Twitter Tweet hashtags and users in one",
    fields: () => ({
        hashtags: { type: GraphQLList(TweetType), resolve: t => t.hashtags },
        users: { type: GraphQLList(TweetType), resolve: t => t.users }
    })
});

/**
 * Main Query/Mutation query
 */
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        description: "Main Query root",
        fields: () => ({
            getFriend: {
                type: FriendType,
                args: {
                    id: { type: GraphQLString }
                },
                resolve: (root, args) => {
                    return {
                        id: args.id, 
                        ...friendDatabase[args.id]
                    }
                }
            },
            getTweetsFromUser: {
                type: GraphQLList(TweetType),
                args: {
                    screenName: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: async (root, args) => {
                    const tweeter = new Tweeter();
                    const tweets = await tweeter.getTweetsFromUser(args.screenName);
                    return tweets;
                }
            },
            getTweetsFromHashtag: {
                type: GraphQLList(TweetType),
                args: {
                    hashtag: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: async (root, args) => {
                    const tweeter = new Tweeter();
                    const tweets = await tweeter.getTweetsFromHashtag(args.hashtag);
                    return tweets;
                }
            },
            getTweetsFromMultipleUsers: {
                type: GraphQLList(TweetType),
                args: {
                    screenNames: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
                },
                resolve: async (root, args) => {
                    let tweets = [];
                    const tweeter = new Tweeter();
                    
                    for (let i = 0; i < args.screenNames.length; i++) {
                        const gotTweets = await tweeter.getTweetsFromUser(args.screenNames[i]);
                        tweets.push(...gotTweets);
                    }

                    tweets = tweets.sort((a, b) => a.created_at <= b.created_at)
                    
                    return tweets;
                }
            },
            getTweetsOfMultipleObjects: {
                type: TweetMultiSearchType,
                args: {
                    searchCriteria: { type: GraphQLNonNull(GraphQLList(TwitterSearchInput)) }
                },
                resolve: async (root, args) => {
                    let tweetsHashtags = [];
                    let tweetsUsers = [];
                    const tweeter = new Tweeter();

                    for (let i = 0; i < args.searchCriteria.length; i++) {
                        let gotTweets = [];
                        console.log(args.searchCriteria[i].value);
                        switch (args.searchCriteria[i].type.toUpperCase()) {
                            case "SCREENNAME":
                                gotTweets = await tweeter.getTweetsFromUser(args.searchCriteria[i].value);
                                tweetsUsers.push(...gotTweets);
                                break;
                            case "HASHTAG":
                                gotTweets = await tweeter.getTweetsFromHashtag(args.searchCriteria[i].value);
                                console.log(gotTweets);
                                tweetsHashtags.push(...gotTweets);
                                break;
                        }
                    }

                    const tweets = {
                        hashtags: tweetsHashtags,
                        users: tweetsUsers
                    };

                    return tweets;
                }
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        description: "Main Mutation root",
        fields: () => ({
            addFriend: {
                type: FriendType,
                args: {
                    newFriend: { type: GraphQLNonNull(FriendInput) }
                },
                resolve: (root, args) => {
                    let id = crypto.randomBytes(10).toString("hex");
                    friendDatabase[id] = args.newFriend;
                    return {
                        id: id, 
                        ...friendDatabase[id]
                    }
                }
            },
            addTweet: {
                type: TweetType,
                args: {
                    text: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: async (root, args) => {
                    const tweeter = new Tweeter();
                    const newTweet = await tweeter.postTweet(args.text);
                    return newTweet;
                }
            }
        })
    })
});

export default schema;
