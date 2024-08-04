// src/store/unrevealed.js
import { defineStore } from 'pinia';
import { GET_BURNED } from '../subgraph';

const LOCAL_STORAGE_CACHE_KEY = 'leaderboard_cache';
const LOCAL_STORAGE_TIMESTAMP_KEY = 'listings_timestamp';

export const useUnrevealedStore = defineStore('unrevealed', {
  state: () => ({
    unrevealed: [],
    count: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUnrevealed(leaderboard) {
      const cachedUnrevealed = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CACHE_KEY));
      const cachedTimestamp = localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY);
      const currentTime = new Date().getTime();

      if (cachedUnrevealed && cachedUnrevealed.length > 0 && cachedTimestamp && (currentTime - cachedTimestamp < 3 * 60 * 1000)) {
        this.unrevealed = cachedUnrevealed;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const tokenIds = leaderboard.map(egg => egg.tokenId);
        const response = await fetch("https://subgraph.satsuma-prod.com/eaa3f9356941/damien-test--19534/thegoodegg/api", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_BURNED,
            variables: { tokenIds }
          })
        });
        const responseData = await response.json();

        const burnedTokenIds = responseData.data.transfers.map(transfer => transfer.tokenId.toString());
        const unrevealed = leaderboard.filter(egg => !burnedTokenIds.includes(egg.tokenId.toString()));
        this.unrevealed = unrevealed;

        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(unrevealed));
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
