import React, { createContext, useReducer, } from 'react'

const initialState = {
	user: null,
	notification: null,
	errorMessage: null,
}

const appReducer = (state, action) => {
	switch (action.type) {
		case 'SET_USER':
			return { ...state, user: action.payload }
		case 'SET_NOTIFICATION':
			return { ...state, notification: action.payload }
		case 'SET_ERROR_MESSAGE':
			return { ...state, errorMessage: action.payload }
		default:
			return state
	}
}

const AppContext = createContext()

export const AppContextProvider = (props) => {
	const [state, dispatch] = useReducer(appReducer, initialState)

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{props.children}
		</AppContext.Provider>
	)
}

export default AppContext



