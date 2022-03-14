import { defineStore } from 'pinia'

export const useWishJobsStore = defineStore({
  id: 'jobs',
  state: () => ({
    jobs: []
  }),
  getters: {
    first: (state) => state.jobs[0]
  },
  actions: {
  }
})
