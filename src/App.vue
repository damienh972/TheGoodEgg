<!-- src/App.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useLBoardStore } from './stores'
import { EggsFilter, FindEgg, ShowResults } from '@components'

const store = useLBoardStore()
const eggId = ref('')
const dnaTraits = ['Alien', 'Murakami', 'Undead', 'Reptile', 'Angel', 'Demon', 'Robot', 'Human']

const boostTraits = ['Murakami Drip', 'Helmet', 'Snake']
const selectedDnaTrait = ref('')
const selectedBoostTraits = ref([])
const selectedPoints = ref(null)

const loading = ref(false)
const error = ref('')

const pointsOptions = computed(() => {
  const uniquePoints = [...new Set(store.lBoard.map((egg) => egg.points))]
  return uniquePoints.filter((point) => !isNaN(point)).sort((a, b) => a - b)
})

const filteredEgg = computed(() =>
  store.lBoard.find((egg) => egg.tokenId === parseInt(eggId.value))
)

const filteredEggs = computed(() => {
  return store.lBoard.filter((egg) => {
    const matchesDnaTrait = selectedDnaTrait.value
      ? egg.bonusTraits.includes(selectedDnaTrait.value)
      : true
    const matchesBoostTraits = selectedBoostTraits.value.length
      ? selectedBoostTraits.value.every((trait) => egg.bonusTraits.includes(trait))
      : true
    const matchesPoints = selectedPoints.value ? egg.points === selectedPoints.value : true
    return matchesDnaTrait && matchesBoostTraits && matchesPoints
  })
})

const selectDnaTrait = (trait) => {
  selectedDnaTrait.value = selectedDnaTrait.value === trait ? '' : trait
}

const selectBoostTrait = (trait) => {
  if (selectedBoostTraits.value.includes(trait)) {
    selectedBoostTraits.value = selectedBoostTraits.value.filter((t) => t !== trait)
  } else {
    if (selectedBoostTraits.value.length < 3) {
      selectedBoostTraits.value.push(trait)
    }
  }
}

const getTraitImage = (color, trait) => {
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
</script>

<template>
  <header>
    <h1>TheGoodEgg</h1>
    <!-- <button @click="store.fetchAndSaveLBoard">Fetch Lboard</button> -->
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="!loading && !error">
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
          @update:selectedPoints="selectedPoints = $event"
        />
      </nav>
    </div>
  </header>
  <main>
    <ShowResults
      :filtered-eggs="filteredEggs"
      :get-trait-image="getTraitImage"
      :get-clone-id="getCloneId"
    />
  </main>
</template>
