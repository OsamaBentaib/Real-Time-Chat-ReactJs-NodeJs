const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    createdAt: String!
    token: String
  }
  type Message {
    content: String!
    from: ID!
    to: ID!
    createdAt: String!
  }
  type conversations {
    user: User!
    latestMessage: [Message]!
  }
  type Query {
    getUsers: [User]!
    getConversations: [conversations]
    login(username: String!, password: String!): User!
    getMessages(from: ID!, start: Int!, limit: Int!): [Message]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: ID!, content: String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`;
