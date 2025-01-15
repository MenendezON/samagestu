import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";
import loadingbar from "../assets/images/loading.gif";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  const getSubjects = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get('/subjects');
      setSubjects(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personnels:', error);
    }
  };

  useEffect(() => {
    getSubjects();
  }, [])

  const onDeleteClick = subject => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return
    }
    axiosClient.delete(`/subjects/${subject.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getSubjects()
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Subjects</h1>
        <Link className="btn-add" to="/subjects/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown" style={{minHeight:"250px"}}>
        <table>
          <thead>
          <tr>
            <th>Class</th>
            <th>Subject</th>
            <th>Marks</th>
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
            {subjects?.map(u => (
              <tr key={u.id}>
                <td>
                  <Link to={`/subjects/${u.id}`}>{u.classroom.name}</Link>
                </td>
                <td>{u.name} FCFA</td>
                <td>{u.marks}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/subjects/' + u.id}>Edit</Link>
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
