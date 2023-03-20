import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { createStudent } from "../actions/students";
import DatePicker from "react-datepicker";
import StudentDataService from "../services/StudentService";
import moment from "moment";
import AsyncSelect from 'react-select/async';

import "react-datepicker/dist/react-datepicker.css";
import Student from "./Student";

import "../css/style.css";
import UploadService from "../services/FileUploadService";


const AddStudent = () => {  
  const [DOB, setDOB] = useState(new Date());
  const [gender, setGender] = useState(1);
  const [department, setDepartment] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [profilePicture, setProfilePicture] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  const upload = (event) => {
    console.log("*****in Upload")
    let profilePictureFile = event.target.files;

    setProgress(0);
    setProfilePicture(profilePictureFile[0]);

    UploadService.upload(profilePictureFile[0], (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        console.log(response.data.files[0].fileUrl);
        setMessage(response.data.files[0].fileUrl);
        setProfilePicture(response.data.files[0].fileUrl);
        console.log("****profilePicture***" + profilePicture)
      })
      .catch(() => {
        setProgress(0);
        setMessage("Could not upload the file!");
        setProfilePicture(undefined);
      });


  };

  const initialStudentState = {
    id: null,
    firstName: "",
    lastName: "",
    profilePicture: profilePicture,
    DOB: DOB,
    gender: gender,
    mobileNo: "",
    email: "",
    departments: department,
  };
  const [student, setStudent] = useState(initialStudentState);
  const [submitted, setSubmitted] = useState(false);
  

  const dispatch = useDispatch();
 /*  useEffect(async () => {
    
  }, []); */

  const handleInputChange = event => {
    const { name, value } = event.target;
    setStudent({ ...student, [name]: value });
  };  

  

  const newStudent = () => {
    setStudent(initialStudentState);
    setSubmitted(false);
  };

  const loadOptions = async (input, callBack)=>{
    const res = await StudentDataService.getDepartment(input);
    console.log("sdsd")
    console.log(res)
    const formatedRes = res.data.map(i=>({label:i.text ,value:i.value}))
    console.log(formatedRes)
    callBack(res.data.map(i=>({label:i.text ,value:i.value})))
   
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const onSubmit   = data => {
    console.log(JSON.stringify(data))
    console.log("profilePicture" + profilePicture)
    const {
      firstName,
      lastName,
      mobileNo,
      email, 
     } = student;

    dispatch(createStudent(
      firstName,
      lastName,
      profilePicture,
      DOB,
      gender,
      mobileNo,
      email,
      JSON.stringify(department)
      )).then(data => {
        setStudent({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          profilePicture: data.profilePicture,
          DOB: data.DOB,
          gender: data.gender,
          mobileNo: data.mobileNo, 
          email: data.email,
          departments: data.department,
        });
        setSubmitted(true);
        setProfilePicture("");
        setDOB(new Date());
        setDepartment([]);
        reset()
        console.log(student.firstName  + JSON.stringify(initialStudentState));
      })
      .catch(e => {
        console.log(e);
      });
  };
  

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newStudent}>
            Add
          </button>
        </div>
      ) : (
        <div className="register-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="title">FirstName</label>
            <input
              {...register('firstName')}
              type="text"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              id="firstName"
              
              value={student.firstName}
              onChange={handleInputChange}
              name="firstName"
            />
            <div className="invalid-feedback">{errors.firstName?.message}</div>
          </div>

          <div className="form-group">
            <label htmlFor="description">LastName</label>
            <input
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              id="lastName"
              {...register('lastName')}
              value={student.lastName}
              onChange={handleInputChange}
              name="lastName"
            />
            <div className="invalid-feedback">{errors.lastName?.message}</div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Email</label>
            <input
              type="text"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              {...register('email')}
              value={student.email}
              onChange={handleInputChange}
              name="email"
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>

          <div className="form-group">
            <label htmlFor="description">MobileNO</label>
            <input
              type="text"
              className={`form-control ${errors.mobileNo ? 'is-invalid' : ''}`}
              id="mobileNo"
              {...register('mobileNo')}
              value={student.mobileNo}
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

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <div>
              <input type="radio" value="1" name="gender" checked={gender === 1} onClick = {() => setGender(1)}/> Male &nbsp;
              <input type="radio" value="2" name="gender" checked={gender === 2} onClick = {() => setGender(2)}/> Female
            </div>
          </div> 
     

          <div className="form-group">
            <label htmlFor="description">Departments</label>
            <AsyncSelect 
            isMulti 
            value={department} 
            onChange={(data)=>{setDepartment(data)}} 
            placeholder="Select Department" 
            name="departments"
            id="departments"
            loadOptions={loadOptions} />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">ProfilePicture</label>
            
              <input  name="profilePicture" id="profilePicture" type="file" onChange={upload} />
            
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        </div>
      )}
    </div>
  );
};

export default AddStudent;
