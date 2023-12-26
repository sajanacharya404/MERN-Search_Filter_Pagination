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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset page when search term changes
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `/api/getmovie?page=${page}&limit=${limit}&search=${searchTerm}`
        );
        const data = await response.json();
        setMovies(data.movies);
        setTotal(data.total);

        // Update URL
        setSearchParams({ page, limit, search: searchTerm });
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [navigate, page, limit, searchTerm, setSearchParams]);

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
      <h2 className="text-2xl font-bold mb-2">Movies</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id} className="mb-2">
            <strong className="text-blue-500">{movie.name}</strong> (
            {movie.year})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movie;
