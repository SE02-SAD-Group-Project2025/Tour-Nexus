import express from "express";
import { createRoadmap } from "../controllers/aiTripController.js";

const router = express.Router();

// Step 1 API: generate attraction roadmap
router.post("/roadmap", createRoadmap);

export default router;
