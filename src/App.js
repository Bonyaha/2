import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/Login'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState([])

  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote))

        setNotification(`Added ${returnedNote.content}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch((error) => {
        setErrorMessage(`${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        if (returnedNote === null) {
          setErrorMessage(
            `Note '${note.content}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNotes(notes.filter((n) => n.id !== id))
        } else {
          setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
        }
      })
      .catch((error) => {
        setErrorMessage(`${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }
  const deleteNote = (id) => {
    const note = notes.find((n) => n.id === id)
    if (!note) {
      setErrorMessage(`Note '${note.content}' was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
    noteService
      .deleteNote(id)
      .then(() => setNotes(notes.filter((n) => n.id !== id)))
      .catch((error) => {
        setErrorMessage(`Error deleting the note: ${error.message}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />
      {!user && (
        <Togglable buttonLabel="log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="new note">
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map((note) => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
              deleteNote={() => deleteNote(note.id)}
            />
          ))}
        </ul>
      </ul>

      <Footer />
    </div>
  )
}

export default App
