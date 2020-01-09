import mongoose from "mongoose";
import "dotenv/config";
import faker from "faker";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import bcrypt from "bcryptjs";
import config from "../config/config";

const main = async () => {
  const mongodbUrl = `${config.db.host}:${config.db.port}/${config.db.database}`;
  await mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("connected");
  console.log("---------");

  const hashedPassword = await bcrypt.hash("12345678", 10);
  const users = await User.find();
  if (users.length === 0) {
    for (let i = 0; i < 10; i++) {
      const newUser = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashedPassword
      });
      const user = await newUser.save();
      console.log("create user - ", user.username, " with password '12345678'");

      for (let i = 0; i < 10; i++) {
        const newPost = new Post({
          user: user._id,
          body: faker.lorem.paragraphs()
        });
        const post = await newPost.save();
        console.log("create post for user ", user.username, ` ${post._id}`);

        for (let i = 0; i < 5; i++) {
          const newComment = new Comment({
            user: user._id,
            body: faker.lorem.paragraphs(),
            post: post._id
          });
          const comment = await newComment.save();
          console.log(
            "create comment for user ",
            user.username,
            ` ${comment._id}`
          );

          post.comments.unshift(comment._id);
          await post.save();
        }

        console.log();
      }
      console.log("---------");
    }
  }

  await mongoose.connection.close();
  console.log("disconnected");
};

process.on("beforeExit", async () => {
  await main();
  process.exit(0); // if you don't close yourself this will run forever
});
