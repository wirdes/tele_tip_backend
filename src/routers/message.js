const express = require("express");
const { getUserAllMessage } = require("../controllers/messages");
const router = express.Router();

router.post("/getUserAllMessage", getUserAllMessage);

module.exports = router;
