import express from "express";
import graphqlHTTP from "express-graphql";

// import schema from "./schema";
import schema from "./schema2";
import resolvers from "./resolvers";

// Setup express server
const app = express();

app.get("/", (req, res) => {
    res.send(`You are here on ${req.protocol}://${req.host}${req.path}`);
});

const root = resolvers;

app.use("/graphql", graphqlHTTP({
    schema, 
    rootValue: root,
    graphiql: true
}));

app.listen(8080, () => {
    console.log("Started...");
});