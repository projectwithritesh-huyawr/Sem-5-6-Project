import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/BookRequests.css";

function BookRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestToReject, setRequestToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(apiUrl("getBookRequests.php"));
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Unable to load book requests");
    } finally {
      setLoading(false);
    }
  };

  const processRequest = async (requestId, action) => {
    const actionText = action === "approve" ? "approve" : "reject";
    const confirmed = await requestConfirmation(`Are you sure you want to ${actionText} this book request?`);
    if (!confirmed) return;

    try {
      const response = await fetch(apiUrl(`${action}BookRequest.php`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId })
      });
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") fetchRequests();
    } catch (error) {
      alert("Unable to process book request");
    }
  };

  const openRejectDialog = (request) => {
    setRequestToReject(request);
    setRejectionReason("");
  };

  const rejectRequest = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(apiUrl("rejectBookRequest.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestToReject._id,
          rejectionReason
        })
      });
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        setRequestToReject(null);
        setRejectionReason("");
        fetchRequests();
      }
    } catch (error) {
      alert("Unable to reject book request");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <BackButton />
        <div className="book-requests-header">
          <div>
            <h1>Book Requests</h1>
            <p>Approve student requests before any book is issued.</p>
          </div>
          <strong>{requests.length} pending</strong>
        </div>
        <div className="book-requests-table">
          {loading ? <p>Loading requests...</p> : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Due Date</th>
                  <th>Requested At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.studentName}</td>
                    <td>{request.bookTitle}</td>
                    <td>{request.returnDate}</td>
                    <td>{request.createdAt}</td>
                    <td>
                      <button className="request-approve" onClick={() => processRequest(request._id, "approve")}>Approve & Issue</button>
                      <button className="request-reject" onClick={() => openRejectDialog(request)}>Reject</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="no-book-requests">No pending book requests</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {requestToReject && (
          <div className="rejection-backdrop">
            <form className="rejection-dialog" onSubmit={rejectRequest}>
              <h2>Reject Book Request</h2>
              <p>{requestToReject.studentName} requested “{requestToReject.bookTitle}”.</p>
              <label htmlFor="rejection-reason">Reason for rejection</label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Write the reason student should see"
                required
                rows="4"
              />
              <div className="rejection-actions">
                <button type="button" onClick={() => setRequestToReject(null)}>Cancel</button>
                <button className="request-reject" type="submit">Reject with reason</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default BookRequests;
