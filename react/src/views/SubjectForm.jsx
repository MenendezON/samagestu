import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function SubjectForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [subject, setSubject] = useState({
    id: null,    
    name: '',
    marks: 0,
    class_id: '',
  })
  const [classrooms, setClassrooms] = useState([{
    id: 0,    
    name: '---'
  }])
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axiosClient.get('/classes');
        setClassrooms(response.data.data); // Assuming the data is under `data`
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchClassrooms();
  }, [])
  
  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/subjects/${id}`)
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
    if (subject.id) {
      axiosClient.put(`/subjects/${subject.id}`, subject)
        .then(() => {
          setNotification('Teacher was successfully updated')
          navigate('/subjects')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/subjects', subject)
        .then(() => {
          setNotification('Teacher was successfully created')
          navigate('/subjects')
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
      {subject.id && <h1>Update Subject: {subject.name}</h1>}
      {!subject.id && <h1>New Subject</h1>}
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
            <select onChange={(ev) => setSubject({ ...subject, school_id: ev.target.value })} className="mx-2">
              {subject.id && <option value={subject.school.id} selected>{subject.school.name}</option>}
              {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
              ))}
            </select>
            
            <input value={subject.name} onChange={ev => setSubject({ ...subject, name: ev.target.value })} placeholder="Name" required />
            <input value={subject.marks} type="number" onChange={ev => setSubject({ ...subject, marks: ev.target.value })} placeholder="Marks" />
            <button className="btn">Save</button>
          </form>
          </div>
        )}
      </div>
    </>
  )
}
