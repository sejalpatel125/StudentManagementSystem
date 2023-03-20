import {
  GET_DEPARTMENT
} from "./types";

import StudentDataService from "../services/StudentService";

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

