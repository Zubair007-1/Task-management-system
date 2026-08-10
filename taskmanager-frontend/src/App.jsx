import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";

function App() {
    return (
        <BrowserRouter>
            <Routes>

              <Route
                  path="/"
                  element={<Login />}
              />

              <Route
                  path="/register"
                  element={<Register />}
              />

              <Route
                  path="/dashboard"
                  element={<Dashboard />}
              />

              <Route
                  path="/tasks/create"
                  element={<CreateTask />}
              />
              
              <Route
                path="/tasks/edit/:id"
                element={<EditTask />}
               />

          </Routes>
                  </BrowserRouter>
              );
          }

export default App;