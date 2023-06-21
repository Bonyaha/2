import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true,
    })

    setNewNote('')
  }
  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote} style={{ marginBottom: '5px' }}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder="write note content here"
          id="note-input"
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
