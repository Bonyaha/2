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
    try {
      const returnedNote = await noteService.create(noteObject);
      console.log('returnedNote', returnedNote);
      return returnedNote;
    } catch (error) {
      console.log('ERROR');
      throw new Error(error.response.data.error); // Throw the error message
    }
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
      /* .addCase(addNewNote.rejected, (state, action) => {
        console.log(action)
      }) */
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