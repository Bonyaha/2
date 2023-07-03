import ReactDOM from 'react-dom/client'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import App from './App'
import noteReducer from './reducers/noteReducer'
import userReducer from './reducers/userReducer'
import filterReducer from './reducers/filterReducer'
import './index.css'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    user: userReducer,
    filter: filterReducer,

  }

})

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
