<script setup>
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AnimusResults, AnimusFilter, FindAnimus } from '@/components'
import { useLBoardStore } from '@/stores/leaderboard'
import { useUnrevealedStore } from '@/stores/unrevealed'
import { useAnimusStore } from '@/stores/animus'

const router = useRouter()
const lBoardStore = useLBoardStore()
const unrevealedStore = useUnrevealedStore()
const animusStore = useAnimusStore()
const { lBoard } = lBoardStore
const { burned } = unrevealedStore

const animusId = ref('')
const loading = ref(false)
const loadingMessage = ref('Loading ...')

onBeforeMount(() => {
  if (burned.length === 0) {
    router.push('/')
  }
})

onMounted(async () => {
  loading.value = true
  try {
    loadingMessage.value = 'Retrieving all animus...'
    await animusStore.getAnimus(burned.length)
    loadingMessage.value = 'Generate animus stats...'
    await enrichAnimusWithBurnedData()
    loadingMessage.value = 'Update animus database...'
    await animusStore.refreshAnimus(burned, animusStore.animus)
  } catch (error) {
    console.error('Error in onMounted:', error)
    error.value = error
  } finally {
    loading.value = false
  }
})

const animus = computed(() => burned.find((animus) => animus.tokenId === parseInt(animusId.value)))

const enrichAnimusWithBurnedData = async () => {
  const burnedLookup = burned.reduce((acc, egg) => {
    acc[egg.tokenId.toString()] = egg
    return acc
  }, {})

  const enrichedAnimus = animusStore.animus.map((animus) => {
    const correspondingBurnedEgg = burnedLookup[animus.tokenId]

    return {
      ...animus,
      points: correspondingBurnedEgg ? Number(correspondingBurnedEgg.points) : null,
      hasMurakamiDrip: correspondingBurnedEgg
        ? correspondingBurnedEgg.bonusTraits.includes('Murakami Drip')
        : false
    }
  })

  animusStore.animus = enrichedAnimus
}

const filters = ref({
  species: '',
  aura: '',
  generation: '',
  element: '',
  mkBoost: false
})

const species = computed(() => {
  return [...new Set(animusStore.animus.map((animus) => animus.species))]
})

const aura = ref(['Legendary', 'Epic', 'Rare', 'Uncommon'])
const generations = ref(['1', '2', '3'])
const elements = ref([
  'TM Animus',
  'Electro',
  'Plant',
  'Water',
  'Earth',
  'Fire',
  'Shadow',
  'TM Drip',
  'Light',
  'Cosmic',
  'Magic'
])

const filteredAnimus = computed(() => {
  return animusStore.animus.filter((animus) => {
    const matchesMkBoost = !filters.value.mkBoost || animus.hasMurakamiDrip
    return (
      (!filters.value.species || animus.species === filters.value.species) &&
      (!filters.value.aura || animus.aura === filters.value.aura) &&
      (!filters.value.generation || animus.generation === filters.value.generation) &&
      (!filters.value.element || animus.element === filters.value.element) &&
      matchesMkBoost
    )
  })
})

const calculatePercentages = () => {
  const pointRanges = [
    { min: 0, max: 30 },
    { min: 31, max: 60 },
    { min: 61, max: 90 },
    { min: 91, max: 120 },
    { min: 121, max: 150 },
    { min: 151, max: 180 },
    { min: 181, max: 210 },
    { min: 211, max: 240 },
    { min: 241, max: 270 },
    { min: 271, max: 300 }
  ]

  return pointRanges.map((range) => {
    const totalEggsInRange = lBoard.filter((egg) => {
      const eggPoints = Number(egg.points)
      const isInRange = eggPoints >= range.min && eggPoints <= range.max
      const isMurakami = egg.bonusTraits.includes('Murakami Drip')

      if (filters.value.mkBoost) {
        return isInRange && isMurakami
      } else {
        return isInRange && !isMurakami
      }
    }).length

    const eggsInRange = filteredAnimus.value.filter((animus) => {
      const isInRange = animus.points >= range.min && animus.points <= range.max

      if (filters.value.mkBoost) {
        return isInRange && animus.hasMurakamiDrip
      } else {
        return isInRange && !animus.hasMurakamiDrip
      }
    })

    const percentage = totalEggsInRange > 0 ? (eggsInRange.length / totalEggsInRange) * 100 : 0

    return {
      range: `${range.min}-${range.max}`,
      percentage: percentage.toFixed(2),
      count: eggsInRange.length,
      total: totalEggsInRange
    }
  })
}

const calculateProbabilities = () => {
  const pointRanges = [
    { min: 0, max: 30 },
    { min: 31, max: 60 },
    { min: 61, max: 90 },
    { min: 91, max: 120 },
    { min: 121, max: 150 },
    { min: 151, max: 180 },
    { min: 181, max: 210 },
    { min: 211, max: 240 },
    { min: 241, max: 270 },
    { min: 271, max: 300 }
  ]

  const rawProbabilities = pointRanges.map((range) => {
    const totalEggsInRange = lBoard.filter((egg) => {
      const eggPoints = Number(egg.points)
      const isInRange = eggPoints >= range.min && eggPoints <= range.max
      const isMurakami = egg.bonusTraits.includes('Murakami Drip')

      if (filters.value.mkBoost) {
        return isInRange && isMurakami
      } else {
        return isInRange && !isMurakami
      }
    }).length

    const filteredEggsInRange = filteredAnimus.value.filter((animus) => {
      const isInRange = animus.points >= range.min && animus.points <= range.max

      if (filters.value.mkBoost) {
        return isInRange && animus.hasMurakamiDrip
      } else {
        return isInRange && !animus.hasMurakamiDrip
      }
    })

    const probability =
      totalEggsInRange > 0 && filteredEggsInRange.length > 0
        ? filteredEggsInRange.length / totalEggsInRange
        : 0

    return {
      range: `${range.min}-${range.max}`,
      probability, // Probabilité brute non normalisée
      count: filteredEggsInRange.length,
      total: totalEggsInRange
    }
  })

  // Calculer la somme totale des probabilités brutes
  const totalProbability = rawProbabilities.reduce((sum, item) => sum + item.probability, 0)

  // Normaliser les probabilités pour que la somme totale fasse 100%
  return rawProbabilities.map((item) => {
    const normalizedProbability =
      totalProbability > 0 ? (item.probability / totalProbability) * 100 : 0

    return {
      range: item.range,
      percentage: normalizedProbability.toFixed(2),
      count: item.count,
      total: item.total
    }
  })
}

const percentages = computed(() => calculatePercentages())
const probabilities = computed(() => calculateProbabilities())

const applyFilters = (newFilters) => {
  filters.value = newFilters
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
</script>

<template>
  <header>
    <h1>TheGoodAnimus</h1>
    <router-link class="link" to="/">Go to Eggs</router-link>
    <FindAnimus
      :get-trait-image="getTraitImage"
      :burned-eggs="burned"
      :filtered-animus="animus"
      @update:animusId="animusId = $event"
    />
  </header>

  <main>
    <AnimusFilter
      :species="species"
      :aura="aura"
      :generations="generations"
      :elements="elements"
      @filter-change="applyFilters"
    />
    <AnimusResults
      :percentages="percentages"
      :probabilities="probabilities"
      :filters="filters"
      :loading="loading"
      :loading-message="loadingMessage"
    />
  </main>
</template>
