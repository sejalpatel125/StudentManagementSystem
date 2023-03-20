import axios from "axios";
import http from "../http-common";

const getAll = () => {
  return http.get("/students");
};

const get = id => {
  return http.get(`/students/${id}`);
};

const create = data => {
  return http.post("/students", data);
};

const update = (id, data) => {
  return http.put(`/students/${id}`, data);
};

const remove = id => {
  return http.delete(`/students/${id}`);
};

const removeAll = () => {
  return http.delete(`/students`);
};

const findByTitle = title => {
  return http.get(`/students?title=${title}`);
};

const findByDOB = DOB => {
  return http.get(`/students?DOB=${DOB}`);
};

const findByGender = gender => {
  return http.get(`/students?gender=${gender}`)
}

const getDepartment = q => {
  return axios.get(`https://my-json-server.typicode.com/hiren-coherent/json-list/departments?q=${q}`)
}
const StudentService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
  findByDOB,
  findByGender,
  getDepartment
};

export default StudentService;
