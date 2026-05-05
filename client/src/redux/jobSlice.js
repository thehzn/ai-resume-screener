import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
      // single job for details page
  },
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
    },
   
  }
});

export const { setJobs } = jobSlice.actions;
export default jobSlice.reducer;