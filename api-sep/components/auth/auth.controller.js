const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const User = require("../user/models/user.model");
const sgMail = require("@sendgrid/mail");

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
//http://stopakambalaza.com/email-verification/60e7a1dc-cb22-4eae-9e8b-9b5a97169786 ovako treba da izgleda
//Proveriti samo gde ga redirektuje
const confirmEmail = async (emailToken, site, emailTo, userType) => {
  let server_port = process.env.PORT || 3000;
  serverUrl = process.env.FRONTEND_URL;
  const userTypeUrl = (userType = "email-verification");

  const emailVerificationUrl = `${serverUrl}/${userTypeUrl}/${emailToken}`;

  console.log("emailVerificationUrl--->", emailVerificationUrl);
  const message = {
    to: emailTo, // Recipient email
    from: process.env.SENDGRID_FROM, // Verified sender email
    subject: "Verifikuj svoj mail", // Email subject
    html: `<h1>Verifikujte svoj e-mail</h1>
           <p>Molimo vas da kliknete na link ispod kako biste verifikovali svoj e-mail:</p>
           <a href="${emailVerificationUrl}">Verifikujte svoj e-mail</a>`, // Email body
  };

  try {
    // Send the email
    await sgMail.send(message);

    return true; // Return true on success
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Return false on error
  }
};

exports.register = async (req, res) => {
  try {
    console.log("USAO");
    const exists = await User.exists({
      email: req.body.email,
      userType: "customer",
    });

    if (exists) {
      return res.status(401).json({
        message: "Korisnik vec postoji",
      });
    }

    if (!this.validateEmail(req.body.email)) {
      return res.status(401).json({
        message: "Email nije validan!",
      });
    }

    try {
      let data = req.body;
      let addressObj = req.body.address ? req.body : null;

      const user = new User(data);
      console.log("USER", user);
      const emailToken = uuidv4();
      user.emailToken = emailToken;
      user.role = "customer";
      if (req.body.authType == "basic") {
        await confirmEmail(emailToken, "shop", req.body.email, "customer");
      }
      user.PIB = data.PIB || null;
      user.companyName = data.companyName || null;

      console.log("Stigao2", user);

      const result = await user.save(); // Await the save() method

      console.log("user------->", user);
      req.user = user; // for logs

      // Uncomment if you want to handle address creation
      // if (addressObj !== null) {
      //   await handleCreateAddress(addressObj, user._id);
      // }

      return res.status(201).json({
        message: "Poslali smo email",
        user: result,
      });
    } catch (error) {
      console.log("register :: INNER TRY :: error =", error);
      res.status(500).json({
        message: error.message,
      });
    }
  } catch (error) {
    console.log("register :: OUTER TRY :: error =", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  let customerType = "customer";
  try {
    // Find user by email and userType
    const user = await User.findOne({
      email: req.body.email,
      userType: customerType,
    });
    if (!user) {
      return res.status(401).json({
        message: "Niste registrovani",
      });
    }

    // Handle basic authentication
    if (req.body.authType === "basic") {
      if (!user.validPassword(req.body.password)) {
        return res.status(401).json({
          message: "Neispravna lozinka",
        });
      }
      if (user.status !== "ACTIVE") {
        return res.status(401).json({
          message: "Niste potvrdili email adresu",
        });
      }
    } else {
      // Handle non-basic authentication OVO NI NE RADI KOD NAS
      if (req.body.authType !== user.authType) {
        return res.status(401).json({
          message: "Vec je registrovan korisnik",
          status: false,
        });
      }
    }

    // Create token and respond
    await createTokenAndRespond(res, user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const createTokenAndRespond = async (res, user) => {
  console.log(user.role);
  const token = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );

  // console.log("token", token);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 3600000,
  });

  return res.status(200).json({
    message: "Auth successful",
    token: token,
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: user.userType,
    role: user.role,
    expires: new Date(Date.now() + 43200000).toISOString(),
  });
};

exports.verifyEmail = async (req, res) => {
  try {
    const result = await processEmailVerification(
      req.params.userType,
      req.params.token,
      req
    );

    console.log(result);

    if (!result) {
      return res.status(404).json({
        message: "Nije dobar token",
      });
    }

    return res.status(200).json({
      message: "Uspesno ste verifikovali email adresu",
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const processEmailVerification = async (userType, token, request) => {
  try {
    // const model = await importModel("user");
    const result = await User.findOne({
      emailToken: token,
      userType: { $in: ["customer", "company"] },
    });

    if (!result) {
      return false;
    }
    console.log("Imammo result------->", result);
    result.email = result.email;
    result.emailToken = result.emailToken;
    result.emailToUpdate = "null";
    result.status = "ACTIVE";

    console.log("NAKON OBRADE RESULT------->", result);

    const save_data = await result.save();

    console.log("SAVE DATA", save_data);
    return save_data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// exports.forgotPassword = async (req, res) => {
//   const passwordToken = uuidv4();

//   let serverURI = await serverUrl(req.body.environment);
//   let server_port = await serverPort(req.body.environment);
//   let userType;
//   const possible_sign_paths = ["shop", "dashboard"];

//   if (
//     !req.body.environment ||
//     !possible_sign_paths.includes(req.body.environment)
//   ) {
//     return res.status(401).json({
//       message: response_messages.SIGN_IN_PATH_REQUIRED,
//     });
//   }

//   if (req.body.environment === "shop") {
//     userType = "customer";
//   }

//   if (req.body.environment === "dashboard") {
//     userType = "dashboard";
//   }

//   const passwordRecoveryUrl = `${
//     serverURI + `${server_port == null ? "" : server_port}`
//   }/password-reset/${passwordToken}`;

//   try {
//     const user = await User.findOne({
//       email: req.body.email,
//       authType: "basic",
//       userType: userType,
//     });
//     if (!user) {
//       return res.status(404).json({
//         message: response_messages.ACTIVATION_LINK_FAILED_M,
//       });
//     }
//     user.passwordToken = passwordToken;
//     const message = {
//       from: process.env.GMAIL_MAILER_FROM,
//       to: req.body.email,
//       subject: response_messages.PASSWORD_RESET_EMAIL_TITLE_M,
//       html:
//         response_messages.PASSWORD_RESET_BODY_M +
//         `:<br><br><br><a href="${passwordRecoveryUrl}">` +
//         response_messages.PASSWORD_RESET_LINK_TXT_M +
//         `</a>`,
//     };
//     try {
//       transporter
//         .sendMail(message)
//         .then((info) => {})
//         .catch(console.error);
//       await user.save();
//       req.user = user;
//       return res.json({
//         status: response_messages.PASSWORD_RESET_LINK_SENT_TXT_M,
//       });
//     } catch (error) {
//       return res.json({
//         message: error.message,
//       });
//     }
//   } catch (error) {
//     res.json({
//       message: error.message,
//     });
//   }
// };
