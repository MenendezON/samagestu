import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import defaultAvatar from "../assets/images/default-avatar.png";

export default function StudentForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [student, setStudent] = useState({
    id: null,
    full_name: '',
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
  const { setNotification } = useStateContext()
  const [preview, setPreview] = useState(null)

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
        .then(({ data }) => {
          setLoading(false)
          setStudent(data.data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  // const onSubmit = ev => {
  //   ev.preventDefault()
  //   if (student.id) {
  //     axiosClient.put(`/students/${student.id}`, student)
  //       .then(() => {
  //         setNotification('Student was successfully updated')
  //         navigate('/students')
  //       })
  //       .catch(err => {
  //         const response = err.response;
  //         if (response && response.status === 422) {
  //           setErrors(response.data.errors)
  //         }
  //       })
  //   } else {
  //     axiosClient.post('/students', student)
  //       .then(() => {
  //         setNotification('Student was successfully created')
  //         navigate('/students')
  //       })
  //       .catch(err => {
  //         const response = err.response;
  //         if (response && response.status === 422) {
  //           setErrors(response.data.errors)
  //         }
  //       })
  //   }
  // }
  const onSubmit = async (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("full_name", student.full_name);
    formData.append("matricule", student.matricule);
    formData.append("admission", student.admission);
    formData.append("gender", student.gender);
    formData.append("class_id", student.class_id);
    formData.append("date_of_birth", student.date_of_birth);
    formData.append("place_of_birth", student.place_of_birth);
    formData.append("discount", student.discount);
    formData.append("nationality", student.nationality);
    formData.append("address", student.address);
    formData.append("city", student.city);
    formData.append("email", student.email);
    formData.append("phone", student.phone);
    formData.append("previous_school", student.previous_school);
    formData.append("blood_group", student.blood_group);
    formData.append("observation", student.observation);

    // Only append the avatar if a file was selected
    if (student.avatar instanceof File) {
      formData.append("avatar", student.avatar);
    }

    try {
      if (student.id) {
        await axiosClient.post(`/students/${student.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setNotification("Student was successfully updated");
      } else {
        await axiosClient.post("/students", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setNotification("Student was successfully created");
      }
      navigate("/students");
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      }
    }
  };

  const handleFileChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      setStudent({ ...student, avatar: file });

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        //setStudent({ ...student, avatar: reader.result });
      };
      reader.readAsDataURL(file);
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
            <label htmlFor="formFileSm">
              <img height="50" src={student.avatar ? `${import.meta.env.VITE_API_BASE_URL}/storage/${student.avatar}` : defaultAvatar} alt="" />
              <img height="50" src={preview} alt="" />
            </label>
            <input type="file" id="formFileSm" onChange={handleFileChange} placeholder="Profile" style={{ display: "none" }} />
            <input value={student.full_name} onChange={ev => setStudent({ ...student, full_name: ev.target.value })} placeholder="Full name" required />
            <input value={student.email} type="email" onChange={ev => setStudent({ ...student, email: ev.target.value })} placeholder="Adresse mail" />
            <input value={student.matricule} maxLength="10" onChange={ev => setStudent({ ...student, matricule: ev.target.value })} placeholder="No du dossier" required />
            <input value={student.admission} type="date" onChange={ev => setStudent({ ...student, admission: ev.target.value })} placeholder="Date d'admission" required />
            <select onChange={ev => setStudent({ ...student, gender: ev.target.value })}>
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
            </select>
            <input value={student.date_of_birth} type="date" onChange={ev => setStudent({ ...student, date_of_birth: ev.target.value })} placeholder="Date d'anniversaire" required />
            <input value={student.place_of_birth} onChange={ev => setStudent({ ...student, place_of_birth: ev.target.value })} placeholder="Lieu de naissance" required />
            <input value={student.discount} type="number" onChange={ev => setStudent({ ...student, discount: ev.target.value })} placeholder="Exonération" required />


            <input value={student.nationality} onChange={ev => setStudent({ ...student, nationality: ev.target.value })} placeholder="Nationalité" />
            <input value={student.address} onChange={ev => setStudent({ ...student, address: ev.target.value })} placeholder="Adresse" />
            <input value={student.city} onChange={ev => setStudent({ ...student, city: ev.target.value })} placeholder="Ville" />
            <input value={student.phone} onChange={ev => setStudent({ ...student, phone: ev.target.value })} placeholder="Téléphone" />
            <input value={student.previous_school} onChange={ev => setStudent({ ...student, previous_school: ev.target.value })} placeholder="Ecole précédente" required />

            <select onChange={ev => setStudent({ ...student, blood_group: ev.target.value })} required>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
            </select>

            <textarea value={student.observation} type="number" onChange={ev => setStudent({ ...student, observation: ev.target.value })} placeholder="Observation"></textarea>

            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
