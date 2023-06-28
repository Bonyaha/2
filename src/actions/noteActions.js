import noteService from '../services/notes'



export const initializeNotes = () => {
  return async (dispatch) => {

    const initialNotes = await noteService.getAll()
    dispatch({
      type: 'SET_NOTES',
      payload: initialNotes,
    })


  }
}

export const addNewNote = (noteObject) => {
  return async (dispatch) => {

    const returnedNote = await noteService.create(noteObject)
    dispatch({
      type: 'NEW_NOTE',
      payload: returnedNote,
    })

  }
}

export const toggleImportance = (id) => {
  return async (dispatch, getState) => {
    console.log('id: ', id);
    const notes = getState().notes
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }
    const returnedNote = await noteService.update(id, changedNote)
    dispatch({
      type: 'TOGGLE_IMPORTANCE',
      payload: returnedNote,
    })

  }
}

export const delNote = (id) => {
  return async (dispatch) => {
    await noteService.deleteNote(id)
    dispatch({
      type: 'DELETE_NOTE',
      payload: id,
    })

  }
}
