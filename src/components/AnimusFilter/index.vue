<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
import './animusfilter.scss'

const props = defineProps({
  species: Array,
  aura: Array,
  generations: Array,
  elements: Array,
})

const emit = defineEmits(['filter-change'])

const selectedSpecies = ref('')
const selectedAura = ref('')
const selectedGeneration = ref('')
const selectedElement = ref('')
const selectedMkBoost = ref(false)

const applyFilters = () => {
  emit('filter-change', {
    species: selectedSpecies.value,
    aura: selectedAura.value,
    generation: selectedGeneration.value,
    element: selectedElement.value,
    mkBoost: selectedMkBoost.value,
  })
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
  <section :class="['animus-filter', { 'animus-filter--open': isMenuOpen }]">
    <p>Search by :</p>

    <div class="animus-filter__traits">
      <h2>Species</h2>
      <div class="animus-filter__box">
        <select v-model="selectedSpecies" @change="applyFilters">
          <option value="">All</option>
          <option v-for="trait in species" :key="trait" :value="trait">{{ trait }}</option>
        </select>
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>Aura</h2>
      <div class="animus-filter__box">
        <select v-model="selectedAura" @change="applyFilters">
          <option value="">All</option>
          <option v-for="trait in aura" :key="trait" :value="trait">{{ trait }}</option>
        </select>
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>Generation</h2>
      <div class="animus-filter__box">
        <select v-model="selectedGeneration" @change="applyFilters">
          <option value="">All</option>
          <option v-for="generation in generations" :key="generation" :value="generation">{{ generation }}</option>
        </select>
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>Element</h2>
      <div class="animus-filter__box">
        <select v-model="selectedElement" @change="applyFilters">
          <option value="">All</option>
          <option v-for="element in elements" :key="element" :value="element">{{ element }}</option>
        </select>
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>MK Boost</h2>
      <div class="animus-filter__box">
        <input type="checkbox" v-model="selectedMkBoost" @change="applyFilters" />
      </div>
    </div>
  </section>
</template>
