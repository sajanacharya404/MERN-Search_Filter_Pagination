import movieModel from "../models/movieModel.js";

export const getMovie = async (req, res, next) => {};
export const postMovie = async (req, res, next) => {
  const data = await movieModel.create(req.body);
  res.status(201).json(data);
};
