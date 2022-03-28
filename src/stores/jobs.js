import { defineStore } from 'pinia'

export const useJobsStore = defineStore({
  id: 'jobs',
  state: () => ({
    allJobs: [],
    doneJobs: [],
    matchJobs: [],
    wishJobs: [],
    viableJobs: [],
    nonviableJobs: []
  }),
  getters: {
    first: (state) => state.jobs[0]
  },
  actions: {
  }
})
