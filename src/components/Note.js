import React, { useState } from 'react'



const Note = ({ note, toggleImportance, deleteNote }) => {
  const [showModal, setShowModal] = useState(false)
  //console.log(note)
  //const label = note.important ? 'make not important' : 'make important'

  const handleDeletion = () => {
    console.log('hey')
    setShowModal(true)
  }
  const cancelDeletion = () => {
    setShowModal(false)
  }
  return (
    <li className="note">
      {note.content}
      {<button onClick={toggleImportance}>re</button>}
      <button
        type="button"
        onClick={() => handleDeletion()}
        style={{ marginLeft: '3px' }}
      >
        DELETE
      </button>

      {showModal && (
        <div className="confirm-overlay">
          <div className="confirm">
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

export default Note
