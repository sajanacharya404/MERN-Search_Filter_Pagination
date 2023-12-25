import express from "express";
import { getMovie, postMovie } from "../controllers/movieController.js";

const router = express.Router();

router.get("/getmovie", getMovie);
router.post("/postmovie", postMovie);

export default router;
