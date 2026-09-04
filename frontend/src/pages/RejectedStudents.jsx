import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/RejectedStudents.css";

function RejectedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedStudents();
  }, []);

  const fetchRejectedStudents = async () => {
    try {
      const response = await fetch(
        apiUrl("getRejectedStudents.php")
      );

      const data = await response.json();

      console.log("Rejected Students:", data);

      setStudents(data);
    } catch (error) {
      console.log("Rejected Students Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReapprove = async (userId) => {
    const confirmApprove = await requestConfirmation(
      "Are you sure you want to approve this student again?"
    );

    if (!confirmApprove) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("reapproveStudent.php"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );

      const result = await response.json();

      alert(result.message);

      if (result.status === "success") {
        fetchRejectedStudents();
      }
    } catch (error) {
      console.log("Reapprove Student Error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <h2>Loading Rejected Students...</h2>;
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <Header />
          <BackButton />
        <div className="rejected-header">
          <h1>Rejected Students</h1>
          <p>Manage students whose registration was rejected.</p>
        </div>

        <div className="rejected-table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>{student.username}</td>

                    <td>
                      <span className="rejected-status">
                        Rejected
                      </span>
                    </td>

                    <td>
                      <button
                        className="reapprove-btn"
                        onClick={() =>
                          handleReapprove(student._id)
                        }
                      >
                        Approve Again
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-rejected">
                    No Rejected Students
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

export default RejectedStudents;