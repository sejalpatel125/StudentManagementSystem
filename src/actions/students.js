import {
  CREATE_STUDENT,
  RETRIEVE_STUDENTS,
  UPDATE_STUDENT,
  DELETE_STUDENT,
  DELETE_ALL_STUDENTS,
  GET_DEPARTMENT
} from "./types";

import StudentDataService from "../services/StudentService";

export const createStudent = (
  firstName,
  lastName,
  profilePicture,
  DOB,
  gender,
  mobileNo,
  email,
  departments,
) => async (dispatch) => {
  try {
    console.log('*@*@*@*@**@**@')
    console.log(profilePicture)
    const res = await StudentDataService.create({
      firstName,
      lastName,
      profilePicture,
      DOB,
      gender,
      mobileNo,
      email,
      departments,
    });

    dispatch({
      type: CREATE_STUDENT,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const retrieveStudents = () => async (dispatch) => {
  try {
    const res = await StudentDataService.getAll();

    dispatch({
      type: RETRIEVE_STUDENTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateStudent = (id, data) => async (dispatch) => {
  try {
    const res = await StudentDataService.update(id, data);

    dispatch({
      type: UPDATE_STUDENT,
      payload: data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteStudent = (id) => async (dispatch) => {
  try {
    await StudentDataService.remove(id);

    dispatch({
      type: DELETE_STUDENT,
      payload: { id },
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteAllStudents = () => async (dispatch) => {
  try {
    const res = await StudentDataService.removeAll();

    dispatch({
      type: DELETE_ALL_STUDENTS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const findStudentsByTitle = (title) => async (dispatch) => {
  try {
    const res = await StudentDataService.findByTitle(title);

    dispatch({
      type: RETRIEVE_STUDENTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const findStudentsByDOB = (DOB) => async (dispatch) => {
  try {
    const res = await StudentDataService.findByDOB(DOB);

    dispatch({
      type: RETRIEVE_STUDENTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const findStudentsByGender = (gender) => async (dispatch) => {
  try {
    const res = await StudentDataService.findByGender(gender);

    dispatch({
      type: RETRIEVE_STUDENTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const retrieveDepartment = (q) => async (dispatch) => {
  try {
    const res = await StudentDataService.getDepartment(q);

    dispatch({
      type: GET_DEPARTMENT,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

