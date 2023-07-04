import { createSlice } from '@reduxjs/toolkit';


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
