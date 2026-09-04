import { useEffect, useState } from "react";
import { apiUrl } from "../services/api";
import "../css/AddStudent.css";

function AddStudent({
  onStudentAdded,
  editingStudent,
  setEditingStudent,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setEmail(editingStudent.email);
      setCourse(editingStudent.course);
      setYear(editingStudent.year);
    }
  }, [editingStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingStudent
      ? apiUrl("updateStudent.php")
      : apiUrl("addStudent.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: editingStudent?._id,
        name,
        email,
        course,
        year,
      }),
    });

    const result = await response.json();

    alert(result.message);

    setName("");
    setEmail("");
    setCourse("");
    setYear("");

    setEditingStudent(null);

    onStudentAdded();
  };

  return (
    <div className="add-student">
      <h2>
        {editingStudent ? "Update Student" : "Add New Student"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <button type="submit">
          {editingStudent ? "Update Student" : "Save Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;