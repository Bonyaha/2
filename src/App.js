import { useState, useEffect, useRef, useContext } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import AppContext from './AppContext'

const App = () => {
  const queryClient = useQueryClient()
  const [state, dispatch] = useContext(AppContext) // Get state and dispatch from context
  console.log(state)
  const { user, notification, errorMessage } = state

  const newNoteMutation = useMutation(noteService
    .create, {
    onSuccess: (noteObject) => {
      queryClient.invalidateQueries('notes'),
        dispatch({
          type: 'SET_NOTIFICATION', payload: `Added ${noteObject.content
            }`
        })
      setTimeout(() => {
        dispatch({
          type: 'SET_NOTIFICATION', payload: null
        })
      }, 5000)
    },
    onError: (error) => {
      dispatch({
        type: 'SET_ERROR_MESSAGE', payload: `${error.response.data.error}`
      })
      setTimeout(() => {
        dispatch({
          type: 'SET_ERROR_MESSAGE', payload: null
        })
      }, 5000)
      if (error.response.data.error === 'token expired') {
        dispatch({ type: 'SET_USER', payload: null })
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  })

  const updateNoteMutation = useMutation(noteService
    .update, {
    onMutate: (variables) => {
      const { id, content } = variables
      console.log(variables)
      return { id, content }
    },
    onSuccess: (returnedNote, { id }) => {
      queryClient.setQueryData('notes', (oldData) =>
        oldData.map((note) => (note.id !== id ? note : returnedNote))
      )
    },
    onError: (error, { id }) => {
      dispatch({
        type: 'SET_ERROR_MESSAGE', payload: `${error.response.data.error}`
      })

      setTimeout(() => {
        dispatch({
          type: 'SET_ERROR_MESSAGE', payload: null
        })
      }, 5000)
      queryClient.setQueryData('notes', (oldData) =>
        oldData.filter((n) => n.id !== id)
      )

    }
  })

  const deleteNoteMutation = useMutation(noteService
    .deleteNote, {
    onMutate: (variables) => {
      console.log(variables)
      return variables
    },
    onSuccess: (_, id) => {
      console.log(id)
      const note = notes.find((n) => n.id === id)
      queryClient.invalidateQueries('notes'),
        dispatch({
          type: 'SET_NOTIFICATION', payload: `Deleted ${note.content}`
        })
      setTimeout(() => {
        dispatch({
          type: 'SET_NOTIFICATION', payload: null
        })
      }, 5000)
    },
    onError: (error) => {
      dispatch({
        type: 'SET_ERROR_MESSAGE', payload: `${error.response.data.error}`
      })
      setTimeout(() => {
        dispatch({
          type: 'SET_ERROR_MESSAGE', payload: null
        })
      }, 5000)
      if (error.response.data.error === 'token expired') {
        dispatch({ type: 'SET_USER', payload: null })
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  })

  const [showAll, setShowAll] = useState(true)
  /* const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null) */


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'SET_USER', payload: user })
      noteService.setToken(user.token)
      const tokenExpirationTime = new Date(user.expirationTime)
      if (tokenExpirationTime < new Date()) {
        dispatch({ type: 'SET_USER', payload: null })
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Session expired. Please log in again.' })
        setTimeout(() => {
          dispatch({ type: 'SET_ERROR_MESSAGE', payload: null })
        }, 5000)
      }
    }
  }, [])

  const noteFormRef = useRef()


  const result = useQuery('notes', () => noteService.getAll().then(initialNotes => initialNotes))
  //console.log(result.data)

  if (result.isLoading) { return <div>loading data...</div> }

  const notes = result.data


  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    console.log(noteObject)
    await newNoteMutation.mutate(noteObject)
  }


  const toggleImportanceOf = (id) => {
    console.log(id)
    const note = notes.find((n) => n.id === id)
    console.log(note)
    updateNoteMutation.mutate({ ...note, important: !note.important })
  }

  const deleteNote = (id) => {
    const note = notes.find((n) => n.id === id)
    if (!note) {
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Note '${note.content}' was already removed from server` })
      setTimeout(() => {
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: null })
      }, 5000)
      return
    }
    deleteNoteMutation.mutate(id)

  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      noteService.setToken(user.token)
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_NOTIFICATION', payload: `Hello ${user.name}👋` })
      setTimeout(() => {
        dispatch({ type: 'SET_NOTIFICATION', payload: null })
      }, 5000)
    } catch (exception) {
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Wrong credentials' })
      setTimeout(() => {
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: null })
      }, 5000)
    }
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

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
