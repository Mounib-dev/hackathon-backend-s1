import { Router } from "express";
import {
  createNote,
  deleteNote,
  retrieveNotes,
  updateNote,
} from "./../api/note.api";
import authorizeUser from "./../middlewares/authorize";

const router = Router();

router.post("/create", authorizeUser, createNote);

export default router;
