import express from "express";
import { getMovie, postMovie } from "../controllers/movieController.js";

const router = express.Router();

router.get("/movie", getMovie);
router.get("/postmovie", postMovie);

export default router;
