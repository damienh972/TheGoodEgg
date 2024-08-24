<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
import './animusfilter.scss'

const props = defineProps({
  species: Array,
  aura: Array,
  generations: Array,
  elements: Array
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
    mkBoost: selectedMkBoost.value
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
    <p>Filter by :</p>
<div class="animus-filter__container">
    <div class="animus-filter__traits">
      <h2>Species</h2>
      <div class="animus-filter__box">
        <v-select
          class="species"
          :options="species"
          v-model="selectedSpecies"
          @update:modelValue="applyFilters"
          :reduce="(trait) => trait"
          label="Species"
        />
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>Aura</h2>
      <div class="animus-filter__box">
        <v-select
          class="aura"
          :options="aura"
          v-model="selectedAura"
          @update:modelValue="applyFilters"
          :reduce="(trait) => trait"
          label="Aura"
        />
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>Generation</h2>
      <div class="animus-filter__box">
        <v-select
          class="generation"
          :options="generations"
          v-model="selectedGeneration"
          @update:modelValue="applyFilters"
          :reduce="(generation) => generation"
          label="Generation"
        />
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>Element</h2>
      <div class="animus-filter__box">
        <v-select
          class="element"
          :options="elements"
          v-model="selectedElement"
          @update:modelValue="applyFilters"
          :reduce="(element) => element"
          label="Element"
        />
      </div>
    </div>

    <div class="animus-filter__traits">
      <h2>MK Boost</h2>
      <div class="animus-filter__box">
        <input type="checkbox" v-model="selectedMkBoost" @change="applyFilters" />
      </div>
    </div>
    </div>
     <a href="https://x.com/damian_shard" target="_blank" class="sig">
    <p>Made with ❤️ by</p>
    <img src="/assets/images/clone_436.png" />
  </a>
  </section>
</template>
