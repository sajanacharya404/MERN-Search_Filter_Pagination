// src/MovieApp.js
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Movie = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(Number(searchParams.get("limit")) || 5);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [sortField, setSortField] = useState(
    searchParams.get("sortField") || "name"
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "asc"
  );
  const [genre, setGenre] = useState(searchParams.get("genre") || "");

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset page when search term changes
  };

  const handleSortChange = (field) => {
    // Toggle sortOrder if the same field is clicked again
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
    setPage(1); // Reset page when genre changes
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `/api/getmovie?page=${page}&limit=${limit}&search=${searchTerm}&sortField=${sortField}&sortOrder=${sortOrder}&genre=${genre}`
        );
        const data = await response.json();
        setMovies(data.movies);
        setTotal(data.total);

        // Update URL
        setSearchParams({
          page,
          limit,
          search: searchTerm,
          sortField,
          sortOrder,
          genre,
        });
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [
    navigate,
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
    genre,
    setSearchParams,
  ]);

  // Filter movies based on the search term
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Movie App</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 mb-4"
      />
      <select
        value={genre}
        onChange={handleGenreChange}
        className="border p-2 mb-4"
      >
        <option value="">All Genres</option>
        <option value="Action">Action</option>
        <option value="Drama">Drama</option>
        {/* Add more genre options as needed */}
      </select>
      <select
        value={sortField}
        onChange={(e) => handleSortChange(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="name">Name</option>
        <option value="year">Year</option>
        <option value="rating">Rating</option>
      </select>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <h2 className="text-2xl font-bold mb-2">Movies</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              onClick={() => handleSortChange("name")}
              className="cursor-pointer p-2"
            >
              Name
            </th>
            <th
              onClick={() => handleSortChange("year")}
              className="cursor-pointer p-2"
            >
              Year
            </th>
            <th
              onClick={() => handleSortChange("rating")}
              className="cursor-pointer p-2"
            >
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredMovies.map((movie) => (
            <tr key={movie._id} className="mb-2">
              <td className="p-2">{movie.name}</td>
              <td className="p-2">{movie.year}</td>
              <td className="p-2">{movie.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4">
        Page {page} of {Math.ceil(total / limit)}
      </p>
      <div className="mt-4">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="bg-gray-300 px-4 py-2 mr-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Movie;
