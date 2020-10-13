const { ApolloServer } = require('apollo-server')
const mongoose = require("mongoose");
const MONGO_CONNECTION = require("./db/db")

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
const contextMiddleware = require('./auth/auth-check');
/**
 *  ======================
 *   CREATE APOLLO SERVER
 *  ======================
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  /**
   *  ======================
   *   Connect to MongoDB
   *  ======================
   * 
   *  ======================
   *    ./db/db.js
   *  ======================
   */
  mongoose
    .connect(
      MONGO_CONNECTION,
      { useNewUrlParser: true },
      { useUnifiedTopology: true }
    )
    .then(() => {
      /**
       *  =================================
       *   succesfully connected to mongoDB
       *  =================================
       */
      console.log("Connected 🚀 To MongoDB Successfully");
    });
});
