import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Dashboard() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {

        try {

            setLoading(true);

            const response = await api.get("/tasks");

            setTasks(response.data);

        } catch (error) {

            console.error(error);

            toast.error("Failed to load tasks");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const deleteTask = async (id) => {

        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {

            await api.delete(`/tasks/delete/${id}`);

            toast.success("Task deleted successfully");

            loadTasks();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 403) {
                toast.error("You don't have permission to delete this task.");
            } else {
                toast.error("Failed to delete task");
            }
        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    const filteredTasks = tasks.filter((task) => {

    const title = String(task.title || "").toLowerCase();
    const description = String(task.description || "").toLowerCase();

    const taskStatus = String(task.status || "").toUpperCase();
    const taskPriority = String(task.priority || "").toUpperCase();

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
        title.includes(searchText) ||
        description.includes(searchText);

    const matchesStatus =
        statusFilter === "ALL" ||
        taskStatus === statusFilter;

    const matchesPriority =
        priorityFilter === "ALL" ||
        taskPriority === priorityFilter;

    return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
    );
});

    const totalTasks = tasks.length;

    const pendingTasks =
        tasks.filter(task => task.status === "PENDING").length;

    const inProgressTasks =
        tasks.filter(task => task.status === "IN_PROGRESS").length;

    const completedTasks =
        tasks.filter(task => task.status === "COMPLETED").length;

    return (
        <div className="bg-light min-vh-100">

            {/* NAVBAR */}

            <nav className="navbar navbar-dark bg-primary shadow-sm">

                <div className="container">

                    <span
                        className="navbar-brand fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/dashboard")}
                    >
                        <i className="bi bi-check2-square me-2"></i>
                        TaskManager
                    </span>

                    <div className="d-flex align-items-center text-white">

                        <span className="me-3 d-none d-md-block">
                            Welcome
                        </span>

                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={logout}
                        >
                            <i className="bi bi-box-arrow-right me-1"></i>
                            Logout
                        </button>

                    </div>

                </div>

            </nav>

            {/* MAIN */}

            <div className="container py-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="fw-bold mb-1">
                            Dashboard
                        </h2>

                        <p className="text-muted mb-0">
                            Manage your tasks efficiently
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/tasks/create")}
                    >
                        <i className="bi bi-plus-lg me-1"></i>
                        Create Task
                    </button>

                </div>

                {/* STATISTICS */}

                <div className="row g-3 mb-4">

                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="text-muted">
                                    Total Tasks
                                </div>

                                <h2 className="fw-bold mb-0">
                                    {totalTasks}
                                </h2>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="text-muted">
                                    Pending
                                </div>

                                <h2 className="fw-bold text-secondary mb-0">
                                    {pendingTasks}
                                </h2>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="text-muted">
                                    In Progress
                                </div>

                                <h2 className="fw-bold text-warning mb-0">
                                    {inProgressTasks}
                                </h2>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="text-muted">
                                    Completed
                                </div>

                                <h2 className="fw-bold text-success mb-0">
                                    {completedTasks}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

                {/* TASK TABLE */}

                <div className="card border-0 shadow-sm">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h4 className="fw-bold mb-0">
                                My Tasks
                            </h4>

                        </div>

                        {/* FILTERS */}

                        <div className="row g-2 mb-4">

                            <div className="col-md-6">

                                <div className="input-group">

                                    <span className="input-group-text">
                                        <i className="bi bi-search"></i>
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search tasks..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />

                                </div>

                            </div>

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                >

                                    <option value="ALL">
                                        All Status
                                    </option>

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                    <option value="IN_PROGRESS">
                                        In Progress
                                    </option>

                                    <option value="COMPLETED">
                                        Completed
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={priorityFilter}
                                    onChange={(e) =>
                                        setPriorityFilter(e.target.value)
                                    }
                                >

                                    <option value="ALL">
                                        All Priority
                                    </option>

                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* LOADING */}

                        {loading && (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                ></div>

                                <p className="mt-2 text-muted">
                                    Loading tasks...
                                </p>

                            </div>

                        )}

                        {/* EMPTY */}

                        {!loading && filteredTasks.length === 0 && (

                            <div className="text-center py-5">

                                <i className="bi bi-inbox fs-1 text-muted"></i>

                                <h5 className="mt-3">
                                    No tasks found
                                </h5>

                                <p className="text-muted">
                                    Try changing your search or filters.
                                </p>

                            </div>

                        )}

                        {/* TABLE */}

                        {!loading && filteredTasks.length > 0 && (

                            <div className="table-responsive">

                                <table className="table align-middle">

                                    <thead className="table-light">

                                        <tr>

                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Actions</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredTasks.map((task) => (

                                            <tr key={task.id}>

                                                <td>
                                                    #{task.id}
                                                </td>

                                                <td className="fw-semibold">
                                                    {task.title}
                                                </td>

                                                <td className="text-muted">
                                                    {task.description}
                                                </td>

                                                <td>

                                                    <span className={`badge ${
                                                        task.priority === "HIGH"
                                                            ? "bg-danger"
                                                            : task.priority === "MEDIUM"
                                                                ? "bg-warning text-dark"
                                                                : "bg-info"
                                                    }`}>
                                                        {String(task.priority || "").replace("_", " ")}
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className={`badge ${
                                                        task.status === "COMPLETED"
                                                            ? "bg-success"
                                                            : task.status === "IN_PROGRESS"
                                                                ? "bg-warning text-dark"
                                                                : "bg-secondary"
                                                    }`}>
                                                        {String(task.status || "").replace("_", " ")}
                                                    </span>

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() =>
                                                            navigate(`/tasks/edit/${task.id}`)
                                                        }
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            deleteTask(task.id)
                                                        }
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

        </div>
    );
}

export default Dashboard;