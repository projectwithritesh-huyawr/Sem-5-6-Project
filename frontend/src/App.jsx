import { BrowserRouter, Routes, Route } from "react-router-dom";
import PendingStudents from "./pages/PendingStudents";
import IssueBook from "./pages/Issuebook";
import Students from "./pages/Students";
import Books from "./pages/Books";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
 import Fines from "./pages/Fines"; 
import RejectedStudents from "./pages/RejectedStudents";
import ReturnBook from "./pages/Returnbook";
import NotificationHost from "./components/NotificationHost";

function App() {
  return (
    <BrowserRouter>
      <NotificationHost />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/students" element={<Students />} />
        <Route path="/issuebook" element={<IssueBook />} />
      
       <Route path="/fines" element={<Fines />} />
        <Route path="/pending-students"element={<PendingStudents />}/>
        <Route path="/rejected-students"element={<RejectedStudents />}/>
        <Route path="/returnbook" element={<ReturnBook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;