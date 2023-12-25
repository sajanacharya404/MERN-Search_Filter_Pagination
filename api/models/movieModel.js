import mongoose from "mongoose";

const movieSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    genre: { type: [String], required: true },
    rating: { type: Number, required: true },
    img: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

const movieModel = mongoose.model("Movie", movieSchema);

export default movieModel;
