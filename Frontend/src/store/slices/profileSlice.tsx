// src/store/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  achievements: string;
  picture: string;
  email: string;
  first_name: string;
  last_name: string;
  level: number;
  loss: number;
  total_match: number;
  win: number;
  username : string,
  full_name : string,
  last_match : string
}

const initialState: ProfileState = {
  achievements: '',
  picture: '',
  email: '',
  first_name: '',
  last_name: '',
  level: 0,
  loss: 0,
  total_match: 0,
  win: 0,
  username: '',
  full_name: '', 
  last_match: ''
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile(state:any, action: PayloadAction<Partial<ProfileState>>) { // m3loma make each field optional 
      return { ...state, ...action.payload };// m3loma nakhdo state kolha w n7oto feha el action.payload
    },
    resetProfile() {
      return initialState;
    }
  },
});

export const { updateProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
