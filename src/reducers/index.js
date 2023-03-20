import { combineReducers } from "redux";
import students from "./students";
import department from "./department";

export default combineReducers({
  students,
  department
});
