const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/:id", authController.protect, userController.getUser);
router.get(
  "/:id/friends",
  authController.protect,
  userController.getUserFriends
);
router.get(
  "/:id/:friendId",
  authController.protect,
  userController.addRemoveFriend
);

module.exports = router;
