// src/store/index.js
import { defineStore } from 'pinia';
import { fetchBurnedIds, updateBurnedIds, fetchUnrevealedIds, updateUnrevealedIds } from '@/api';
import { GET_BURNED } from '@/subgraph';

export const useUnrevealedStore = defineStore('unrevealed', {
  state: () => ({
    burned: [],
    unrevealed: [],
    loading: false,
    error: null,
  }),
  actions: {

    // async populateDatabaseWithSubgraphData(leaderboard) {
    //   this.loading = true;
    //   this.error = null;

    //   try {
    //     const tokenIds = leaderboard.map(egg => Number(egg.tokenId));
    //     const response = await fetch("https://subgraph.satsuma-prod.com/eaa3f9356941/damien-test--19534/thegoodegg/api", {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         query: GET_BURNED,
    //         variables: { tokenIds }
    //       })
    //     });
    //     const responseData = await response.json();
    //     const burnedData = responseData.data.transfers.map((item, index) => ({
    //       ...item,
    //       index
    //     }));

    //     const burnedIds = burnedData.map(item => Number(item.tokenId));
    //     const unrevealedData = tokenIds.filter(id => !burnedIds.includes(id));

    //     this.burned = burnedData;
    //     this.unrevealed = unrevealedData;
    //     await updateBurnedIds(burnedData, unrevealedData)
    //     console.log("successfully registered in database");
    //   } catch (error) {
    //     this.error = error.message;
    //     console.error('Error populating the Database:', error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async loadBurned(leaderboard) {
      this.loading = true;
      this.error = null;

      try {
        const data = await fetchBurnedIds();
        this.burned = leaderboard.filter((egg) => data.includes(egg.tokenId));
      } catch (error) {
        console.log(error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async loadUnrevealed(leaderboard) {
      this.loading = true;
      this.error = null;

      try {
        const data = await fetchUnrevealedIds();
        const eggData = leaderboard.filter((egg) => data.includes(egg.tokenId));
        this.unrevealed = eggData;
      } catch (error) {
        console.log(error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updateBurnedAndUnrevealed(leaderboard) {
      this.loading = true;
      this.error = null;

      try {
        const tokenIds = leaderboard.map(egg => Number(egg.tokenId));

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

        const burnedIds = responseData.data.transfers.map(item => Number(item.tokenId));
        const databaseBurnedIds = this.burned.map((egg) => Number(egg.tokenId))
        const newBurnedIds = burnedIds.filter(id => !databaseBurnedIds.includes(id));

        if (newBurnedIds.length > 0) {
          await updateBurnedIds(newBurnedIds, []);

          const newBurned = leaderboard.filter((egg) => {
            newBurnedIds.includes(egg.tokenId);
          });
          this.burned = [...this.burned, ...newBurned];

          await updateUnrevealedIds([], newBurnedIds);

          this.unrevealed = this.unrevealed.filter(
            egg => !newBurnedIds.includes(egg.tokenId)
          );
        }
      } catch (error) {
        console.log(error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  },
});
