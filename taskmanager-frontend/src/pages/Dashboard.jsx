function Dashboard() {

    const token = localStorage.getItem("token");

    return (

        <div className="container mt-5">

            <h2>Dashboard</h2>

            <hr />

            <h5>JWT Token</h5>

            <textarea
                className="form-control"
                rows="8"
                value={token || ""}
                readOnly
            />

        </div>

    );

}

export default Dashboard;