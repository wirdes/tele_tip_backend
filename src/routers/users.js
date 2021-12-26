const express = require("express");
const router = express.Router();
const {
  emailCheck,
  passwordCheck,
  nameAndSurnameCheck,
} = require("../helpers/validations/validations");
const {
  register,
  login,
  getUser,
  uploadImage,
} = require("../controllers/users");

router.get("/", (req, res) => {
  res.send("FINAL PROJECT BACKEND SYSTEMS");
});

router.post(
  "/register",
  emailCheck,
  passwordCheck,
  nameAndSurnameCheck,
  register
);

router.post("/login", passwordCheck, emailCheck, login);
router.post("/getUser", getUser);
router.post("/uploadImage", uploadImage);

module.exports = router;
