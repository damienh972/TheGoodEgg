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
  pointsOptions: Array,
  totalEggsWithPrice: Number,
  loading: Boolean
})

const emit = defineEmits(['update:selectedPoints', 'filter-change'])
const internalSelectedPoints = ref(props.selectedPoints || null)
const filterOnSale = ref(false)

watch(
  () => props.selectedPoints,
  (newVal) => {
    internalSelectedPoints.value = isNaN(newVal) ? null : newVal
  }
)

const updateSelectedPoints = (value) => {
  internalSelectedPoints.value = parseInt(value, 10)
  if (isNaN(internalSelectedPoints.value)) {
    internalSelectedPoints.value = null
  }
  emit('update:selectedPoints', internalSelectedPoints.value)
}

const applyFilter = () => {
  emit('filter-change', filterOnSale.value)
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
    <section class="egg-filter__points">
      <div class="egg-filter__container">
        <label for="points">Filter by Points:</label>
        <v-select
          class="points"
          :options="pointsOptions"
          v-model="internalSelectedPoints"
          @update:modelValue="updateSelectedPoints"
          :reduce="(point) => point"
          label="point"
        />
      </div>
      <div class="egg-filter__container">
        <label for="sale">On Sale ({{ totalEggsWithPrice ? totalEggsWithPrice : '--' }}) :</label>
        <input
          class="sale"
          type="checkbox"
          v-model="filterOnSale"
          @change="applyFilter"
          :disabled="loading"
        />
      </div>
    </section>
    <a href="https://x.com/damian_shard" target="_blank" class="sig">
      <p>Made with ❤️ by</p>
      <img src="/assets/images/clone_436.png" />
    </a>
  </section>
</template>
