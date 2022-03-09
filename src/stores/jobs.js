import { defineStore } from 'pinia'

export const useJobsStore = defineStore({
  id: 'jobs',
  state: () => ({
    jobs: []
  }),
  getters: {
    first: (state) => state.jobs[0]
  },
  actions: {
    append(job) {
      this.jobs.push(job)
    }
  }
})
