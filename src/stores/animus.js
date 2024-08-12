// src/store/unrevealed.js
import { defineStore } from 'pinia';
import alchemy from '@/utils'
const LOCAL_STORAGE_CACHE_KEY = 'burned_cache';

export const useUnrevealedStore = defineStore('animus', {
  state: () => ({
    animus: [],
    count: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAnimus() {
      const cachedBurned = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CACHE_KEY));
      if (!cachedBurned || cachedBurned.length === 0) {
        this.error = 'No cached data found';
        return;
      }
      this.loading = true;
      this.error = null;
      let allAnimus = [];
      try {
        for (let i = 0; i < cachedBurned.length; i += 100) {
          const batch = cachedBurned.slice(i, i + 100);
          const response = await alchemy.nft.getNftMetadataBatch(batch);
          allAnimus = allAnimus.concat(response.nfts);
        }
        this.animus = allAnimus;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
