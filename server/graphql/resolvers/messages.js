const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");
const Message = require("../../models/Message");
const User = require("../../models/user");

module.exports = {
  Query: {
    getMessages: async (_, { from, start, limit }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        console.log(from + "_____" + start + "____" + limit);
        const otherUser = await User.findById(from);
        if (!otherUser) throw new UserInputError("User not found");

        const messages = await Message.find({
          $or: [
            { from: user.ID, to: from },
            { to: user.ID, from: from },
          ],
        })
          .skip(start)
          .limit(limit)
          .sort({ createdAt: -1 });

        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, args, { user, pubsub }) => {
      const { to, content } = args;
      console.log("args => " + user.ID + "__________________" + to + content);
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const recipient = await User.findById(to);

        if (!recipient) {
          throw new UserInputError("User not found");
        }

        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }

        const message = new Message({
          from: user.ID,
          to: to,
          content: content,
          createdAt: new Date().toISOString(),
        });
        await message.save();

        pubsub.publish("NEW_MESSAGE", { newMessage: message });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, _, { user }) => {
          console.log(newMessage);
          console.log(user);
          const { from, to } = newMessage;
          const ID = user.ID;
          if (
            from.toString() === ID.toString() ||
            to.toString() === ID.toString()
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
