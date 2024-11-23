const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const {
  error,
  disconnected,
  termination,
  mongoose_start,
} = require("../utils/colorText");

dotenv.config();

/**
 * Sets the mongoDB connection url and the connection options
 * @returns
 */
exports.setEnvironment = async () => {
  let data = {};
  if (process.env.NODE_ENV == "test" || process.env.NODE_ENV == "development") {
    data.mongoUrl = process.env.MONGODB;
  } else {
    data.mongoUrl = process.env.MONGODB_PROD;
  }

  if (process.env.NODE_ENV == "production") {
    data.connectionSetup = {
      tlsAllowInvalidHostnames: true,
      tls: true,
      tlsCAFile: path.join(
        __dirname,
        "../certificates/rds-combined-ca-bundle.pem"
      ),
      auth: {
        user: process.env.DOCUMENT_DB_USER,
        password: process.env.DOCUMENT_DB_PASSWORD,
      },
    };
  } else {
    data.connectionSetup = {};
  }
  console.log("sdasdaasdsadas----->", data);
  return data;
};

/**
 * Connects to the database
 * @param {string} mongoUrl
 * @param {object} connectionSetup
 */
exports.connectToDB = async (mongoUrl, connectionSetup) => {
  try {
    mongoose.connect(mongoUrl, connectionSetup);

    mongoose.connection.on("connected", () => {
      if (process.env.NODE_ENV !== "test") {
        console.log(
          mongoose_start(
            "Mongoose default connection is open to",
            process.env.NODE_ENV === "test"
              ? process.env.MONGODB_TEST
              : process.env.MONGODB
          )
        );
      }
    });

    mongoose.connection.on("error", (err) => {
      console.log(
        error("Mongoose default connection ERROR has occured", err.message)
      );
    });

    mongoose.connection.on("disconnected", () => {
      if (process.env.NODE_ENV !== "test") {
        console.log(
          disconnected("Mongoose default connection is disconnected")
        );
      }
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        termination(
          "Mongoose default connection is disconnected due to application termination"
        )
      );
      process.exit(0);
    });
  } catch (err) {
    console.error(
      error("Mongoose default connection ERROR has occured", err.message)
    );
    process.exit(1);
  }
};

(async () => {
  const envConfig = await exports.setEnvironment();
  await exports.connectToDB(envConfig.mongoUrl, envConfig.connectionSetup);
})();
