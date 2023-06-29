/* 
const notesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return action.payload
    case 'NEW_NOTE':
      return [...state, action.payload]

    case 'TOGGLE_IMPORTANCE':
      const id = action.payload.id
      return state.map((note) => (note.id !== id ? note : action.payload))
    case 'DELETE_NOTE':
      return state.filter((note) => note.id !== action.payload)
    default:
      return state
  }
}

export default notesReducer
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from '../services/notes';

export const initializeNotes = createAsyncThunk(
  'notes/initializeNotes',
  async () => {
    const initialNotes = await noteService.getAll();
    return initialNotes;
  }
);

export const addNewNote = createAsyncThunk(
  'notes/addNewNote',
  async (noteObject) => {
    const returnedNote = await noteService.create(noteObject);
    return returnedNote;
  }
);

export const toggleImportance = createAsyncThunk(
  'notes/toggleImportance',
  async (id, { getState }) => {
    const notes = getState().notes;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    const returnedNote = await noteService.update(id, changedNote);
    return returnedNote;
  }
);

export const delNote = createAsyncThunk(
  'notes/delNote',
  async (id) => {
    await noteService.deleteNote(id);
    return id;
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeNotes.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addNewNote.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(toggleImportance.fulfilled, (state, action) => {
        const index = state.findIndex((note) => note.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(delNote.fulfilled, (state, action) => {
        return state.filter((note) => note.id !== action.payload);
      });
  },
});

export default notesSlice.reducer;