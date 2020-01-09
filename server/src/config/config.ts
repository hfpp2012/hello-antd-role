import "dotenv/config";

const isTestEnvironment = process.env.NODE_ENV === "test";

export default {
  environment: process.env.NODE_ENV || "development",
  host: process.env.APP_HOST || "127.0.0.1",
  port:
    (isTestEnvironment ? process.env.TEST_APP_PORT : process.env.APP_PORT) ||
    "6060",
  auth: {
    secretKey: process.env.JWT_SECRET_KEY || "4C31F7EFD6857D91E729165510520424",
    adminSecretKey:
      process.env.ADMIN_JWT_SECRET_KEY || "4C31F7EFD6857D91E729165510520424"
  },
  db: {
    host: isTestEnvironment
      ? process.env.TEST_MONGODB_URL
      : process.env.MONGODB_URL,
    port: isTestEnvironment
      ? process.env.TEST_MONGODB_PORT
      : process.env.MONGODB_PORT,
    database: isTestEnvironment
      ? process.env.TEST_MONGODB_DATABASE
      : process.env.MONGODB_DATABASE
  },
  superAdmin: {
    username: process.env.SUPER_ADMIN_USERNAME || "qiuzhi99",
    password: process.env.SUPER_ADMIN_PASSWORD || "12345678"
  },
  basicAdmin: {
    username: process.env.BASIC_ADMIN_USERNAME || "hfpp2012",
    password: process.env.BASIC_ADMIN_PASSWORD || "12345678"
  },
  user: {
    username: process.env.USERNAME || "hfpp2012",
    password: process.env.PASSWORD || "12345678",
    email: process.env.EMAIL || "hfpp2012@gmail.com"
  },
  logging: {
    dir: process.env.LOGGING_DIR || "logs",
    level: process.env.LOGGING_LEVEL || "debug"
  }
};
