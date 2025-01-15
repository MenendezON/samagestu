import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function StudentForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [student, setStudent] = useState({
    id: null,
    full_name: 'default.jpg',
    avatar: '',
    matricule: '',
    admission: '',
    gender: '',
    class_id: '',
    date_of_birth: '',
    place_of_birth: '',
    discount: '',
    nationality: '',
    address: '',
    city: '',
    email: '',
    phone: '',
    previous_school: '',
    blood_group: '',
    observation: ''
  })
  const [classrooms, setClassrooms] = useState([{
    id: 0,    
    name: '---'
  }])
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

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
            <select value={student.class_id} onChange={(ev) => setStudent({ ...student, class_id: ev.target.value })} className="mx-2" required>
              {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
              ))}
            </select>
            <input value={student.avatar} type="file" onChange={ev => setStudent({...student, avatar: ev.target.value})} placeholder="Profil"/>
            <input value={student.full_name} onChange={ev => setStudent({...student, full_name: ev.target.value})} placeholder="Full name" required/>
            <input value={student.email} type="email" onChange={ev => setStudent({...student, email: ev.target.value})} placeholder="Adresse mail"/>
            <input value={student.matricule} maxlength="10" onChange={ev => setStudent({...student, matricule: ev.target.value})} placeholder="No du dossier" required/>
            <input value={student.admission} type="date" onChange={ev => setStudent({...student, admission: ev.target.value})} placeholder="Date d'admission" required/>
            <select onChange={ev => setStudent({...student, gender: ev.target.value})}>
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
            </select>
            <input value={student.date_of_birth} type="date" onChange={ev => setStudent({...student, date_of_birth: ev.target.value})} placeholder="Date d'anniversaire" required/>
            <input value={student.place_of_birth} onChange={ev => setStudent({...student, place_of_birth: ev.target.value})} placeholder="Lieu de naissance" required/>
            <input value={student.discount} type="number" onChange={ev => setStudent({...student, discount: ev.target.value})} placeholder="Exonération" required/>

            
            <input value={student.nationality} onChange={ev => setStudent({...student, nationality: ev.target.value})} placeholder="Nationalité"/>
            <input value={student.address} onChange={ev => setStudent({...student, address: ev.target.value})} placeholder="Adresse"/>
            <input value={student.city} onChange={ev => setStudent({...student, city: ev.target.value})} placeholder="Ville"/>
            <input value={student.phone} onChange={ev => setStudent({...student, phone: ev.target.value})} placeholder="Téléphone"/>
            <input value={student.previous_school} onChange={ev => setStudent({...student, previous_school: ev.target.value})} placeholder="Ecole précédente" required/>

            <select onChange={ev => setStudent({...student, blood_group: ev.target.value})} required>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
            </select>

            <textarea value={student.observation} type="number" onChange={ev => setStudent({...student, observation: ev.target.value})} placeholder="Observation"></textarea>
            
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
