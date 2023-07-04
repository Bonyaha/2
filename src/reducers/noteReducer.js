import { createSlice } from '@reduxjs/toolkit';
import noteService from '../services/notes';



const notesSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportance(state, action) {
      const changedNote = action.payload

      return state.map(note =>
        note.id !== changedNote.id ? note : changedNote
      )
    },
    delNote(state, action) {
      return state.filter((note) => note.id !== action.payload);
    },
    appendNote(state, action) {
      state.push(action.payload)

    },
    setNotes(state, action) {
      return action.payload
    }
  },

});

export const { toggleImportance, setNotes, appendNote, delNote } = notesSlice.actions

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = object => {
  return async dispatch => {
    const newNote = await noteService.create(object)
    dispatch(appendNote(newNote))
  }
}
export const toggleImportanceOf = id => {
  return async (dispatch, getState) => {
    const notes = getState().notes;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    const returnedNote = await noteService.update(id, changedNote);
    console.log(returnedNote);
    dispatch(toggleImportance(returnedNote))
  }
}

export const deleteNote = id => {
  return async dispatch => {
    await noteService.deleteNote(id)
    dispatch(delNote(id))
  }
}

export default notesSlice.reducer;