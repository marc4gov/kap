import { defineStore } from 'pinia'

export const useSkillsStore = defineStore({
  id: 'skills',
  state: () => ({
    skills: []
  })
})
