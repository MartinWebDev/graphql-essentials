import { buildSchema } from "graphql";

const schema = buildSchema(`
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

    enum Gender {
        MALE,
        FEMALE,
        OTHER
    }

    type Query {
        getFriend(id: ID): Friend
    }


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

    type Mutation {
        createFriend(input: FriendInput): Friend
    }
`);

export default schema;
