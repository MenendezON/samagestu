import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login.jsx";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import UserForm from "./views/UserForm";
import Students from "./views/Students";
import StudentForm from "./views/StudentForm";
import Classes from "./views/Classes.jsx";
import ClassForm from "./views/ClassForm.jsx";
import Subjects from "./views/Subjects.jsx";
import SubjectForm from "./views/SubjectForm.jsx";
import Teachers from "./views/Teacher.jsx";
import TeacherForm from "./views/TeacherForm.jsx";

const router = createBrowserRouter([
  {
    path: '/', element: <DefaultLayout />, children: [
      { 
        path: '/',
        element: <Navigate to="/dashboard" /> 
      },
      { 
        path: '/classes',
        element: <Classes /> 
      },
      { 
        path: '/classes/new',
        element: <ClassForm key="classCreate" /> 
      },
      { 
        path: '/classes/:id',
        element: <ClassForm key="classUpdate" /> 
      },
      { 
        path: '/teachers',
        element: <Teachers /> 
      },
      { 
        path: '/teachers/new',
        element: <TeacherForm key="teacherCreate" /> 
      },
      { 
        path: '/teachers/:id',
        element: <TeacherForm key="teacherUpdate" /> 
      },
      { 
        path: '/subjects',
        element: <Subjects /> 
      },
      { 
        path: '/subjects/new',
        element: <SubjectForm key="subjectCreate" /> 
      },
      { 
        path: '/subjects/:id',
        element: <SubjectForm key="subjectUpdate" /> 
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: '/students',
        element: <Students />
      },
      {
        path: '/students/new',
        element: <StudentForm key="studentCreate" />
      },
      {
        path: '/students/:id',
        element: <StudentForm key="studentUpdate" />
      }
    ]
  },
  {
    path: '/', element: <GuestLayout />, children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default router;
