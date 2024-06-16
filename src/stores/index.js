// src/store/index.js
import { defineStore } from 'pinia';

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useLBoardStore = defineStore('leaderboard', {
  state: () => ({
    lBoard: [],
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 50,
    totalPages: 0,
  }),
  actions: {
    async loadLBoard() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('/lboard.json');
        const data = await response.json();
        this.lBoard = data;
        this.totalPages = Math.ceil(this.lBoard.length / this.itemsPerPage);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    getLBoardPage(page) {
      const start = (page - 1) * this.itemsPerPage;
      const end = page * this.itemsPerPage;
      return this.lBoard.slice(start, end);
    },
    // async fetchAndSaveLBoard() {
    //   this.loading = true;
    //   this.error = null;

    //   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    //   try {
    //     const lBoard = [];
    //     for (let page = 1; page <= 201; page++) {
    //       console.log(`Fetching page ${page}`);
    //       try {
    //         const response = await axios.get(`https://api.rtfkt.com/events/67/incubation/rankings?per_page=50&page=${page}`);
    //         console.log(`Response for page ${page}:`, response.data);
    //         if (response.data.data && Array.isArray(response.data.data.items)) {
    //           lBoard.push(...response.data.data.items);
    //           console.log(`Page ${page} items added, total items now: ${lBoard.length}`);
    //         } else {
    //           console.error(`Invalid data structure for page ${page}:`, response.data);
    //         }
    //       } catch (error) {
    //         console.error(`Error fetching page ${page}:`, error);
    //         this.error = `Error fetching page ${page}: ${error.message}`;
    //         break;
    //       }
    //       await delay(2000);
    //     }
    //     this.lBoard = lBoard;
    //     console.log('Complete leaderboard:', lBoard);

    //     const blob = new Blob([JSON.stringify(lBoard)], { type: 'application/json' });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'lboard.json';
    //     a.click();
    //   } catch (error) {
    //     console.error('Error fetching leaderboard:', error);
    //     this.error = error.message;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
  },
});
