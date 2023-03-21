import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable } from "react-table";
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.css'; // main style file
import moment from "moment";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/style.css";
import Select from 'react-select';

import {
  retrieveStudents,
  findStudentsByTitle,
  findStudentsByDOB,
  findStudentsByGender,
  deleteAllStudents,
  deleteStudent
} from "../actions/students";

import { Link } from "react-router-dom";

const StudentsList = (props) => {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const students = useSelector(state => state.students);
  const dispatch = useDispatch();
  const studentsRef = useRef();
  studentsRef.current = students;
  useEffect(() => {
    dispatch(retrieveStudents());
  }, []);



  const options = [{ value: 0, label: "All" }, { value: 1, label: "Male" }, { value: 2, label: "Female" }]
  const [gender, setGender] = useState(options[0]);
  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };



  const refreshData = () => {
    setCurrentStudent(null);
    setCurrentIndex(-1);
  };

  const onChangeSearchDOB = range => {
    console.log(range)
    const formatedRange = range && range[0] && range[1] ? new Date(range[0]).getTime() + ',' + moment(new Date(range[1]).getTime()).add(86399, 'seconds') : '';
    /* if(range & range.length > 0){
      const newList = students.filter(data => data.DOB > new Date(range[0]).getTime() && data.DOB < moment(new Date(range[1]).getTime()).add(86399, 'seconds') )
    //refreshData();
    console.log(JSON.stringify(newList))
    dispatch(newList)
    } */
    refreshData();
    dispatch(findStudentsByDOB(formatedRange));
  };

  const setActiveStudent = (student, index) => {
    setCurrentStudent(student);
    setCurrentIndex(index);
  };

  const removeAllStudents = () => {
    dispatch(deleteAllStudents())
      .then(response => {
        console.log(response);
        refreshData();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    refreshData();
    dispatch(findStudentsByTitle(searchTitle));
  };

  const findByGender = (value) => {
    refreshData();
    dispatch(findStudentsByGender(value));


  };

  /* const findByDate = () => {
    refreshData();
    alert(searchDOB)
    dispatch(findStudentsByDOB(searchDOB));
  } */

  const openStudent = (rowIndex) => {
    alert(rowIndex)
    const id = studentsRef.current[rowIndex].id;

    props.history.push("/students/" + id);
  };

  const deleteOneStudent = (rowIndex) => {
    const sid = studentsRef.current[rowIndex].id;

    //dispatch(deleteStudent(id))
    dispatch(deleteStudent(sid))
      .then(response => {
        console.log(response);
        refreshData();
      })
      .catch(e => {
        console.log(e);
      });
    /*     StudentDataService.remove(id)
          .then((response) => {
            props.history.push("/students");
    
            let newStudents = [...studentsRef.current];
            newStudents.splice(rowIndex, 1);
    
            setStudents(newStudents);
          })
          .catch((e) => {
            console.log(e);
          }); */
  };

  const columns = useMemo(
    () => [
      {
        Header: "ProfilePicture",
        accessor: "profilePicture",
        Cell: (props) => {
          return <img src={props.value} width="100px" height="auto" />
        }
      },
      {
        Header: "FirstName",
        accessor: "firstName",
      },
      {
        Header: "LastName",
        accessor: "lastName",
      },
      {
        Header: "email",
        accessor: "email",
      },
      {
        Header: "mobileNo",
        accessor: "mobileNo",
      },
      {
        Header: "departments",
        accessor: "departments",
        Cell: (props) => {
          const depJson = JSON.parse(props.value);
          const dep = depJson.map(i => i.label)
          return dep.join()
        }
      },
      {
        Header: "DOB",
        accessor: "DOB",
        Cell: (props) => moment(new Date(props.value)).format('ll')
      },
      {
        Header: "Gender",
        accessor: "gender",
        Cell: (props) => {
          return props.value === 1 ? "Male" : "Female";
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (props) => {
          return props.value ? "Active" : "Inactive";
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openStudent(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </span>

              <span onClick={() => deleteOneStudent(rowIdx)}>
                <i className="fas fa-trash action"></i>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: students,
  });

  return (
    <div className="col-md-12 row">
      <div className="col-md-5">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-5">
        <DatePicker className="form-control student-custom-input"
          utcOffset="0"
          selected={startDate}
          selectsRange
          startDate={startDate}
          endDate={endDate}

          onChange={(dates) => {

            const [start, end] = dates;

            onChangeSearchDOB(dates);

            setStartDate(start);
            setEndDate(end);


          }}
          dateFormat="MMM dd, yyyy"
          maxDate={new Date()}
          placeholderText="Select Date Range"
          showYearDropdown
          isClearable
          onBlur={() => {
            onChangeSearchDOB();
          }}
        />
      </div>
      <div className="col-md-2">
        <Select
          defaultValue={gender}
          value={gender}
          onChange={(data) => {

            setGender(data)
            findByGender(data.value)
            console.log(data + gender)
          }}
          options={options}
        />
      </div>
      <div className="col-md-12">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllStudents}>
          Remove All
        </button>
      </div>
    </div>
  );
};
/*   return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Students List</h4>

        <ul className="list-group">
          {students &&
            students.map((student, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveStudent(student, index)}
                key={index}
              >
                {student.title}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllStudents}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {currentStudent ? (
          <div>
            <h4>Student</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentStudent.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentStudent.description}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentStudent.published ? "Published" : "Pending"}
            </div>
            <div>
              <label>
                <strong>DOB:</strong>
              </label>{" "}
              {currentStudent.DOB}
            </div>

            <Link
              to={"/students/" + currentStudent.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Student...</p>
          </div>
        )}
      </div>
    </div>
  );
}; */

export default StudentsList;
