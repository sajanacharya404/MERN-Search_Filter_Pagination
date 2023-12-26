import movieModel from "../models/movieModel.js";

//post movies
export const postMovie = async (req, res, next) => {
  const data = await movieModel.create(req.body);
  res.status(201).json(data);
};

//get movies
export const getMovie = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      genre = "",
      sortField = "name",
      sortOrder = "asc",
    } = req.query;
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (genre) {
      query.genre = genre;
    }
    const totalDocuments = await movieModel.countDocuments(query);
    const sortOptions = {};
    // Handling sorting for multiple fields (year and rating)
    if (sortField === "year" || sortField === "rating") {
      sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;
    } else {
      // Default sorting for other fields (e.g., name)
      sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;
    }
    const movies = await movieModel
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({
      total: totalDocuments,
      page: Number(page),
      limit: Number(limit),
      movies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
