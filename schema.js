import { buildSchema } from "graphql";

const schema = buildSchema(`
    // Enums
    enum Gender {
        MALE,
        FEMALE,
        OTHER
    }

    // Types
    type Contact {
        type: String!,
        email: String!,
        phone: String
    }

    type Friend {
        id: ID,
        firstName: String,
        lastName: String, 
        gender: Gender, 
        language: String,
        contact: [Contact]!
    }

    // Input types
    input ContactInput {
        type: String!,
        email: String!,
        phone: String
    }

    input FriendInput {
        firstName: String!,
        lastName: String!, 
        gender: Gender!, 
        language: String!,
        contact: [ContactInput]
    }

    // Query
    type Query {
        getFriend(id: ID): Friend
    }

    // Mutation
    type Mutation {
        createFriend(input: FriendInput): Friend
    }
`);

export default schema;
