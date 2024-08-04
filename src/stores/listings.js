// src/store/listings.js
import { defineStore } from 'pinia';

const LOCAL_STORAGE_CACHE_KEY = 'listings_cache';
const LOCAL_STORAGE_TIMESTAMP_KEY = 'listings_timestamp';
const API_KEY = import.meta.env.VITE_SIMPLEHASH_API_KEY;
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;

export const useListingsStore = defineStore('listings', {
  state: () => ({
    listings: [],
    count: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchListings() {
      const cachedListings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CACHE_KEY));
      const cachedTimestamp = localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY);
      const currentTime = new Date().getTime();

      if (cachedListings && cachedListings.length > 0 && cachedTimestamp && (currentTime - cachedTimestamp < 3 * 60 * 1000)) {
        this.listings = cachedListings;
        return;
      }

      this.loading = true;
      this.error = null;
      let allListings = [];
      let nextCursor = null;

      try {
        do {
          const url = `https://api.simplehash.com/api/v0/nfts/listings/collection/${COLLECTION_ID}?include_nft_details=1&count=1${nextCursor ? `&cursor=${nextCursor}` : ''}&order_by=price_asc&limit=50`;
          const response = await fetch(url, {
            headers: {
              accept: 'application/json', 'X-API-KEY': API_KEY
            }
          });
          const data = await response.json();
          allListings = allListings.concat(data.listings);
          nextCursor = data.next_cursor;
        } while (nextCursor);
        allListings = allListings.filter((listing) =>
          listing.nft_details.extra_metadata.attributes[1].value.toLowerCase() === 'offline'
        );
        this.listings = allListings

        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(allListings));
        localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, currentTime.toString());
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
