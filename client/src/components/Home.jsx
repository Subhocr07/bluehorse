import React, { useState, useEffect } from "react";

const Home = () => {
    const [tasks, setTasks] = useState([]);

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


    const handleDelete = async (taskId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:7000/user/tasks/removetask/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            if (response.ok) {
                setTasks(tasks.filter((task) => task._id !== taskId));
            } else {
                console.log('Failed to delete task');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleComplete = async (taskId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:7000/user/tasks/markcompleted/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ completed: true })
            });

            if (response.ok) {
                setTasks(
                    tasks.map((task) =>
                        task._id === taskId ? { ...task, completed: true } : task
                    )
                );
            } else {
                console.log('Failed to complete task');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <h1>Tasks:</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>
                                {!task.completed ? (
                                    <>
                                        <button
                                            className="btn btn-sm btn-success me-2"
                                            onClick={() => handleComplete(task._id)}
                                        >
                                            Complete
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => console.log("Edit")}
                                        >
                                            Edit
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
