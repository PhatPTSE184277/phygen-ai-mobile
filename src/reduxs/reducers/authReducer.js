import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    token: '',
    expiryTime: null,
    _id: '',
    username: '',
    email: '',
    emailVerified: false,
    accountType: '',
    role: '',
    isFirstTimeUse: true
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: initialState
    },    reducers: {
        addAuth: (state, action) => {
            state.data = { ...state.data, ...action.payload };
            syncLocal(state.data);
        },
        removeAuth: (state, _action) => {
            state.data = initialState;
            syncLocal({});
        },
        setFirstTimeUse: (state, action) => {
            state.data.isFirstTimeUse = action.payload;
            syncLocal(state.data);
        }
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, setFirstTimeUse } = authSlice.actions;

export const authSelector = (state) => state.authReducer.data;

const syncLocal = (data) => {
    AsyncStorage.setItem('Auth_Data', JSON.stringify(data));
};

export const checkFirstTimeUse = async () => {
    try {
        const authData = await AsyncStorage.getItem('Auth_Data');
        if (authData) {
            const parsedData = JSON.parse(authData);
            return parsedData.isFirstTimeUse === true;
        }
        return true;
    } catch (error) {
        console.error('Error checking first time use:', error);
        return true;
    }
};
