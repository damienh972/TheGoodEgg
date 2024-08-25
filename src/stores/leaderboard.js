// src/store/index.js
import { defineStore } from 'pinia'

export const useLBoardStore = defineStore('leaderboard', {
  state: () => ({
    lBoard: [],
    loading: false,
    error: null,
    authToken: null
  }),
  actions: {
    async loadLBoard() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/lboard.json')
        const data = await response.json()
        if (Array.isArray(data)) {
          const validData = await data.filter(
            (item) => typeof item.points === 'number' && !isNaN(item.points)
          )
          this.lBoard = validData
          this.totalPages = Math.ceil(this.lBoard.length / this.itemsPerPage)
        } else {
          console.error('Invalid data format:', data)
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
