import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    function loadBooks() {
      const savedBooks = JSON.parse(localStorage.getItem("mbl-books") || "[]");

      setBooks(savedBooks);
    }

    loadBooks();

    // Reload books when returning to the Home page
    window.addEventListener("focus", loadBooks);

    return () => {
      window.removeEventListener("focus", loadBooks);
    };
  }, []);

  return (
    <>
      <title>Home . My Book Library</title>
      <header className="topbar">
        {" "}
        <a className="brand" href="/home" aria-label="My Book Library home">
          {" "}
          <span>My Book Library</span>{" "}
        </a>
        <nav aria-label="Main navigation">
          <a className="active" href="/home">
            Home
          </a>
          <a href="#my-books">Books</a>
        </nav>
      </header>

      <main>
        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome-inner">
            <p className="greeting">Good evening,</p>

            <h1 id="welcome-title">
              My Book Library <span>✦</span>
            </h1>

            <p className="motto">
              A place where you can keep track of your books.
            </p>

            <a className="add-book" href="/add">
              <span aria-hidden="true">▣</span> Add a Book
              <b aria-hidden="true">＋</b>
            </a>
          </div>
        </section>

        <section
          className="library"
          id="my-books"
          aria-labelledby="books-title"
        >
          <div className="section-heading">
            <span className="sparkle" aria-hidden="true">
              ✦
            </span>
            <h2 id="books-title">My Books</h2>
          </div>

          <div className="toolbar">
            <div className="filters" aria-label="Filter books">
              <button className="selected" type="button">
                All
              </button>
              <button type="button">Reading</button>
              <button type="button">Completed</button>
              <button type="button">Want to Read</button>
            </div>

            <label className="search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search your books..."
                aria-label="Search your books"
              />
            </label>
          </div>
          <div className="book-grid">
            {books.length === 0 ? (
              <p>No books yet. Click "Add a Book" to get started!</p>
            ) : (
              books.map((book) => (
                <article
                  className="book-card"
                  key={book.id}
                  onClick={() => navigate(`/edit/${book.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`cover ${
                      book.status === "completed"
                        ? "cover-three"
                        : book.status === "want-to-read"
                          ? "cover-five"
                          : ""
                    }`}
                  >
                    <span
                      className={`status ${
                        book.status === "completed"
                          ? "completed"
                          : book.status === "want-to-read"
                            ? "want"
                            : "reading"
                      }`}
                    >
                      ♧{" "}
                      {book.status === "want-to-read"
                        ? "Want to Read"
                        : book.status === "completed"
                          ? "Completed"
                          : "Reading"}
                    </span>

                    {book.cover && (
                      <img
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        className="image"
                      />
                    )}
                  </div>

                  <p className="title">{book.title}</p>
                  <p className="author">{book.author}</p>
                  <div className="progress">{book.genre}</div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <footer>
        <div className="moon">✦☾✦</div>
        <p>A book is a dream you hold in your hands.</p>
      </footer>
    </>
  );
}

export default Home;
