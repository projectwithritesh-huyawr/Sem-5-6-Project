import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/Fines.css";

function Fines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await fetch(
        apiUrl("getFine.php")
      );

      const data = await response.json();

      if (data.status === "success") {
        setFines(data.fines || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Fine Error:", error);
      alert("Unable to load fines");
    } finally {
      setLoading(false);
    }
  };

  const handlePayFine = async (id) => {
    const confirmPay = await requestConfirmation(
      "Are you sure you want to mark this fine as paid?"
    );

    if (!confirmPay) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("payFine.php"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        }
      );

      const result = await response.json();

      alert(result.message);

      if (result.status === "success") {
        fetchFines();
      }
    } catch (error) {
      console.log("Pay Fine Error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <h2>Loading Fines...</h2>;
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <Header />
        <BackButton />
        <div className="fines-page">

          <div className="fines-header">
            <h1>Fine Management 💰</h1>
            <p>Manage student library fines</p>
          </div>

          <div className="fines-table-container">

            <table className="fines-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Due Date</th>
                  <th>Returned Date</th>
                  <th>Late Days</th>
                  <th>Fine</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {fines.length > 0 ? (

                  fines.map((fine) => (

                    <tr key={fine._id}>

                      <td>
                        {fine.studentName || fine.studentId}
                      </td>

                      <td>
                        {fine.bookTitle}
                      </td>

                      <td>
                        {fine.returnDate || "-"}
                      </td>

                      <td>
                        {fine.actualReturnDate || "-"}
                      </td>

                      <td>
                        {fine.lateDays}
                      </td>

                      <td>
                        ₹{fine.fine}
                      </td>

                      <td>

                        {fine.fineStatus === "Paid" ? (

                          <span className="fine-paid">
                            Paid
                          </span>

                        ) : (

                          <span className="fine-unpaid">
                            Unpaid
                          </span>

                        )}

                      </td>

                      <td>

                        {fine.fineStatus === "Paid" ? (

                          <span className="paid-date">
                            {fine.paidDate}
                          </span>

                        ) : (

                          <button
                            className="pay-fine-btn"
                            onClick={() =>
                              handlePayFine(fine._id)
                            }
                          >
                            Mark as Paid
                          </button>

                        )}

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="no-fines"
                    >
                      No Fine Records Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}

export default Fines;