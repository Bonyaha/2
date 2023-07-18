import { useDispatch } from 'react-redux'
import { addNewNote } from '../actions/noteActions'
import { logOut } from '../actions/userActions'


const NoteForm = ({ noteFormRef, setNotification, setErrorMessage }) => {

  const dispatch = useDispatch()

  const addNote = async (event) => {
    try {
      noteFormRef.current.toggleVisibility()
      event.preventDefault()
      const content = event.target.note.value
      event.target.note.value = ''
      await dispatch(addNewNote({
        content,
        important: true,
      }))
      setNotification(`Added ${content}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.log(error.response.data.error)
      setErrorMessage(`${error.response.data.error}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      if (error.response.data.error === 'token expired') {
        dispatch(logOut())
        window.localStorage.removeItem('loggedNoteappUser')
      }
    }
  }


  return (
    <div>

      <h2>Create a new note</h2>

      <form onSubmit={addNote} style={{ marginBottom: '5px' }}>
        <input
          name="note"
          placeholder="write note content here"
          id="note-input"
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default NoteForm
