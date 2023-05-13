const express = require("express");
const router = express.Router();
const taskController = require("../Controller/taskController.js");
const isAuthenticated = require("../Middleware/auth.js");

router.post("/addtask", isAuthenticated, taskController.addTask);
router.get("/getTask", isAuthenticated, taskController.getTask);
router.get("/removeTask/:taskId", isAuthenticated, taskController.removeTask);
router.put("/editTask/:taskId", isAuthenticated, taskController.editTask);
router.post(
  "/markCompleted/:taskId",
  isAuthenticated,
  taskController.markCompleted
);
module.exports = router;
