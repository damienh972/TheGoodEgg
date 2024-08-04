<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useLBoardStore } from '@/stores/leaderboard'
import { useListingsStore } from '@/stores/listings'
import { useUnrevealedStore } from '@/stores/unrevealed'

import { EggsFilter, FindEgg, ShowResults } from '@components'

console.log('%cHey there, curious developer!', 'color: green; font-size: 20px;')
console.log(
  '%cWelcome to the secret console of this website. Have fun exploring!',
  'color: blue; font-size: 16px;'
)

const lBoardStore = useLBoardStore()
const listingsStore = useListingsStore()
const unrevealedStore = useUnrevealedStore()

const eggId = ref('')
const dnaTraits = ['Alien', 'Murakami', 'Undead', 'Reptile', 'Angel', 'Demon', 'Robot', 'Human']

const boostTraits = ['Murakami Drip', 'Helmet', 'Snake', 'Artist Edition']
const selectedDnaTrait = ref('')
const selectedBoostTraits = ref([])
const selectedPoints = ref(null)
const filteredEggs = ref([])

const loading = ref(false)
const loadingMessage = ref('Loading ...')
const error = ref('')
const filterOnSale = ref(false)

const refreshEnabled = ref(false)
const timeSinceLastUpdate = ref(0)
const intervalId = ref(null)

const LAST_UPDATE_KEY = 'listings_timestamp'

const pointsOptions = computed(() => {
  const uniquePoints = [...new Set(unrevealedStore.unrevealed.map((egg) => egg.points))]
  return uniquePoints.filter((point) => !isNaN(point)).sort((a, b) => b - a)
})

const eggsWithPrice = computed(() => {
  return unrevealedStore.unrevealed.map((egg) => {
    const price = getListingPrice(egg.tokenId)
    return {
      ...egg,
      price
    }
  })
})

const filteredEgg = computed(() =>
  unrevealedStore.unrevealed.find((egg) => egg.tokenId === parseInt(eggId.value))
)

const totalEggsWithPrice = computed(() => {
  return filteredEggs.value.filter((egg) => egg.price !== null).length
})

const totalFilteredResults = computed(() => {
  return filteredEggs.value.length
})

const getListingPrice = (tokenId) => {
  const listing = listingsStore.listings.find(
    (listing) => parseInt(listing.nft_details.token_id, 10) === tokenId
  )
  return listing ? listing.price / 1e18 : null
}

const applyFilters = () => {
  let eggs = eggsWithPrice.value

  if (selectedDnaTrait.value) {
    eggs = eggs.filter((egg) => egg.bonusTraits.includes(selectedDnaTrait.value))
  }

  if (selectedBoostTraits.value.length) {
    eggs = eggs.filter((egg) =>
      selectedBoostTraits.value.every((trait) => egg.bonusTraits.includes(trait))
    )
  }

  if (selectedPoints.value !== null) {
    eggs = eggs.filter((egg) => egg.points <= selectedPoints.value)
  }

  if (filterOnSale.value) {
    const listingIds = listingsStore.listings.map((listing) =>
      parseInt(listing.nft_details.token_id, 10)
    )
    const uniqueListings = Array.from(new Set(listingIds))
    eggs = eggs.filter((egg) => uniqueListings.includes(egg.tokenId))
  }

  filteredEggs.value = eggs
}

watch([selectedDnaTrait, selectedBoostTraits, selectedPoints, filterOnSale], applyFilters, {
  deep: true
})

const handleFilterChange = (onSale) => {
  filterOnSale.value = onSale
  applyFilters()
}

const selectDnaTrait = (trait) => {
  selectedDnaTrait.value = selectedDnaTrait.value === trait ? '' : trait
  applyFilters()
}

const selectBoostTrait = (trait) => {
  if (selectedBoostTraits.value.includes(trait)) {
    selectedBoostTraits.value = selectedBoostTraits.value.filter((t) => t !== trait)
  } else {
    if (selectedBoostTraits.value.length < 3) {
      selectedBoostTraits.value.push(trait)
    }
  }
  applyFilters()
}

const getTraitImage = (color, trait) => {
  if (trait === 'Artist Edition') {
    return `/assets/images/rtfkt_bonus_${color}/ae.svg`
  }
  if (trait === 'Murakami Drip') {
    return `/assets/images/rtfkt_bonus_${color}/mkd.svg`
  }

  return `/assets/images/rtfkt_bonus_${color}/${trait.toLowerCase()}.svg`
}

const getCloneId = (egg) => {
  const targetAddress = '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b'
  let bonusTokenId

  egg.bonusesItems.forEach((item) => {
    if (item.bonusContractAddress === targetAddress) {
      bonusTokenId = item.bonusTokenId
    }
  })
  return bonusTokenId
}

const updateRefreshStatus = () => {
  const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY)
  if (lastUpdate) {
    const parsedLastUpdate = parseInt(lastUpdate, 10)
    if (!isNaN(parsedLastUpdate)) {
      const now = Date.now()
      const timeElapsed = Math.floor((now - parsedLastUpdate) / 1000)
      if (!isNaN(timeElapsed)) {
        timeSinceLastUpdate.value = timeElapsed
        refreshEnabled.value = timeElapsed > 300
      } else {
        console.error('Time elapsed calculation resulted in NaN')
        timeSinceLastUpdate.value = 0
        refreshEnabled.value = true
      }
    } else {
      console.error('Parsed last update is NaN')
      timeSinceLastUpdate.value = 0
      refreshEnabled.value = true
    }
  } else {
    console.error('No last update found in localStorage')
    timeSinceLastUpdate.value = 0
    refreshEnabled.value = true
  }
}

watch(
  () => localStorage.getItem(LAST_UPDATE_KEY),
  (newTimestamp, oldTimestamp) => {
    if (newTimestamp !== oldTimestamp) {
      updateRefreshStatus()
    }
  }
)

const refreshPage = () => {
  window.location.reload()
}

onMounted(async () => {
  loading.value = true
  try {
    loadingMessage.value = 'Retrieving incubation datas...'
    await lBoardStore.loadLBoard()
    loadingMessage.value = 'Retrieving unrevealed datas...'
    await unrevealedStore.fetchUnrevealed(lBoardStore.lBoard)
    loadingMessage.value = 'Retrieving listings datas...'
    await listingsStore.fetchListings(unrevealedStore.unrevealed)
    loadingMessage.value = 'Initializing eggs results...'
    await new Promise((resolve) => setTimeout(resolve, 500))
    applyFilters()
  } catch (error) {
    console.error('Error in onMounted:', error)
    error.value = error
  } finally {
    loading.value = false
    updateRefreshStatus()
    intervalId.value = setInterval(updateRefreshStatus, 500)
  }
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="loading" class="loader">
    <h1>TheGoodEgg</h1>
    <p>{{ loadingMessage }}</p>
    <img :src="getTraitImage('white', 'egg')" alt="egg" />
  </div>

  <header v-else>
    <!-- <button @click="store.fetchAndSaveLBoard">Fetch Lboard</button> -->
    <h1>TheGoodEgg</h1>
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
      :filtered-eggs="filteredEggs"
      :get-trait-image="getTraitImage"
      :get-clone-id="getCloneId"
      :loading="loading"
    />
  </main>
</template>
