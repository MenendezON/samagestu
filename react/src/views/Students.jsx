import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getStudents();
  }, [])

  const onDeleteClick = student => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return
    }
    axiosClient.delete(`/students/${student.id}`)
      .then(() => {
        setNotification('Student was successfully deleted')
        getStudents()
      })
  }

  const getStudents = () => {
    setLoading(true)
    axiosClient.get('/students')
      .then(({ data }) => {
        setLoading(false)
        setStudents(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Students</h1>
        <Link className="btn-add" to="/students/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {students.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.class.name}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
                <td>
                  <Link className="btn-edit" to={'/students/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
