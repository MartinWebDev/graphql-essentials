import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList
} from "graphql";

const ContactType = new GraphQLObjectType({
    name: "Contact", 
    description: "This is the contact details",
    fields: () => ({
        type: { type: GraphQLString, resolve: c => c.type },
        email: { type: GraphQLString, resolve: c => c.email },
        phone: { type: GraphQLString, resolve: c => c.phone }
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
            friend: {
                type: FriendType,
                resolve: (root) => {
                    return {
                        ID: 123456789,
                        firstName: "Martin",
                        lastName: "Wood",
                        gender: "Male",
                        language: "English",
                        contact: []
                    };
                }
            }
        })
    }),
    // mutation: new GraphQLObjectType({})
});

export default schema;
