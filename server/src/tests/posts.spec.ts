import chai, { expect } from "chai";
import { app, authToken, currentUser } from "./helpers/tests-helper";
import { UNAUTHORIZED, OK, UNPROCESSABLE_ENTITY } from "http-status-codes";
import Post, { IPostDocument } from "../models/Post";
import bcrypt from "bcryptjs";
import User from "../models/User";
import config from "../config/config";

const bodyToTest = {
  body: "body"
};

let post: IPostDocument;
let userToken: string;

before(async () => {
  // 创建新的 Post
  const newPost = new Post({
    ...bodyToTest,
    user: currentUser!._id
  });
  post = await newPost.save();

  // 注册一个新用户
  const hashedPassword = await bcrypt.hash(config.user.password, 10);
  const newUser = new User({
    username: "correctotherusername",
    email: config.user.email,
    password: hashedPassword
  });
  const user = await newUser.save();
  userToken = user.generateToken();
});

describe("Read Post", () => {
  describe("GET /api/posts", () => {
    it("显示所有的 posts", async () => {
      const res = await chai.request(app).get("/api/posts");

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.docs).to.have.lengthOf(1);
      expect(res.body.data).to.have.property("page");
    });

    it("分页", async () => {
      const res = await chai.request(app).get("/api/posts?page=2");

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property("docs");
      expect(res.body.data).to.have.property("page");
      expect(res.body.data.page).to.equal("2");
    });
  });

  describe("GET /api/posts/:id", () => {
    it("显示单个 post", async () => {
      const res = await chai.request(app).get(`/api/posts/${post._id}`);

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property("post");
    });
  });
});

describe("Create Post", () => {
  describe("POST /api/posts", () => {
    context("如果没有登录时", () => {
      it("不能创建 Post", async () => {
        const res = await chai
          .request(app)
          .post("/api/posts")
          .send(bodyToTest);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });
    });

    context("如果有登录时", () => {
      it("没有填写 body 不能创建 Post", async () => {
        const res = await chai
          .request(app)
          .post("/api/posts")
          .set("Authorization", authToken)
          .send({ body: "" });

        expect(res).to.have.status(UNPROCESSABLE_ENTITY);
        expect(res.body.success).to.equal(false);
        expect(res.body.errors).to.have.property("body");
      });

      it("填写了 body 可以创建 Post", async () => {
        const res = await chai
          .request(app)
          .post("/api/posts")
          .set("Authorization", authToken)
          .send(bodyToTest);

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property("message");
        expect(res.body.data).to.have.property("post");
      });
    });
  });
});

describe("Update Post", () => {
  describe("PUT /api/posts/:id", () => {
    context("如果没有登录时", () => {
      it("不能更新 Post", async () => {
        const res = await chai
          .request(app)
          .put(`/api/posts/${post._id}`)
          .send(bodyToTest);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });
    });

    context("如果有登录时", () => {
      it("body 为空不能更新 Post", async () => {
        const res = await chai
          .request(app)
          .put(`/api/posts/${post._id}`)
          .set("Authorization", authToken)
          .send({ body: "" });

        expect(res).to.have.status(UNPROCESSABLE_ENTITY);
        expect(res.body.success).to.equal(false);
        expect(res.body.errors).to.have.property("body");
      });

      it("只能更新自己的 Post", async () => {
        const res = await chai
          .request(app)
          .put(`/api/posts/${post._id}`)
          .set("Authorization", `Bearer ` + userToken)
          .send({ body: "newBody" });

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });

      it("填写了 body 可以更新 Post", async () => {
        const res = await chai
          .request(app)
          .put(`/api/posts/${post._id}`)
          .set("Authorization", authToken)
          .send({ body: "newBody" });

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property("message");
        expect(res.body.data).to.have.property("post");
        expect(res.body.data.post.body).to.equal("newBody");
      });
    });
  });
});

describe("Like Post", () => {
  describe("POST /api/posts/:id/like", () => {
    context("如果没有登录时", () => {
      it("不能喜欢 Post", async () => {
        const res = await chai.request(app).post(`/api/posts/${post._id}/like`);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });
    });

    context("如果有登录时", () => {
      it("喜欢 Post", async () => {
        const res = await chai
          .request(app)
          .post(`/api/posts/${post._id}/like`)
          .set("Authorization", authToken);

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.post.likes).to.not.be.empty;
      });

      it("不喜欢 Post", async () => {
        const res = await chai
          .request(app)
          .post(`/api/posts/${post._id}/like`)
          .set("Authorization", authToken);

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.post.likes).to.be.empty;
      });
    });
  });
});

describe("Create Comment", () => {
  describe("POST /api/posts/:id/comments", () => {
    context("如果没有登录时", () => {
      it("不能创建评论", async () => {
        const res = await chai
          .request(app)
          .post(`/api/posts/${post._id}/comments`)
          .send(bodyToTest);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });
    });

    context("如果有登录时", () => {
      it("内容为空不能创建评论", async () => {
        const res = await chai
          .request(app)
          .post(`/api/posts/${post._id}/comments`)
          .send({ body: "" })
          .set("Authorization", authToken);

        expect(res).to.have.status(UNPROCESSABLE_ENTITY);
        expect(res.body.success).to.equal(false);
        expect(res.body.errors).to.have.property("body");
      });

      it("提交内容可以创建评论", async () => {
        const res = await chai
          .request(app)
          .post(`/api/posts/${post._id}/comments`)
          .send(bodyToTest)
          .set("Authorization", authToken);

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.post.comments).to.not.be.empty;
      });
    });
  });
});

describe("Delete Comment From Post", () => {
  let findPost: IPostDocument | null;
  beforeEach(async () => {
    findPost = await Post.findById(post.id);
  });

  describe("DELETE /api/posts/:id/comments/:commentId", () => {
    context("如果没有登录时", () => {
      it("不能删除评论", async () => {
        const res = await chai
          .request(app)
          .delete(
            `/api/posts/${post._id}/comments/${findPost!.comments[0]._id}`
          );

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });
    });

    context("如果有登录时", () => {
      it("不能删除别人的评论", async () => {
        const res = await chai
          .request(app)
          .delete(
            `/api/posts/${post._id}/comments/${findPost!.comments[0]._id}`
          )
          .set("Authorization", `Bearer ` + userToken);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });

      it("可以删除评论", async () => {
        const res = await chai
          .request(app)
          .delete(
            `/api/posts/${post._id}/comments/${findPost!.comments[0]._id}`
          )
          .set("Authorization", authToken);

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.post.comments).to.be.empty;
      });
    });
  });
});

describe("Delete Post", () => {
  describe("DELETE /api/posts/:id", () => {
    context("如果没有登录时", () => {
      it("不能删除 Post", async () => {
        const res = await chai.request(app).delete(`/api/posts/${post._id}`);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });
    });

    context("如果有登录时", () => {
      it("不能删除别人的 Post", async () => {
        const res = await chai
          .request(app)
          .delete(`/api/posts/${post._id}`)
          .set("Authorization", `Bearer ` + userToken);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });

      it("成功删除 Post", async () => {
        const res = await chai
          .request(app)
          .delete(`/api/posts/${post._id}`)
          .set("Authorization", authToken);

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property("message");
      });
    });
  });
});
