import {
  GET_DEPARTMENT
} from "../actions/types";

const initialState = [];

const departmentReducer = (department = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    

    case GET_DEPARTMENT:
      return [...department, payload];

    default:
      return department;
  }
};

export default departmentReducer;