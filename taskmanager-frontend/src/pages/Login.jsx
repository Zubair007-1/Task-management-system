import { Link } from "react-router-dom";

function Login() {
    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                Login
                            </h2>

                            <form>

                                <div className="mb-3">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                    />
                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                >
                                    Login
                                </button>

                            </form>

                            <p className="mt-3 text-center">
                                Don't have an account?
                                <Link to="/register">
                                    Register
                                </Link>
                            </p>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;