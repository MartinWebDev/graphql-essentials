# Running this app
Simply run `yarn start`

# Two methods
This app was built from the GraphQL Essentials course on LinkedIn Learning in file `schema.js`, then also refactored into the strongly typed version in file `schema2.js`.
Bit by bit the two methods are compared side by side as personally I prefer the strongly typed version.
Although the string template version is objectively easier to read, the object based version is less prone to error and easier to debug.

# Comparisons

## Basic Types
Template literal
```typescript
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
```

Object-oriented
```javascript
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
        id: { type: GraphQLID, resolve: f => f.id },
        firstName: { type: GraphQLString, resolve: f => f.firstName },
        lastName: { type: GraphQLString, resolve: f => f.lastName },
        gender: { type: GenderType, resolve: f => f.gender },
        language: { type: GraphQLString, resolve: f => f.language },
        contact: { type: GraphQLList(ContactType), resolve: f => f.contact }
    })
});
```