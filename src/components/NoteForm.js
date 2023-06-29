import { useDispatch } from 'react-redux'
import { addNewNote } from '../reducers/noteReducer'



const NoteForm = ({ noteFormRef, setNotification, setErrorMessage }) => {

  const dispatch = useDispatch()

  const addNote = async (event) => {
    try {
      noteFormRef.current.toggleVisibility();
      event.preventDefault();
      const content = event.target.note.value;
      event.target.note.value = '';
      await dispatch(addNewNote({
        content,
        important: true,
      }));
      setNotification(`Added ${content}`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);

      if (error.message === 'token expired') {
        dispatch(logout());
        window.localStorage.removeItem('loggedNoteappUser');
      }
    }
  };


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
