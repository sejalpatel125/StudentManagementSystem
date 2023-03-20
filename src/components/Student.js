import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateStudent, deleteStudent } from "../actions/students";
import StudentDataService from "../services/StudentService";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const Student = (props) => {
  const [DOB, setDOB] = useState(new Date());
  const initialStudentState = {
    id: null,
    firstname: "",
    lastname: "",
    status: true,
    DOB: DOB,
  };
  const [currentStudent, setCurrentStudent] = useState(initialStudentState);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const getStudent = id => {
    StudentDataService.get(id)
      .then(response => {
        setDOB(response.data.DOB);
        setCurrentStudent(response.data);
        console.log(response.data);
        alert(currentStudent.DOB)
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getStudent(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  

  const updateStatus = status => {
    const data = {
      id: currentStudent.id,
      firstname: currentStudent.firstname,
      lastname: currentStudent.lastname,
      status: status
    };

    dispatch(updateStudent(currentStudent.id, data))
      .then(response => {
        console.log(response);

        setCurrentStudent({ ...currentStudent, status: status });
        setMessage("The status was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateContent = () => {
    dispatch(updateStudent(currentStudent.id, currentStudent))
      .then(response => {
        console.log(response);

        setMessage("The student was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const removeStudent = () => {
    dispatch(deleteStudent(currentStudent.id))
      .then(() => {
        props.history.push("/students");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentStudent ? (
        <div className="edit-form">
          <h4>Student</h4>
          <form>
            <div className="form-group">
              <label htmlFor="firstname">FirstName</label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                name="firstname"
                value={currentStudent.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">LastName</label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                name="lastname"
                value={currentStudent.lastName}
                onChange={handleInputChange}
              />
            </div>

            {/* <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentStudent.status ? "Status" : "Pending"}
            </div> */}

            <div className="form-group">
              <label>
                <strong>DOB:</strong>
              </label>
              <DatePicker selected={moment(DOB).toDate("YYYY-MM-DD HH:mm Z")} onChange={(date) => setDOB(date)}/>
            </div>
            
          </form>

          {currentStudent.status ? (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updateStatus(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updateStatus(true)}
            >
              Publish
            </button>
          )}

          <button className="badge badge-danger mr-2" onClick={removeStudent}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateContent}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Student...</p>
        </div>
      )}
    </div>
  );
};

export default Student;
