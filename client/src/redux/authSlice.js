import {createSlice} from "@reduxjs/toolkit";
import { loadUser } from "../utils/storageHandler";

const initialUser = loadUser();

const slice = createSlice({
    name:'auth',
    initialState:{
        user:initialUser,
        isAuthenticated: !!initialUser,
        allUsers:[],
        employerProfile:JSON.parse(localStorage.getItem('employerProfile')) || null, 
         jobseekerProfile: JSON.parse(localStorage.getItem('jobseekerProfile')) || null, 
    },
reducers:{
    register(state,action){
        state.user=action.payload;
        //  localStorage.setItem('user',JSON.stringify(action.payload));
        state.isAuthenticated = true;
        localStorage.setItem('user',JSON.stringify(action.payload));
    },
    login(state,action){
        state.user=action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('user',JSON.stringify(action.payload));
    },
    logout(state){
        state.user=null;
        state.isAuthenticated = false;
        state.employerProfile = null; 
        localStorage.removeItem('user');
        localStorage.removeItem('employerProfile');
    }, 
    updateProfile: (state, action) => {
            state.user =action.payload;
            
            localStorage.setItem('user', JSON.stringify(state.user));
    },
     
     setEmployerProfile: (state, action) => {
        state.employerProfile = action.payload;
        localStorage.setItem('employerProfile', JSON.stringify(action.payload));
    },
    setJobseekerProfile: (state, action) => {
  state.jobseekerProfile = action.payload;
  localStorage.setItem('jobseekerProfile', JSON.stringify(action.payload));
},
}




});

export const {register,login,logout,updateProfile,setEmployerProfile,setJobseekerProfile} = slice.actions;
export default slice.reducer;
