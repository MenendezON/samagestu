import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";
import loadingbar from "../assets/images/loading.gif";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  const getClasses = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get('/classes');
      setClasses(response.data.data); // Assuming the data is under `data`
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personnels:', error);
    }
  };

  useEffect(() => {
    getClasses();
  }, [])

  const onDeleteClick = classe => {
    if (!window.confirm("Are you sure you want to delete this classe?")) {
      return
    }
    axiosClient.delete(`/classes/${classe.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getClasses()
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Classes</h1>
        <Link className="btn-add" to="/classes/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown" style={{minHeight:"250px"}}>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Fees</th>
            <th>Instructor</th>
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
            {classes.map(u => (
              <tr key={u.id}>
                <td>
                  <Link to={`/classes/${u.id}`}>{u.name}</Link>
                </td>
                <td>{u.fees} FCFA</td>
                <td>{u.personnel.full_name}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/classes/' + u.id}>Edit</Link>
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
