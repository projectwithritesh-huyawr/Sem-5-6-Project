import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { requestConfirmation } from "../components/NotificationHost";
import AddStudent from "../components/AddStudent";
import { apiUrl } from "../services/api";
import "../css/Students.css";

function Students() {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch(
                apiUrl("getStudents.php")
            );

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await requestConfirmation(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) return;

        const response = await fetch(
            apiUrl("deleteStudent.php"),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: id,
                }),
            }
        );

        const result = await response.json();

        alert(result.message);

        fetchStudents();
    };

    const filteredStudents = students.filter((student) =>
        student.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Sidebar />

            <div className="main-content">
                <Header />
                 <BackButton />
                <div className="student-header">
                    <h1>Manage Students</h1>
                </div>

                <AddStudent
                    onStudentAdded={fetchStudents}
                    editingStudent={editingStudent}
                    setEditingStudent={setEditingStudent}
                />

                <div className="student-search">
                    <input
                        type="text"
                        placeholder="Search student by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="student-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Year</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.name}</td>

                                        <td>{student.email}</td>

                                        <td>{student.course}</td>

                                        <td>{student.year}</td>

                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    setEditingStudent(student)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(student._id)
                                                }
                                            >
                                                Delete
                                            </button>

                                            <button
                                                className="view-books-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/returnbook?studentId=${student._id}`
                                                    )
                                                }
                                            >
                                                View Books
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        style={{ textAlign: "center" }}
                                    >
                                        No Students Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Students;