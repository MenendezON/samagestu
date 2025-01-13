import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";
import loadingbar from "../assets/images/loading.gif";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  const getTeachers = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get('teachers');
      setTeachers(response.data.data); // Assuming the data is under `data`
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personnels:', error);
    }
  };

  useEffect(() => {
    getTeachers();
  }, [])

  const onDeleteClick = teacher => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      return
    }
    axiosClient.delete(`teachers/${teacher.id}`)
      .then(() => {
        setNotification('A teacher was successfully deleted')
        getTeachers()
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Teachers</h1>
        <Link className="btn-add" to="/teachers/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown" style={{minHeight:"250px"}}>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Date join</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                <img src={loadingbar} alt="Loading bar" height="150px" />
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {teachers.map(u => (
              <tr key={u.id}>
                <td>
                  <Link to={`/teachers/${u.id}`}>{u.full_name}</Link>
                </td>
                <td>{u.phone}</td>
                <td>{u.email}</td>
                <td>{u.date_join}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/teachers/' + u.id}>Edit</Link>
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
