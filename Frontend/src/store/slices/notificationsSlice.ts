// features/notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk(//createAsyncThunk automatically handles pending, fulfilled, and rejected states
    'notifications/fetchNotifications',
    async (accessToken:any) => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notification/api/view/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.notifications || [];
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        online : {},
        error: null,
    },
    reducers: {
        markAllAsRead: (state) => { // unused
            state.notifications.forEach((notification:any) => (notification.seen = true));
            state.unreadCount = 0;
        },
        togleOnline: (state:any,action:any)=>{
            state.online = action.payload;
        },
        deleteAllNotifications: (state) => { // unused
            state.notifications = [];
            state.unreadCount = 0;
        },
        addNotification: (state:any, action:any) => {
            state.notifications.push(action.payload);
            state.unreadCount += 1;
        },
    },
    extraReducers: (builder) => {// reducers that will be excuted depend on asyn action api call
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {//Fulfilled: When the async request succeeds (resolved promise)
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n:any) => !n.seen).length;
            })
            .addCase(fetchNotifications.rejected, (state:any, action) => {//Rejected: When the async request fails (rejected promise).
                state.error = action.error.message;
            });
    },
});

export const { markAllAsRead, deleteAllNotifications, addNotification,togleOnline } = notificationsSlice.actions;
export default notificationsSlice.reducer;