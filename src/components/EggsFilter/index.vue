<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<!-- src/components/EggsFilter.vue -->
<script setup>
import { ref, watch } from 'vue'
import './eggsfilter.scss'

const props = defineProps({
  dnaTraits: Array,
  boostTraits: Array,
  selectedDnaTrait: String,
  selectedBoostTraits: Array,
  selectDnaTrait: Function,
  selectBoostTrait: Function,
  getTraitImage: Function,
  selectedPoints: Number,
  pointsOptions: Array
})

const emit = defineEmits(['update:selectedPoints'])

const internalSelectedPoints = ref(props.selectedPoints)

watch(
  () => props.selectedPoints,
  (newVal) => {
    internalSelectedPoints.value = newVal
  }
)

const updateSelectedPoints = (event) => {
  internalSelectedPoints.value = parseInt(event.target.value, 10)
  emit('update:selectedPoints', internalSelectedPoints.value)
}

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
<template>
  <div class="burger-menu" @click="toggleMenu">
    <div :class="{ 'burger-open': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <section :class="['eggs-filter', { 'eggs-filter--open': isMenuOpen }]">
    <p>Search by :</p>
    <div class="eggs-filter__dna">
      <h2>Dna traits</h2>
      <div
        class="egg-filter__box"
        v-for="trait in dnaTraits"
        :key="trait"
        :class="{ selected: selectedDnaTrait === trait }"
        @click="selectDnaTrait(trait)"
      >
        <img
          class="eggs-filter__image"
          :src="getTraitImage(selectedDnaTrait === trait ? 'white' : 'yellow', trait)"
          :alt="trait"
        />
      </div>
    </div>
    <div class="egg-filter__boost">
      <h2>Boost traits</h2>
      <div
        class="egg-filter__box"
        v-for="trait in boostTraits"
        :key="trait"
        :class="{ selected: selectedBoostTraits.includes(trait) }"
        @click="selectBoostTrait(trait)"
      >
        <img
          class="eggs-filter__image"
          :src="getTraitImage(selectedBoostTraits.includes(trait) ? 'white' : 'yellow', trait)"
          :alt="trait"
        />
      </div>
    </div>
    <div class="egg-filter__points">
      <label for="points">Filter by Points:</label>
      <select v-model="internalSelectedPoints" @change="updateSelectedPoints" id="points">
        <option v-for="point in pointsOptions" :key="point" :value="point">
          {{ point }}
        </option>
      </select>
    </div>
  </section>
</template>
