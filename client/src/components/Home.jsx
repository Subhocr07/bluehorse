import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("user");
        fetch("http://localhost:7000/user/tasks/gettask", {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.log(error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("user");

        // Create an object with the task data
        const taskData = {
            title,
            description,
            createdAt: new Date().toLocaleString(), // Add human-readable date
        };

        // Make a POST request to your backend API
        fetch("http://localhost:7000/user/tasks/addtask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(taskData),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Error adding task");
            })
            .then((data) => {
                console.log(data); // Optional: Display the response data
                setTasks([...tasks, taskData]); // Add the new task to the tasks array
                setTitle(""); // Clear the input field
                setDescription(""); // Clear the textarea field
                alert("Task added successfully"); // Display an alert
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                // Display an error message to the user or perform other error handling tasks
            });
    };

    const handleDelete = async (taskId) => {
        const token = localStorage.getItem("user");

        try {
            const response = await fetch(
                `http://localhost:7000/user/tasks/removetask/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            if (response.ok) {
                // Remove the deleted task from the tasks state
                setTasks(tasks.filter((task) => task._id !== taskId));
            } else {
                console.log("Failed to delete task");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleComplete = async (taskId) => {
        const token = localStorage.getItem("user");

        try {
            const response = await fetch(
                `http://localhost:7000/user/tasks/markcompleted/${taskId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify({ completed: true }),
                }
            );

            if (response.ok) {
                setTasks(
                    tasks.map((task) =>
                        task._id === taskId ? { ...task, completed: true } : task
                    )
                );
            } else {
                console.log("Failed to complete task");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (taskId) => {
        const token = localStorage.getItem("user");

        // Create an object with the updated task data
        const updatedTaskData = {
            title: editTitle,
            description: editDescription,
        };

        try {
            const response = await fetch(
                `http://localhost:7000/user/tasks/edittask/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(updatedTaskData),
                }
            );

            if (response.ok) {
                const updatedTask = await response.json();
                // Update the specific task in the tasks state
                setTasks(
                    tasks.map((task) =>
                        task._id === taskId ? updatedTask : task
                    )
                );
                setEditTaskId(null); // Clear the edit task ID
                setEditTitle(""); // Clear the edit title
                setEditDescription(""); // Clear the edit description
            } else {
                console.log("Failed to edit task");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditButtonClick = (taskId, title, description) => {
        setEditTaskId(taskId);
        setEditTitle(title);
        setEditDescription(description);
    };

    console.log(tasks)

    return (
        <div className="container">
            <h1>Tasks:</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter task description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add Task
                </Button>
            </Form>
            <table className="table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, i) => (
                        <tr key={task._id}>
                            <td>{i + 1}</td>
                            <td>{editTaskId === task._id ? (
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            ) : (
                                task.title
                            )}</td>
                            <td>{editTaskId === task._id ? (
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                            ) : (
                                task.description
                            )}</td>
                            <td>{new Date(task.createdAt).toLocaleString()}</td>
                            <td>
                                {!task.completed && editTaskId !== task._id && (
                                    <>
                                        <button
                                            className="btn btn-sm btn-success me-2"
                                            onClick={() => handleComplete(task._id)}
                                        >
                                            Complete
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() =>
                                                handleEditButtonClick(task._id, task.title, task.description)
                                            }
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                                {editTaskId === task._id ? (
                                    <>
                                        <button
                                            className="btn btn-sm btn-success me-2"
                                            onClick={() => handleEdit(task._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setEditTaskId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : null}
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(task._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;
