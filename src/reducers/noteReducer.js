import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from '../services/notes';

export const initializeNotes = createAsyncThunk(
  'notes/initializeNotes',
  async () => {
    try {
      const initialNotes = await noteService.getAll();
      console.log('initialNotes are: ', initialNotes);
      return initialNotes;
    } catch (error) {
      console.log('error', error);
    }
  }
);

export const addNewNote = createAsyncThunk(
  'notes/addNewNote',
  async (noteObject) => {
    try {
      const response = await noteService.create(noteObject);
      console.log('response is ', response);
      return response;
    } catch (error) {
      if (error.response) {
        // If the error has a response from the server
        const serverResponse = error.response.data;
        throw new Error(serverResponse.error); // Throw the server response as the error payload
      } else {
        // If it's a generic error without a response
        throw new Error(error.message); // Throw a generic error message as the error payload
      }
    }

  }
);

export const toggleImportance = createAsyncThunk(
  'notes/toggleImportance',
  async (note) => {
    try {
      const changedNote = { ...note, important: !note.important };
      const returnedNote = await noteService.update(note.id, changedNote);
      return returnedNote;
    } catch (error) {
      if (error.response) {
        const serverResponse = error.response.data;
        throw new Error(serverResponse.error);
      } else {
        throw new Error(error.message);
      }
    }
  }
);

export const delNote = createAsyncThunk(
  'notes/delNote',
  async (id) => {
    try {
      await noteService.deleteNote(id);
      return id;
    } catch (error) {
      if (error.response) {
        const serverResponse = error.response.data;
        throw new Error(serverResponse.error);
      } else {
        throw new Error(error.message);
      }
    }
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
      .addCase(addNewNote.rejected, (state, action) => {
        console.log('action.error.message is', action.error.message);
        throw new Error(action.error.message);
      })
      .addCase(toggleImportance.fulfilled, (state, action) => {
        const index = state.findIndex((note) => note.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(toggleImportance.rejected, (state, action) => {
        throw new Error(action.error.message);
      })
      .addCase(delNote.fulfilled, (state, action) => {
        return state.filter((note) => note.id !== action.payload);
      })
      .addCase(delNote.rejected, (state, action) => {
        throw new Error(action.error.message);
      })
  },
});

export default notesSlice.reducer;