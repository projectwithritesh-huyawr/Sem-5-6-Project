import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/PendingStudents.css";

function PendingStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const response = await fetch(
        apiUrl("getPendingStudents.php")
      );

      const data = await response.json();

      console.log("Pending Students:", data);

      setStudents(data);
    } catch (error) {
      console.log("Pending Students Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    const confirmApprove = await requestConfirmation(
      "Are you sure you want to approve this student?"
    );

    if (!confirmApprove) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("approveStudent.php"),
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
        fetchPendingStudents();
      }
    } catch (error) {
      console.log("Approve Student Error:", error);
      alert("Something went wrong");
    }
  };

  const handleReject = async (userId) => {
    const confirmReject = await requestConfirmation(
      "Are you sure you want to reject this student?"
    );

    if (!confirmReject) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("rejectStudent.php"),
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
        fetchPendingStudents();
      }
    } catch (error) {
      console.log("Reject Student Error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <h2>Loading Pending Students...</h2>;
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <Header />
           <BackButton />
        <div className="pending-header">
          <h1>Pending Students</h1>
          <p>Review new student registration requests.</p>
        </div>

        <div className="pending-table-container">
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
                      <span className="pending-status">
                        Pending
                      </span>
                    </td>

                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(student._id)}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => handleReject(student._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-pending">
                    No Pending Students
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

export default PendingStudents;