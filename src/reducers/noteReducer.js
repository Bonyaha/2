/* eslint-disable no-case-declarations */
const notesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return action.payload
    case 'NEW_NOTE':
      return [...state, action.payload]

    case 'TOGGLE_IMPORTANCE':
      const id = action.payload.id
      /* const noteToChange = state.find((n) => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      } */
      return state.map((note) => (note.id !== id ? note : action.payload))
    case 'DELETE_NOTE':
      return state.filter((note) => note.id !== action.payload)
    default:
      return state
  }
}

export default notesReducer
