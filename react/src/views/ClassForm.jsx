import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function ClassForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [classes, setClass] = useState({
    id: null,
    name: '',
    fees: '',
    capacity: '',
    personnel_id: '',
  })
  const [personnels, setPersonnels] = useState([])
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()

  useEffect(() => {
    const fetchPersonnels = async () => {
      try {
        const response = await axiosClient.get('/teachers');
        setPersonnels(response.data.data); // Assuming the data is under `data`
      } catch (error) {
        console.error('Error fetching personnels:', error);
      }
    };

    fetchPersonnels();
  }, [])
  
  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/classes/${id}`)
        .then(({ data }) => {
          setLoading(false)
          setClass(data.data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (classes.id) {
      axiosClient.put(`/classes/${classes.id}`, classes)
        .then(() => {
          setNotification('Class was successfully updated')
          navigate('/classes')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/classes', classes)
        .then(() => {
          setNotification('Class was successfully created')
          navigate('/classes')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {classes.id && <h1>Update Class: {classes.name}</h1>}
      {!classes.id && <h1>New Class</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div classesName="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input value={classes.name} onChange={ev => setClass({ ...classes, name: ev.target.value })} placeholder="Name" />
            <input value={classes.fees} type="number" onChange={ev => setClass({ ...classes, fees: ev.target.value })} placeholder="Fees" />
            <input value={classes.capacity} type="number" onChange={ev => setClass({ ...classes, capacity: ev.target.value })} placeholder="Capacity" />
            <select onChange={(ev) => setClass({ ...classes, personnel_id: ev.target.value })} className="mx-2">
              {classes.id && <option value={classes.personnel.id} selected>{classes.personnel.full_name}</option>}
              {!classes.id && <option value="">Select an instructor</option>}
              
              {personnels.map((personnel) => (
              <option key={personnel.id} value={personnel.id}>
                {personnel.full_name}
              </option>
              ))}
            </select>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
