import { createSlice } from '@reduxjs/toolkit';

/* const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.payload
  case 'LOGOUT':
    return null
  default:
    return state
  }
} */

const userSlice = createSlice({
  name: 'user',
  initialState: '',
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    logOut: (state, action) => {
      return null
    }
  },
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer
