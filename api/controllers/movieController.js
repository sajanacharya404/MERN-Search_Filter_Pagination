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
    const movies = await movieModel
      .find(query)
      .sort({ [sortField]: sortOrder === "asc" ? true : false })
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
