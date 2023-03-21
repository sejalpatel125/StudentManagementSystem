import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AsyncSelect from 'react-select/async';
import { updateStudent, deleteStudent } from "../actions/students";
import StudentDataService from "../services/StudentService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/style.css";
import UploadService from "../services/FileUploadService";

const Student = (props) => {
  const [DOB, setDOB] = useState(new Date());
  const [gender, setGender] = useState(new Date());
  const [department, setDepartment] = useState([]);
  const initialStudentState = {
    id: null,
    firstname: "",
    lastname: "",
    status: true,
    DOB: DOB,
  };
  const [currentStudent, setCurrentStudent] = useState(initialStudentState);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const dispatch = useDispatch();

  const loadOptions = async (input, callBack) => {
    const res = await StudentDataService.getDepartment(input);
    console.log("sdsd")
    console.log(res)
    const formatedRes = res.data.map(i => ({ label: i.text, value: i.value }))
    console.log(formatedRes)
    callBack(res.data.map(i => ({ label: i.text, value: i.value })))
  }

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Firstname is required'),
    lastName: Yup.string().required('Lastame is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    mobileNo: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'Phone number is not valid')
      .max(12, 'Phone number is not valid'),

  });

  const getStudent = id => {
    StudentDataService.get(id)
      .then(response => {
        setDOB(new Date(response.data.DOB));
        setCurrentStudent(response.data);
        setGender(response.data.gender);
        setDepartment(JSON.parse(response.data.departments));
        setProfilePicture(response.data.profilePicture);
        console.log(response.data);
        reset({ firstName: currentStudent.firstName, lastName: currentStudent.lastName })
      })
      .catch(e => {
        console.log(e);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: { firstName: currentStudent.firstName, lastName: currentStudent.lastName },
    resolver: yupResolver(validationSchema),

  });

  const upload = (event) => {
    console.log("*****in Upload")
    let profilePictureFile = event.target.files;
    setProfilePicture(profilePictureFile[0]);

    UploadService.upload(profilePictureFile[0], (event) => {

    }).then((response) => {
      console.log(response.data.files[0].fileUrl);
      setProfilePicture(response.data.files[0].fileUrl);
      console.log("****profilePicture***" + profilePicture)
    })
      .catch(() => {
        setProfilePicture(undefined);
      });
  };

  useEffect(() => {
    getStudent(props.match.params.id);
  }, [props.match.params.id]);

  useEffect(() => {
    console.log("*&*", currentStudent);
  }, [currentStudent]);

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const updateStatus = status => {
    const data = {
      id: currentStudent.id,
      firstName: currentStudent.firstName,
      lastName: currentStudent.lastName,
      DOB: DOB,
      profilePicture: profilePicture,
      gender: gender,
      mobileNo: currentStudent.mobileNo,
      email: currentStudent.email,
      departments: JSON.stringify(department),
      status: currentStudent.status
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

    currentStudent.DOB = new Date(DOB).getTime();
    currentStudent.gender = gender;
    currentStudent.departments = JSON.stringify(department);
    currentStudent.profilePicture = profilePicture;
    dispatch(updateStudent(currentStudent.id, currentStudent))
      .then(response => {
        console.log(response);

        setMessage("The student was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const backToList = () => {
    props.history.push("/students");
  };

  return (
    <div>
      {currentStudent ? (
        <div className="edit-form">
          <h4>Edit Student</h4>
          <form onSubmit={handleSubmit(updateContent)}>
            <div className="form-group">
              <label htmlFor="firstname">FirstName</label>
              <input
                {...register('firstName')}
                type="text"
                value={currentStudent.firstName}
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                id="firstname"
                name="firstName"

                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{errors.firstName?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="lastname">LastName</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                id="lastname"
                name="lastName"
                {...register('lastName')}
                value={currentStudent.lastName}
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                {...register('email')}
                value={currentStudent.email}
                onChange={handleInputChange}
                name="email"
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="MobileNO">MobileNO</label>
              <input
                type="text"
                className={`form-control ${errors.mobileNo ? 'is-invalid' : ''}`}
                id="mobileNo"
                {...register('mobileNo')}
                value={currentStudent.mobileNo}
                onChange={handleInputChange}
                name="mobileNo"
              />
              <div className="invalid-feedback">{errors.mobileNo?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="DOB">DOB</label>
              <DatePicker className="form-control student-custom-input"
                utcOffset="0"
                selected={DOB}
                onChange={(date) => {
                  setDOB(date)
                  console.log(date)
                }}
                dateFormat="MMM dd, yyyy"
                showYearDropdown
                maxDate={new Date()}
              />
            </div>

            {/* <div className="form-group">
              <label>
                <strong>DOB:</strong>
              </label>
              <DatePicker selected={moment(DOB).toDate("YYYY-MM-DD HH:mm Z")} onChange={(date) => setDOB(date)}/>
            </div> */}

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <div>
                <input type="radio" value="1" name="gender" checked={gender === 1} onClick={() => setGender(1)} /> Male &nbsp;
                <input type="radio" value="2" name="gender" checked={gender === 2} onClick={() => setGender(2)} /> Female
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Departments</label>
              <AsyncSelect
                isMulti
                value={department}
                onChange={(data) => { setDepartment(data) }}
                placeholder="Select Department"
                name="departments"
                id="departments"
                loadOptions={loadOptions} />
            </div>

            <div className="form-group">
              <label htmlFor="description">ProfilePicture</label>
              <img src={profilePicture} width="75px" height="75px" />
              <input name="profilePicture" id="profilePicture" type="file" onChange={upload} />

            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
              &nbsp;
              <button type="button" className="btn btn-primary" onClick={backToList}>
                Back
              </button>
            </div>
          </form>



          {/* <button className="btn btn-primary" onClick={removeStudent}>
            Delete
          </button> */}


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
