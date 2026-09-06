import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import AddBook from "../components/AddBook";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        apiUrl("getBooks.php")
      );

      const data = await response.json();

      console.log("BOOKS:", data);

      setBooks(data);
    } catch (error) {
      console.log("Fetch Books Error:", error);
    }
  };

  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))].sort();
  const filteredBooks = books.filter((book) => {
    const searchText = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchText || [book.title, book.author, book.category]
      .some((value) => String(value || "").toLowerCase().includes(searchText));
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    const confirmDelete = await requestConfirmation(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("deleteBook.php"),
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
        fetchBooks();
      }

    } catch (error) {
      console.log("Delete Book Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="main-content">

      <Header />

      <BackButton />

      <div className="book-header">
        <h1>Manage Books</h1>
      </div>

      <AddBook
        onBookAdded={fetchBooks}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        category={category}
        setCategory={setCategory}
        quantity={quantity}
        setQuantity={setQuantity}
        editId={editId}
        setEditId={setEditId}
      />

      <div className="book-filters">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by title, author or category"
          aria-label="Search books"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter books by category"
        >
          <option value="all">All categories</option>
          {categories.map((bookCategory) => (
            <option key={bookCategory} value={bookCategory}>{bookCategory}</option>
          ))}
        </select>
        <span className="book-result-count">{filteredBooks.length} book(s)</span>
      </div>

      <div className="book-table">

        <table>

          <thead>

            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Total</th>
              <th>Available</th>
              <th>Issued</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredBooks.length > 0 ? (

              filteredBooks.map((book) => {

                const total = Number(book.totalQuantity ?? book.quantity ?? 0);

                const available = Number(book.quantity ?? 0);

                const issued = Math.max(
                  total - available,
                  0
                );

                return (
                  <tr key={book._id}>

                    <td>{book.title}</td>

                    <td>{book.author}</td>

                    <td>{book.category}</td>

                    <td>{total}</td>

                    <td>{available}</td>

                    <td>{issued}</td>

                    <td>
                      <span className={`availability-status ${available > 0 ? "available" : "unavailable"}`}>
                        {available > 0 ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => {

                          setEditId(book._id);

                          setTitle(book.title);

                          setAuthor(book.author);

                          setCategory(book.category);

                          setQuantity(total);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(book._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                );
              })

            ) : (

              <tr>

                <td
                  colSpan="8"
                  style={{ textAlign: "center" }}
                >
                        {books.length > 0 ? "No matching books" : "No Books Found"}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Books;