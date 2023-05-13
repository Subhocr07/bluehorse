const signupModal = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Register = (req, res) => {
  let { name, email, password, cpassword } = req.body;
  console.log(req.body);

  if (!email || !password || !cpassword || !name) {
    return res.status(400).json({ message: "Please Fill the Field" });
  }

  signupModal.findOne({ email: email }).then((exist) => {
    if (exist) {
      return res.status(400).json({ message: "User Already Exist" });
    } else {
      if (password == cpassword) {
        bcrypt.hash(password, 10).then((hashpassword) => {
          signupModal
            .create({
              name,
              email: email,
              password: hashpassword,
            })
            .then((data) => {
              res.status(200).json({ message: "User Successfully Created" });
            });
        });
      } else {
        res.status(400).json({ message: "Password Mismatch" });
      }
    }
  });
};
exports.Login = (req, res) => {
  console.log(req.body);
  let { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json("Please Fill Your Login Details");
  }

  signupModal.findOne({ email: email }).then((exist) => {
    if (exist) {
      bcrypt.compare(password, exist.password).then((check) => {
        if (check) {
          const token = jwt.sign(exist.email, process.env.SECRET_KEY);
          res.status(200).json({ token });
        } else {
          return res.status(400).json({ error: "Invalid User Credentials" });
        }
      });
    } else {
      return res.status(400).json({ error: "User Does Not Exist" });
    }
  });
};
