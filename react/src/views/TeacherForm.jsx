import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function TeacherForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [teachers, setTeacher] = useState({
    id: null,    
    full_name: '',
    avatar: 'default.jpg',
    phone: '',
    date_join: '',
    email: '',
    school_id: '',
  })
  const [schools, setSchools] = useState([])
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosClient.get('/schools');
        setSchools(response.data.data); // Assuming the data is under `data`
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, [])
  
  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/teachers/${id}`)
        .then(({ data }) => {
          setLoading(false)
          setTeacher(data.data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (teachers.id) {
      axiosClient.put(`/teachers/${teachers.id}`, teachers)
        .then(() => {
          setNotification('Teacher was successfully updated')
          navigate('/teachers')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/teachers', teachers)
        .then(() => {
          setNotification('Teacher was successfully created')
          navigate('/teachers')
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
      {teachers.id && <h1>Update Teacher: {teachers.name}</h1>}
      {!teachers.id && <h1>New Teacher</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
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
          <div className="">
          <form onSubmit={onSubmit}>
            <select onChange={(ev) => setTeacher({ ...teachers, school_id: ev.target.value })} className="mx-2">
              {teachers.id && <option value={teachers.school.id} selected>{teachers.school.name}</option>}
              {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
              ))}
            </select>
            
            <input value={teachers.full_name} onChange={ev => setTeacher({ ...teachers, full_name: ev.target.value })} placeholder="Full name" required />
            <input value={teachers.phone} type="phone" onChange={ev => setTeacher({ ...teachers, phone: ev.target.value })} placeholder="Phone" />
            <input value={teachers.date_join} type="date" onChange={ev => setTeacher({ ...teachers, date_join: ev.target.value })} placeholder="Date join" />
            <input value={teachers.email} type="email" onChange={ev => setTeacher({ ...teachers, email: ev.target.value })} placeholder="Email" required />
            <button className="btn">Save</button>
          </form>
          </div>
        )}
      </div>
    </>
  )
}
