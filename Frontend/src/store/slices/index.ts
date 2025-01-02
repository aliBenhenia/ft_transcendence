import { combineReducers } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import notificationsSlice from './notificationsSlice';

const rootReducer = combineReducers({
  profile: profileReducer,
  notifications: notificationsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
