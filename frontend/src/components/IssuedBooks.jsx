import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiUrl } from "../services/api";

function IssuedBooks() {
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      const response = await fetch(
        apiUrl("getIssuedBooks.php")
      );

      const data = await response.json();

      setIssuedBooks(data);
    } catch (error) {
      console.log("Issued Books Error:", error);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <Header />

        <h1>Issued Books</h1>

        {issuedBooks.map((book) => (
          <div key={book._id}>
            <p>Student: {book.studentName}</p>
            <p>Book: {book.bookTitle}</p>
            <p>Issue Date: {book.issueDate}</p>
            <p>Due Date: {book.returnDate}</p>

            {book.status === "Returned" && (
              <>
                <p>Returned Date: {book.returnedDate}</p>
                <p>Late Days: {book.lateDays || 0}</p>
                <p>Fine: ₹{book.fine || 0}</p>
              </>
            )}

            <p>Status: {book.status}</p>

            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default IssuedBooks;