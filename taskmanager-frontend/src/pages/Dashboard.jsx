import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Dashboard() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const deleteTask = async (id) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await api.delete(`/tasks/${id}`);

        toast.success("Task deleted successfully");

        loadTasks();

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete task");
    }
};

    const loadTasks = async () => {

        try {

            const response = await api.get("/tasks");

            console.log("Tasks:", response.data);

            setTasks(response.data);

        } catch (error) {

            console.error("Task loading error:", error);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

                toast.error("Session expired. Please login again.");

                localStorage.removeItem("token");

                navigate("/");

            } else {

                toast.error("Unable to load tasks.");
            }

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadTasks();

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");

        toast.success("Logged out successfully");

        navigate("/");
    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2>Task Manager</h2>
                    <p className="text-muted mb-0">
                        Dashboard
                    </p>
                </div>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                </button>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                            <h4 className="mb-0">
                                My Tasks
                            </h4>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/tasks/create")}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Create Task
                            </button>

                        </div>

                    {loading ? (

                        <p>Loading tasks...</p>

                    ) : tasks.length === 0 ? (

                        <div className="text-center py-5">

                            <i className="bi bi-check2-square fs-1 text-muted"></i>

                            <p className="mt-3 text-muted">
                                No tasks found.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>
                                <tbody>
            {tasks.map((task) => (
                <tr key={task.id}>

                    <td>{task.id}</td>

                    <td>{task.title}</td>

                    <td>{task.description}</td>

                    <td>
                        <span className={`badge ${
                            task.status === "COMPLETED"
                                ? "bg-success"
                                : task.status === "IN_PROGRESS"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                        }`}>
                            {task.status}
                        </span>
                    </td>

                    <td>
                        <span className={`badge ${
                            task.priority === "HIGH"
                                ? "bg-danger"
                                : task.priority === "MEDIUM"
                                    ? "bg-warning text-dark"
                                    : "bg-info"
                        }`}>
                            {task.priority}
                        </span>
                    </td>

                    <td>

                        <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => navigate(`/tasks/edit/${task.id}`)}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteTask(task.id)}
                        >
                            <i className="bi bi-trash"></i>
                        </button>

            </td>

        </tr>
    ))}
</tbody>



                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;