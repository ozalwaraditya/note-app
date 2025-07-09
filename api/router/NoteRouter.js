import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { createNote, deleteNote, getAllNotes, getNoteById, getUserNotes, updateNote } from '../controller/NoteController.js';

const router = express.Router();

//Create
router.post("/createNote",verifyToken, createNote);

//Read
router.get("/getAllNotes", getAllNotes);
// router.get("/get-all-notes",verifyToken, getAllNotes);
router.get("/getUserNotes",verifyToken, getUserNotes);
router.get("/getNoteById/:id", verifyToken, getNoteById);

//Update
router.post("/updateNote/:id", verifyToken, updateNote);

//Delete 
router.delete("/deleteNote/:id", verifyToken, deleteNote);


export default router;