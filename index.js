import express from "express";
import graphqlHTTP from "express-graphql";

import schema from "./schema";

// Setup express server
const app = express();

// Setup graphql
const root = {
    friend: () => {
        return {
            id: 123456789,
            firstName: "Martin",
            lastName: "Wood", 
            gender: "Male", 
            language: "English",
            email: "martin@graphql.com"
        };
    }
};

app.get("/", (req, res) => {
    res.send(`You are here on ${req.protocol}://${req.host}${req.path}`);
});

app.use("/graphql", graphqlHTTP({
    schema, 
    rootValue: root,
    graphiql: true
}));

app.listen(8080, () => {
    console.log("Started...");
});