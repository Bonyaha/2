import { createSlice } from '@reduxjs/toolkit';
import noteService from '../services/notes';



const notesSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      const id = action.payload
      console.log('id ', id);
      const noteToChange = state.find(n => n.id === id)

      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }

      return state.map(note =>
        note.id !== id ? note : changedNote
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

export const { toggleImportanceOf, setNotes, appendNote, delNote } = notesSlice.actions

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

export const deleteNote = id => {
  return async dispatch => {
    await noteService.deleteNote(id)
    dispatch(delNote(id))
  }
}

export default notesSlice.reducer;