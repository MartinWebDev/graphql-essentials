// In-Memory data store
class Friend {
    constructor(id, { firstName, lastName, gender, language, contact }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.language = language;
        this.contact = contact;
    }
}

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

// Setup graphql
const resolvers = {
    getFriend: ({ id }) => {
        return new Friend(id, friendDatabase[id]);
    },
    createFriend: ({ input }) => {
        let id = require("crypto").randomBytes(10).toString("hex");
        friendDatabase[id] = input;
        return new Friend(id, input);
    }
};

export default resolvers;
