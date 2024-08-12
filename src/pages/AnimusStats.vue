<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { EggsFilter, FindEgg, ShowResults } from '@components'
import { useUnrevealedStore } from '@/stores/unrevealed'

const router = useRouter()
const unrevealedStore = useUnrevealedStore()
const { burned, unrevealed } = unrevealedStore
onBeforeMount(() => {
  if (burned.length === 0) {
    router.push('/')
  }
})
console.log('burned', burned)
console.log('unrevealed', unrevealed)
</script>

<template>
  <header>
    <h1>TheGoodAnimus</h1>
    <router-link class="link" to="/">Go to Eggs</router-link>
    <nav>
      <FindEgg
        :egg-id="parseInt(eggId)"
        :get-trait-image="getTraitImage"
        :filtered-egg="filteredEgg"
        :get-clone-id="getCloneId"
        @update:eggId="eggId = $event"
      />
      <EggsFilter
        :dna-traits="dnaTraits"
        :boost-traits="boostTraits"
        :selected-dna-trait="selectedDnaTrait"
        :selected-boost-traits="selectedBoostTraits"
        :select-dna-trait="selectDnaTrait"
        :select-boost-trait="selectBoostTrait"
        :get-trait-image="getTraitImage"
        :selected-points="selectedPoints"
        :points-options="pointsOptions"
        :total-eggs-with-price="totalEggsWithPrice"
        :total-results="totalFilteredResults"
        :loading="loading"
        @update:selectedPoints="selectedPoints = $event"
        @filter-change="handleFilterChange"
      />
    </nav>
    <button @click="refreshPage" :disabled="!refreshEnabled">
      {{ refreshEnabled ? 'Refresh' : `Refresh in ${181 - timeSinceLastUpdate}s` }}
    </button>
  </header>
  <main>
    <ShowResults
      :filtered-eggs="burned"
      :get-trait-image="getTraitImage"
      :get-clone-id="getCloneId"
      :loading="loading"
    />
  </main>
</template>
