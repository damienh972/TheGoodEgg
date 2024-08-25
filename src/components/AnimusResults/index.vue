<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/components/AnimusResults.vue -->
<script setup>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import './animusresults.scss'

const props = defineProps({
  percentages: {
    type: Array,
    default: () => []
  },
  probabilities: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Object,
    default: () => ({
      species: '',
      aura: '',
      generation: '',
      element: '',
      mkBoost: false
    })
  },
  loading: {
    type: Boolean,
    default: () => false
  },
  loadingMessage: {
    type: String,
    default: () => "Loading..."
  }
})

const isMobileDevice = ref(false)
const activeTooltip = ref(null)

const toggleTooltip = (index) => {
  activeTooltip.value = activeTooltip.value === index ? null : index
}

const checkDeviceSize = () => {
  isMobileDevice.value = window.innerWidth <= 768
}

onMounted(() => {
  checkDeviceSize()
  window.addEventListener('resize', checkDeviceSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDeviceSize)
})

// Vérifier si au moins un filtre est actif
const isFiltered = computed(() => {
  return (
    props.filters.species || props.filters.aura || props.filters.generation || props.filters.element
  )
})

// Afficher les données en fonction de l'état des filtres
const displayData = computed(() => {
  return isFiltered.value ? props.probabilities : props.percentages
})

// Déterminer le titre à afficher
const title = computed(() => {
  return isFiltered.value ? 'Reveal Relative Probabilities' : 'Animus Reveal Progression '
})
</script>

<template>
  <div class="animus-results">
    <h2>{{ title }}</h2>
    <ul class="chart" v-if="!loading">
      <li v-for="(item, index) in displayData" :key="index">
        <strong>{{ item.range.replace('-', '\n') }}</strong>
        <div
          class="bar"
          :style="
            isMobileDevice
              ? { width: `calc(${item.percentage} * 260px / 100)` }
              : { height: `calc(${item.percentage} * 260px / 100)` }
          "
          @click="toggleTooltip(index)"
        ></div>
        <div v-if="activeTooltip === index" class="tooltip">
          <p>
            <strong>{{ item.range }} Points:</strong>
          </p>
          <p>{{ item.percentage }}% ({{ item.count }} animus)</p>
          <p v-if="!isFiltered">{{ item.count }}/{{ item.total }}</p>
        </div>
      </li>
    </ul>
    <div v-else>{{ loadingMessage }} </div>
  </div>
</template>
