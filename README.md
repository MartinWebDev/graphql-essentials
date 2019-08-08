# Running this app
Simply run `yarn start`

## Twitter
To use the Twitter queries/mutations, you will need to create a ".env" file and fill it with the values as shown in "example.env". You will need to get these values from Twitter's Developer page.

# Two methods
This app was built from the GraphQL Essentials course on LinkedIn Learning in file `schema.js`, then also refactored into the strongly typed version in file `schema2.js`.
Bit by bit the two methods are compared side by side as personally I prefer the strongly typed version.
Although the string template version is objectively easier to read, the object based version is less prone to error and easier to debug.

# Comparisons

## Basic Types
Template literal
```typescript
enum Gender {
    MALE,
    FEMALE,
    OTHER
}

type Contact {
    type:   String!,
    email:  String!,
    phone:  String
}

type Friend {
    id: ID,
    firstName:  String,
    lastName:   String, 
    gender:     Gender, 
    language:   String,
    contact:    [Contact]!
}
```

Object-oriented
```javascript
const GenderType = new GraphQLEnumType({
    name: "Gender",
    values: {
        MALE:   { value: "Male" },
        FEMALE: { value: "Female" },
        OTHER:  { value: "Other" }
    }
});

const ContactType = new GraphQLObjectType({
    name: "Contact", 
    description: "This is the contact details",
    fields: () => ({
        type:   { type: GraphQLString, resolve: c => c.type },
        email:  { type: GraphQLString, resolve: c => c.email },
        phone:  { type: GraphQLString, resolve: c => c.phone }
    })
});

const FriendType = new GraphQLObjectType({
    name: "Friend", 
    description: "This is the friend info",
    fields: () => ({
        id:         { type: GraphQLID,                  resolve: f => f.id },
        firstName:  { type: GraphQLString,              resolve: f => f.firstName },
        lastName:   { type: GraphQLString,              resolve: f => f.lastName },
        gender:     { type: GenderType,                 resolve: f => f.gender },
        language:   { type: GraphQLString,              resolve: f => f.language },
        contact:    { type: GraphQLList(ContactType),   resolve: f => f.contact }
    })
});
```
