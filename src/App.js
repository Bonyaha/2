import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import { useQuery, useMutation } from 'react-query'
//import axios from 'axios'


const App = () => {
  //const [, setNotes] = useState([])

  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
      const tokenExpirationTime = new Date(user.expirationTime)
      if (tokenExpirationTime < new Date()) {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }, [])

  const result = useQuery('notes', () => noteService.getAll().then(initialNotes => initialNotes))

  console.log(result.data)

  if (result.isLoading) { return <div>loading data...</div> }

  const notes = result.data

  const noteFormRef = useRef()

  const newNoteMutation = useMutation(noteService
    .create)

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    /*  noteService
       .create(noteObject)
       .then((returnedNote) => {
         setNotes(notes.concat(returnedNote)) */
    newNoteMutation.mutate(noteObject)
    setNotification(`Added ${noteObject.content}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)

    /* .catch((error) => {
      console.log(error.response.data.error)

      setErrorMessage(`${error.response.data.error}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      if (error.response.data.error === 'token expired') {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }) */
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  /* const toggleImportanceOf = (id) => {
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
  } */
  /* const deleteNote = (id) => {
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
  } */

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
      setNotification(`Hello ${user.name}👋`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
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
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      )}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
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
            /* toggleImportance={() => toggleImportanceOf(note.id)} */
            //deleteNote={() => deleteNote(note.id)}
            />
          ))}
        </ul>
      </ul>

      <Footer />
    </div>
  )
}

export default App
