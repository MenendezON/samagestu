import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import loadingbar from "../assets/images/loading.gif";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("all");
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  const getStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/students");
      setStudents(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const getClassrooms = async () => {
    try {
      const response = await axiosClient.get("/classes");
      setClassrooms(response.data.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  useEffect(() => {
    getStudents();
    getClassrooms();
  }, []);

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  const onDeleteClick = (student) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    axiosClient.delete(`/students/${student.id}`).then(() => {
      setNotification("Student was successfully deleted");
      getStudents();
    });
  };

  // Filter students based on selected classroom
  const filteredStudents =
    selectedClassroom === "all"
      ? students
      : students.filter((student) => student.classroom.id === selectedClassroom);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Students</h1>
        <Link className="btn-add" to="/students/new">
          Add new
        </Link>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="classroomFilter">Filter by Classroom:</label>
        <select
          id="classroomFilter"
          value={selectedClassroom}
          onChange={handleClassroomChange}
          style={{ marginLeft: "10px" }}
        >
          <option value="all">All Classrooms</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card animated fadeInDown" style={{ minHeight: "250px" }}>
        <table>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Student name</th>
              <th>Class</th>
              <th>Phone</th>
              <th>Discount</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  <img src={loadingbar} alt="Loading bar" height="150px" />
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {filteredStudents.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link to={`/students/${u.id}`}>{u.full_name}</Link>
                  </td>
                  <td>{u.gender}</td>
                  <td>{u.classroom.name}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.discount} %</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={"/students/" + u.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      className="btn-delete"
                      onClick={(ev) => onDeleteClick(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
