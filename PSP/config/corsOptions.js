const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      console.log("allowedOrigins--->", allowedOrigins.indexOf(origin));

      callback(null, true);
    } else {
      // callback(null, true);
      console.log("dsasdaasdasdasdasd");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
