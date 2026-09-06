import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { apiUrl } from "../services/api";
import "../css/Dashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    issuedBooks: 0,
    returnedBooks: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(apiUrl("getBookRequests.php"));
      const data = await response.json();
      setPendingRequests(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.log("Book Requests Error:", error);
    }
  };

  const fetchDashboardStats = async () => {

    try {

      const response = await fetch(
        apiUrl("getDashboardStats.php")
      );

      const data = await response.json();

      if (data.status === "success") {

        setStats({
          totalBooks: data.totalBooks,
          totalStudents: data.totalStudents,
          issuedBooks: data.issuedBooks,
          returnedBooks: data.returnedBooks
        });

        setRecentActivity(data.recentActivity);
      }

    } catch (error) {

      console.log("Dashboard Error:", error);

    }
  };

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">

        <Header />

        {pendingRequests > 0 && (
          <Link className="book-request-notice" to="/book-requests">
            <span aria-hidden="true">✓</span>
            {pendingRequests} student book request(s) waiting for admin approval
          </Link>
        )}

        {/* Dashboard Cards */}

        <div className="cards">

          <div className="card">
            <h2>{stats.totalBooks}</h2>
            <p>Total Books</p>
          </div>

          <div className="card">
            <h2>{stats.totalStudents}</h2>
            <p>Total Students</p>
          </div>

          <div className="card">
            <h2>{stats.issuedBooks}</h2>
            <p>Issued Books</p>
          </div>

          <div className="card">
            <h2>{stats.returnedBooks}</h2>
            <p>Returned Books</p>
          </div>

        </div>


        {/* Recent Activity */}

        <div className="recent-activity">

          <h2>Recent Activity</h2>

          <table>

            <thead>

              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Status</th>
                <th>Date</th>
              </tr>

            </thead>

            <tbody>

              {recentActivity.length > 0 ? (

                recentActivity.map((activity, index) => (

                  <tr key={index}>

                    <td>
                      {activity.studentName}
                    </td>

                    <td>
                      {activity.bookTitle}
                    </td>

                    <td>
                      {activity.status}
                    </td>

                    <td>
                      {activity.date}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="4">
                    No Recent Activity
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

export default AdminDashboard;