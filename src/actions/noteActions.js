import noteService from '../services/notes'

export const initializeNotes = () => {
  return async (dispatch) => {
    try {
      const initialNotes = await noteService.getAll()
      dispatch({
        type: 'SET_NOTES',
        payload: initialNotes,
      })
    } catch (error) {
      // Handle error if fetching notes fails
    }
  }
}

export const addNote = (noteObject) => {
  return async (dispatch) => {
    try {
      const returnedNote = await noteService.create(noteObject)
      dispatch({
        type: 'ADD_NOTE',
        payload: returnedNote,
      })
    } catch (error) {
      // Handle error if creating note fails
    }
  }
}

export const toggleImportance = (id) => {
  return async (dispatch, getState) => {
    try {
      const notes = getState().notes
      const note = notes.find((n) => n.id === id)
      const changedNote = { ...note, important: !note.important }
      const returnedNote = await noteService.update(id, changedNote)
      dispatch({
        type: 'TOGGLE_IMPORTANCE',
        payload: returnedNote,
      })
    } catch (error) {
      // Handle error if updating note fails
    }
  }
}

export const deleteNote = (id) => {
  return async (dispatch) => {
    try {
      await noteService.deleteNote(id)
      dispatch({
        type: 'DELETE_NOTE',
        payload: id,
      })
    } catch (error) {
      // Handle error if deleting note fails
    }
  }
}
