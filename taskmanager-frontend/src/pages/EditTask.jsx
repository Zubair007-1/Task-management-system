import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function EditTask() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM"
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadTask = async () => {

            try {

                const response = await api.get(`/tasks/${id}`);

                setForm({
                    title: response.data.title || "",
                    description: response.data.description || "",
                    status: response.data.status || "PENDING",
                    priority: response.data.priority || "MEDIUM"
                });

            } catch (error) {

                toast.error("Failed to load task");
                navigate("/dashboard");

            } finally {

                setLoading(false);
            }
        };

        loadTask();

    }, [id, navigate]);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put(`/tasks/${id}`, form);

            toast.success("Task updated successfully");

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            toast.error("Failed to update task");
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h4>Loading...</h4>
            </div>
        );
    }

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-7">

                    <div className="card shadow">

                        <div className="card-body">

                            <h3 className="mb-4">
                                Edit Task
                            </h3>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        value={form.description}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="row">

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
                                    className="btn btn-primary me-2"
                                    type="submit"
                                >
                                    Update Task
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Cancel
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EditTask;