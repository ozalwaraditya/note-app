import Note from '../models/NoteModel.js';
import User from '../models/UserModel.js';
import { errorHandler } from '../utils/errorHandler.js';

//Create

export const createNote = async (req, res, next) => {
  try {
    const { title, body, tags, isPinned } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required." });
    }

    // Double checking whether user exists or not!
    const user = await User.findOne({_id : req.user.id});
    if(!user) {
      next(errorHandler(401, "User does not exists!!!"));
    }

    const newNote = await Note.create({
      title,
      body,
      tags: tags || [],
      isPinned: isPinned || false,
      userId: req.user.id, 
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: newNote,
    });

  } catch (error) {
    next(error); 
  }
};

//Read

export const getUserNotes = async(req, res, next) => {
  try {
    console.log(req.user.id);
    const notes = await Note.find({userId : req.user.id});

    res.status(200).json({
      success : true,
      message : "Successfully fetched user's notes",
      notes : notes
    })

  } catch (error) {
    next(error);
  }
}

export const getNoteById = async (req, res, next) =>{
  try {
    const noteId = req.params.id;

    const note = await Note.findOne({_id : noteId});
    res.status(200).json({
      success : true,
      message : "Get user note successfully!",
      note : note
    })
    
  } catch (error) {
    next(error);
  }
}

export const getAllNotes = async (req, res, next) =>{
   try {
    const notes = await Note.find(); 

    res.status(200).json({
      success: true,
      message: 'Fetched all notes for user',
      notes,
    });
  } catch (error) {
    next(error);
  }
}

//Update

export const updateNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const { title, body, tags, isPinned } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required." });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return next(errorHandler(404, "Note does not exist anymore!!"));
    }

    if(note.userId != req.user.id){
      return next(errorHandler(404, "Unauthorized! You can only edit your notes."));
    }

    // Update the fields
    note.title = title;
    note.body = body;
    note.tags = tags;
    note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully.",
      note,
    });

  } catch (error) {
    next(error);
  }
};


//Delete

export const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;

    const note = await Note.findById(noteId);

    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }

    if (note.userId != req.user.id) {
      return next(errorHandler(403, "Unauthorized! You can only delete your own notes."));
    }

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};
