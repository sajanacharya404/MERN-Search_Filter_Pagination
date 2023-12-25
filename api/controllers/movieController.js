import movieModel from "../models/movieModel.js";

//get movies
export const getMovie = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let genre = req.query.genre || "All";

    //fetching unique genre from existing movies
    const genreOption = await movieModel.distinct("genre");
    genre === "All"
      ? (genre = [...genreOption])
      : (genre = req.query.genre.split(","));
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const movie = await movieModel
      .find({
        name: { $regex: search, $options: "i" },
      })
      .where("genre")
      .in([...genre])
      .sort(sortBy)
      .skip(page * limit);

    const total = await movieModel.countDocuments({
      genre: { $in: [...genre] },
      name: { $regex: search, $options: "i" },
    });
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      genres: genreOption,
      movie,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

//post movies
export const postMovie = async (req, res, next) => {
  const data = await movieModel.create(req.body);
  res.status(201).json(data);
};
