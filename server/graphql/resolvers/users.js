const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const Message = require("../../models/Message");

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        let users = await User.find();
        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    getConversations: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        let users = await User.find();
        return users.map(async (otherUser) => {
          const latestMessage = await Message.find({
            $or: [
              { from: user.ID, to: otherUser._id },
              { to: user.ID, from: otherUser._id },
            ],
          })
            .limit(1)
            .sort({ createdAt: -1 });
          if (latestMessage.length > 0) {
            const custom = {
              user: otherUser,
              latestMessage: latestMessage,
            };
            console.log(custom);
            return custom;
          }
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password === "") errors.password = "password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({ username: username });

        if (!user) {
          errors.username = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }

        const token = jwt.sign(
          { username: username, ID: user._id },
          "JWT_SECRET_WORD_#$",
          {
            expiresIn: 60 * 60,
          }
        );

        return {
          ...user.toJSON(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};

      try {
        // Validate input data
        if (email.trim() === "") errors.email = "email must not be empty";
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password.trim() === "")
          errors.password = "password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "repeat password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "passwords must match";
        /**
         *  Check if the username or email already exist
         */
        const userByUsername = await User.findOne({ username: username });
        const userByEmail = await User.findOne({ email: email });

        if (userByUsername) errors.username = "Username is taken";
        if (userByEmail) errors.email = "Email is taken";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Hash password
        password = await bcrypt.hash(password, 6);
        console.log({
          username: username,
          email: email,
          password: password,
          createdAt: new Date().toISOString(),
        });
        // Create user
        const user = new User({
          username: username,
          email: email,
          password: password,
          createdAt: new Date().toISOString(),
        });
        await user.save();
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
