import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./App.css";

import AddStudent from "./components/AddStudent";
import Student from "./components/Student";
import StudentsList from "./components/StudentsList";


function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/students" className="navbar-brand">
          SMS
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/students"} className="nav-link">
              Students
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/students"]} component={StudentsList} />
          <Route exact path="/add" component={AddStudent} />
          <Route path="/students/:id" component={Student} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
