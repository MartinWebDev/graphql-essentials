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

// Additional stuff for Twitter
import Tweeter from "./tweeter";

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
const TweetType = new GraphQLObjectType({
    name: "Tweet", 
    description: "Twitter Tweet information",
    fields: () => ({
        date: { type: GraphQLString, resolve: t => t.created_at },
        id: { type: GraphQLString, resolve: t => t.id.toString() },
        text: { type: GraphQLString, resolve: t => t.full_text || t.text },
        username: { type: GraphQLString, resolve: t => t.user.screen_name },
        retweets: { type: GraphQLInt, resolve: t => t.retweet_count },
        likes: { type: GraphQLInt, resolve: t => t.favorite_count }
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
