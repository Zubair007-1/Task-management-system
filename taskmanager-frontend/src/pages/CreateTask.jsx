import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function CreateTask() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post(
                "/tasks",
                form
            );

            console.log("Created task:", response.data);

            toast.success("Task created successfully!");

            navigate("/dashboard");

        } catch (error) {

            console.error("Create task error:", error);

            if (error.response) {

                toast.error(
                    error.response.data?.message ||
                    "Failed to create task"
                );

            } else {

                toast.error(
                    "Cannot connect to backend"
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-7">

                    <div className="card shadow">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h3 className="mb-0">
                                    Create New Task
                                </h3>

                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Back
                                </button>

                            </div>

                            <form onSubmit={handleSubmit}>

                                {/* Title */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Task Title
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        placeholder="Enter task title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* Description */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        placeholder="Enter task description"
                                        value={form.description}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="row">

                                    {/* Status */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            className="form-select"
                                            value={form.status}
                                            onChange={handleChange}
                                        >

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

                                    {/* Priority */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Priority
                                        </label>

                                        <select
                                            name="priority"
                                            className="form-select"
                                            value={form.priority}
                                            onChange={handleChange}
                                        >

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

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            ></span>

                                            Creating...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Create Task
                                        </>

                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CreateTask;