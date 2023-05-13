const taskModel = require("../model/taskModel.js");

exports.addTask = async (req, res) => {
  const { title, description } = req.body;
  console.log(req.body);
  const userId = req.user;
  const newTask = new taskModel({
    title,
    description,
    completed: false,
    userId,
  });
  newTask
    .save()
    .then(() => {
      return res.status(200).json({ message: "Task added successfully" });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
};

exports.getTask = async (req, res) => {
  taskModel
    .find({ userId: req.user })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(501).json({ message: error.message }));
};

exports.removeTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const deletedTask = await taskModel.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editTask = async (req, res) => {
  const taskId = req.params.taskId;
  const { title, description, completed } = req.body;

  try {
    const task = await taskModel.findByIdAndUpdate(
      taskId,
      { title, description, completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.markCompleted = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Mark task as completed
    task.completed = true;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
