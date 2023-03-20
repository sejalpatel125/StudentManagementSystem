import {
  CREATE_STUDENT,
  RETRIEVE_STUDENTS,
  UPDATE_STUDENT,
  DELETE_STUDENT,
  DELETE_ALL_STUDENTS,
  GET_DEPARTMENT
} from "../actions/types";

const initialState = [];

const studentReducer = (students = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_STUDENT:
      return [...students, payload];

    case RETRIEVE_STUDENTS:
      return payload;

    case UPDATE_STUDENT:
      return students.map((student) => {
        if (student.id === payload.id) {
          return {
            ...student,
            ...payload,
          };
        } else {
          return student;
        }
      });

    case DELETE_STUDENT:
      return students.filter(({ id }) => id !== payload.id);

    case DELETE_ALL_STUDENTS:
      return [];

    case GET_DEPARTMENT:
      return payload;

    default:
      return students;
  }
};

export default studentReducer;