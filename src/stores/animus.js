// src/store/unrevealed.js
import { defineStore } from 'pinia'
import { alchemy } from '@/utils'
import { fetchAnimus, createAnimus } from '@/api'

export const useAnimusStore = defineStore('animus', {
  state: () => ({
    animus: [],
    count: null,
    loading: false,
    error: null
  }),
  actions: {
    async getAnimus(animusCount) {
      if (this.animus.length === animusCount) {
        return this.animus
      }
      try {
        this.loading = true

        const response = await fetchAnimus(Math.ceil(animusCount / 100))
        this.animus = response || []
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async refreshAnimus(burnedEggs, cachedAnimus) {
      const burnedIds = burnedEggs.map((egg) => egg.tokenId.toString())
      const animusId = cachedAnimus.map((animus) => animus.tokenId.toString())

      const animusIdToAdd = burnedIds.filter((id) => !animusId.includes(id))
      if (animusIdToAdd.length > 0) {
        const animusDataToAdd = burnedEggs.filter((egg) =>
          animusIdToAdd.includes(egg.tokenId.toString())
        )

        await this.populateAnimus(animusDataToAdd)
      }
    },

    async populateAnimus(burnedEggs) {
      this.loading = true
      const tokens = burnedEggs.map((egg) => ({
        contractAddress: '0xec99492dd9ef8ca48f691acd67d2c96a0a43935f',
        tokenId: egg.tokenId.toString(),
        tokenType: 'ERC721'
      }))

      await this.sendRequestsInBatches(tokens, 100)
    },

    async sendRequestsInBatches(array, batchSize) {
      let index = 0
      const allAnimus = []

      // Process batches in parallel
      const batchPromises = []
      while (index < array.length) {
        const batch = array.slice(index, index + batchSize)
        index += batchSize
        batchPromises.push(this.getMetadatas(batch))
      }

      try {
        const results = await Promise.all(batchPromises)
        results.forEach((result) => {
          allAnimus.push(...result)
        })
        const processedResponse = await this.processApiResponse(allAnimus)
        await this.saveAnimusToDatabase(processedResponse)
        this.animus = [...this.animus, processedResponse]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async getMetadatas(batch) {
      try {
        const response = await alchemy.nft.getNftMetadataBatch(batch)
        return response.nfts
      } catch (error) {
        this.error = error.message
        return []
      }
    },

    async saveAnimusToDatabase(processedResponse) {
      const createAnimusBatchSize = 500
      for (let i = 0; i < processedResponse.length; i += createAnimusBatchSize) {
        const batch = processedResponse.slice(i, i + createAnimusBatchSize)
        await createAnimus(batch)
      }
      console.log('successfully populated')
    },

    async processApiResponse(apiResponses) {
      return apiResponses
        .map((response) => {
          if (
            response &&
            response.tokenId &&
            response.raw.metadata &&
            response.raw.metadata.attributes &&
            Array.isArray(response.raw.metadata.attributes)
          ) {
            const attributes = response.raw.metadata.attributes

            const species =
              attributes.find((attr) => attr.trait_type === 'Species')?.value || 'missing_metadata'
            const generation =
              attributes.find((attr) => attr.trait_type === 'Generation')?.value ||
              'missing_metadata'
            const aura =
              attributes.find((attr) => attr.trait_type === 'Aura')?.value || 'missing_metadata'
            const element =
              attributes.find((attr) => attr.trait_type === 'Element')?.value || 'missing_metadata'
            const type =
              attributes.find((attr) => attr.trait_type === 'Type')?.value || 'missing_metadata'

            return {
              tokenId: response.tokenId,
              species: species,
              generation: generation,
              aura: aura,
              element: element,
              type: type
            }
          }
        })
        .filter(Boolean)
    }
  }
})
