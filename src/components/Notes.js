import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleImportance, delNote } from '../actions/noteActions'


const Note = ({ note, handleClick, deleteNote }) => {
  const [showModal, setShowModal] = useState(false)
  const label = note.important ? 'make not important' : 'make important'

  const handleDeletion = () => {
    setShowModal(true)
  }
  const cancelDeletion = () => {
    setShowModal(false)
  }
  return (
    <li className="note">
      {note.content}
      <button onClick={handleClick}>{label}</button>
      <button
        type="button"
        onClick={() => handleDeletion()}
        style={{ marginLeft: '3px' }}
      >
        DELETE
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this note?</p>
            <div className="button-container">
              <button className="cancel-button" onClick={cancelDeletion}>
                Cancel
              </button>
              <button className="delete-button" onClick={deleteNote}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}



const Notes = ({ setErrorMessage }) => {
  const dispatch = useDispatch()
  const notes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.notes
    }
    return state.filter === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })

  const deleteNote = async (id) => {
    const note = notes.find((n) => n.id === id)
    if (!note) {
      setErrorMessage(`Note '${note.content}' was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
    try {
      await dispatch(delNote(id))
    } catch (error) {
      setErrorMessage(`Error deleting the note: ${error.message}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const toggleImportanceOf = async (id, content) => {
    try {
      console.log('start');
      const returnedNote = await dispatch(toggleImportance(id))
      console.log('returnedNote is ', returnedNote);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(`${error.response.data.error}`)
      } else {
        setErrorMessage(`Note '${content}' was already removed from server`)
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      dispatch(delNote(id))
    }
  }


  return (
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => toggleImportanceOf(note.id, note.content)}
          deleteNote={() => deleteNote(note.id)}
        />
      )}
    </ul>


  )
}

export default Notes