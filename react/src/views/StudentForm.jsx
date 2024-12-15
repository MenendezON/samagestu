import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function StudentForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [student, setStudent] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/students/${id}`)
        .then(({data}) => {
          setLoading(false)
          setStudent(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (student.id) {
      axiosClient.put(`/students/${student.id}`, student)
        .then(() => {
          setNotification('Student was successfully updated')
          navigate('/students')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/students', student)
        .then(() => {
          setNotification('Student was successfully created')
          navigate('/students')
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
      {student.id && <h1>Update Student: {student.name}</h1>}
      {!student.id && <h1>New Student</h1>}
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
          <form onSubmit={onSubmit}>
            <input value={student.name} onChange={ev => setStudent({...student, name: ev.target.value})} placeholder="Name"/>
            <input value={student.email} onChange={ev => setStudent({...student, email: ev.target.value})} placeholder="Email"/>
            <input type="password" onChange={ev => setStudent({...student, password: ev.target.value})} placeholder="Password"/>
            <input type="password" onChange={ev => setStudent({...student, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
