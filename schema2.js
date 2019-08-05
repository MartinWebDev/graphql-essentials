import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} from "graphql";

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
    description: "This is the contact details",
    fields: () => ({
        type: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const FriendType = new GraphQLObjectType({
    name: "Friend", 
    description: "This is the friend info",
    fields: () => ({
        ID: { type: GraphQLID, resolve: f => f.ID },
        firstName: { type: GraphQLString, resolve: f => f.firstName },
        lastName: { type: GraphQLString, resolve: f => f.lastName },
        gender: { type: GraphQLString, resolve: f => f.gender },
        language: { type: GraphQLString, resolve: f => f.language },
        contact: { type: GraphQLList(ContactType), resolve: f => f.contact }
    })
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        description: "Main Query root",
        fields: () => ({
            getFriend: {
                type: FriendType,
                args: {
                    ID: { type: GraphQLString }
                },
                resolve: (root, args) => {
                    return {
                        ID: args.ID, 
                        ...friendDatabase[args.ID]
                    }
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
                    firstName: { type: GraphQLNonNull(GraphQLString) },
                    lastName: { type: GraphQLNonNull(GraphQLString) },
                    gender: { type: GraphQLNonNull(GraphQLString) },
                    language: { type: GraphQLNonNull(GraphQLString) },
                    contact: { type: GraphQLNonNull(GraphQLList(ContactInput)) }
                },
                resolve: (root, args) => {
                    let id = require("crypto").randomBytes(10).toString("hex");
                    friendDatabase[id] = args;
                    return {
                        ID: id, 
                        ...friendDatabase[id]
                    }
                }
            }
        })
    })
});

export default schema;
