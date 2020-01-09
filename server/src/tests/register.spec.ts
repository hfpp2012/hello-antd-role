import chai, { expect } from "chai";
import { app } from "./helpers/tests-helper";
import config from "../config/config";
import { UNPROCESSABLE_ENTITY, OK } from "http-status-codes";

export const userToRegister = {
  username: config.user.username,
  password: config.user.password,
  email: config.user.email,
  confirmPassword: config.user.password
};

describe("Register", () => {
  describe("POST /api/users/register", () => {
    it("用户名为空会报错", async () => {
      let user = { ...userToRegister };
      user.username = "";

      const res = await chai
        .request(app)
        .post("/api/users/register")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("username");
    });

    it("密码为空会报错", async () => {
      let user = { ...userToRegister };
      user.password = "";

      const res = await chai
        .request(app)
        .post("/api/users/register")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("password");
    });

    it("确认密码不匹配会报错", async () => {
      let user = { ...userToRegister };
      user.confirmPassword = `wrong${user.password}`;

      const res = await chai
        .request(app)
        .post("/api/users/register")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("confirmPassword");
    });

    it("邮箱为空会报错", async () => {
      let user = { ...userToRegister };
      user.email = "";

      const res = await chai
        .request(app)
        .post("/api/users/register")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("email");
    });

    it("邮箱格式不正确会报错", async () => {
      let user = { ...userToRegister };
      user.email = "wrongemail";

      const res = await chai
        .request(app)
        .post("/api/users/register")
        .send(user);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("email");
    });

    it("用户名存在会报错", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/register")
        .send(userToRegister);

      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.have.property("username");
    });

    it("正常注册返回 token", async () => {
      let user = { ...userToRegister };
      user.username = "correctusername";

      const res = await chai
        .request(app)
        .post("/api/users/register")
        .send(user);

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property("token");
    });
  });
});
