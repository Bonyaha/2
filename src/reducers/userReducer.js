import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
  name: 'user',
  initialState: '',
  reducers: {
    setUser: (action) => {
      return action.payload
    },
    logOut: () => {
      return null
    }
  },
})

export const { setUser, logOut } = userSlice.actions
export default userSlice.reducer
