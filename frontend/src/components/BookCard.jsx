
function BookCard({ image, title, author, status }) {
  return (
    <div className="book-card">
      <img src={image} alt={title} />

      <h3>{title}</h3>

      <p>{author}</p>

      <button>{status}</button>
    </div>
  );
}

export default BookCard;