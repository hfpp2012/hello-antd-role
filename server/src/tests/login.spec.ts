import chai, { expect } from "chai";
import { app } from "./helpers/tests-helper";
import config from "../config/config";
import { UNPROCESSABLE_ENTITY, OK } from "http-status-codes";

const userToLogin = {
  username: config.user.username,
  password: config.user.password
};

describe("Login", () => {
  describe("POST /api/users/login", () => {
    it("用户名正确而密码不正确不能登录", async () => {
      let user = { ...userToLogin };
      user.password = `wrong${user.password}`;

      const res = await chai
        .request(app)
        .post("/api/users/login")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("general");
    });

    it("用户名不存在时不能登录", async () => {
      let user = { ...userToLogin };
      user.username = `wrong${user.username}`;

      const res = await chai
        .request(app)
        .post("/api/users/login")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("general");
    });

    it("用户名没有填写时报错", async () => {
      let user = { ...userToLogin };
      user.username = "";

      const res = await chai
        .request(app)
        .post("/api/users/login")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("username");
    });

    it("以正确的用户名和密码可以登录", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/login")
        .send(userToLogin);

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property("token");
    });
  });
});
