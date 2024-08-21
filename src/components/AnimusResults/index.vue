<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/components/AnimusResults.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentages: {
    type: Array,
    default: () => [],
  },
  probabilities: {
    type: Array,
    default: () => [],
  },
  filters: {
    type: Object,
    default: () => ({
      species: '',
      aura: '',
      generation: '',
      element: '',
      mkBoost: false,
    }),
  },
  loading: {
    type: Boolean,
    default: () => false,
  }
})

// Vérifier si au moins un filtre est actif
const isFiltered = computed(() => {
  return (
    props.filters.species ||
    props.filters.aura ||
    props.filters.generation ||
    props.filters.element
  )
})

// Afficher les données en fonction de l'état des filtres
const displayData = computed(() => {
  return isFiltered.value ? props.probabilities : props.percentages
})

// Déterminer le titre à afficher
const title = computed(() => {
  return isFiltered.value
    ? 'Reveal Probabilities by Point Ranges'
    : 'Animus Reveal Percentages by Point Ranges'
})
</script>

<template>
  <div class="animus-results">
    <h2>{{ title }}</h2>
    <ul v-if="!loading">
      <li v-for="(item, index) in displayData" :key="index">
        <strong>{{ item.range }} Points: </strong>
        {{ item.percentage }}% ({{ item.count }} animus
        <span v-if="!isFiltered">{{ item.total ? `/${item.total}` : '' }}</span>)
      </li>
    </ul>
    <div v-else>loading</div>
  </div>
</template>
