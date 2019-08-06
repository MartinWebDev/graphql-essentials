import crypto from "crypto";

import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
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
    description: "This is the contact input",
    fields: () => ({
        type: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLString }
    })
});

const GenderType = new GraphQLEnumType({
    name: "Gender",
    values: {
        MALE: { value: "Male" },
        FEMALE: { value: "Female" },
        OTHER: { value: "Other" }
    }
});

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
            }
        })
    })
});

export default schema;
