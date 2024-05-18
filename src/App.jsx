import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(
    parseInt(localStorage.getItem("userId"))
  );
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (userId) {
      fetchBooks();
    }
  }, []);

  function fetchBooks() {
    axios.get(`http://localhost:8080/books`).then((response) => {
      setBooks(response.data);
      console.log(response.data);
    });
  }

  function addBook(e) {
    e.preventDefault();

    const payload = {
      title: title,
      author: author,
    };

    axios
      .post("http://localhost:8080/books", payload)
      .then((response) => {
        console.log(response.data);
        setBooks((oldBooks) => [...oldBooks, response.data]);
        setTitle("");
        setAuthor("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const deleteBook = (id) => {
    axios
      .delete(`http://localhost:8080/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: name,
    };

    axios
      .post("http://localhost:8080/users", payload)
      .then((response) => {
        console.log(response);
        localStorage.setItem("userId", response.data.id);
        console.log(response.data.id);
        setUserId(response.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      {userId ? (
        <div className="container mx-auto py-4">
          <form
            onSubmit={addBook}
            className="w-full max-w-md mx-auto p-6 bg-gray-50 border border-gray-300 rounded-md"
          >
            <div className="mb-6">
              <div className="flex flex-col mb-4">
                <label htmlFor="title" className="text-gray-700 font-bold mb-2">
                  Enter New Book
                </label>
                <input
                  id="title"
                  className="bg-white border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label
                  htmlFor="author"
                  className="text-gray-700 font-bold mb-2"
                >
                  Enter Author
                </label>
                <input
                  id="author"
                  className="bg-white border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  type="text"
                />
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  type="submit"
                >
                  Add
                </button>
              </div>
            </div>
          </form>

          <ul>
            {books.map((book) => (
              <li
                className="book-item flex items-center justify-between mb-2 p-2 border-b border-gray-200"
                key={`book-${book.id}`}
              >
                <button
                  title="Delete"
                  className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => deleteBook(book.id)}
                >
                  X
                </button>
                <p>{book.title}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="container mx-auto py-4 mt-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg"
          >
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
              />
            </div>
            <div className="mt-4">
              <button
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="submit"
              >
                Start
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
