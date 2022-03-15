import { defineStore } from 'pinia'

export const useJobsStore = defineStore({
  id: 'jobs',
  state: () => ({
    allJobs: [],
    doneJobs: [],
    wishJobs: []
  }),
  getters: {
    first: (state) => state.jobs[0]
  },
  actions: {
  }
})
