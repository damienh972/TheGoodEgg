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
  totalResults: Number,
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

const updateSelectedPoints = async (value) => {
  internalSelectedPoints.value = parseInt(value, 10)
  if (isNaN(internalSelectedPoints.value)) {
    internalSelectedPoints.value = null
  }
  emit('update:selectedPoints', internalSelectedPoints.value)
  await checkForEasterEgg()
  await providePointsHint()
}

const applyFilter = () => {
  emit('filter-change', filterOnSale.value)
}

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Easter egg game logic
const correctCombinationHash = 'a48200d635b2095908f40ecd61be337a14f956c0de98fffa28402fbb7f9ce22f'
const correctEggNumberHash = 'a5e3e3898bf3bb3ff30f18b41419a8dff65495cb4238a19aeec430e454946835'

const hashString = async (str) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const checkForEasterEgg = async () => {
  const combination = `${props.selectedDnaTrait || ''}+${props.selectedBoostTraits.join(',') || ''}+${internalSelectedPoints.value || ''}`
  const combinationHash = await hashString(combination)

  if (combinationHash === correctCombinationHash) {
    console.log(
      `Congratulations! Now enter the correct egg number in the console to win: checkEggNumber()`
    )
  } else {
    console.log(
      "Keep trying! You haven't found the correct combination yet. You may need to %cshowHint%c",
      'color: green; font-weight: bold; font-size: 14px',
      ''
    )
  }
}

const hintMessage = ref('')
const isHintVisible = ref(false)

const showHintMessage = () => {
  isHintVisible.value = true
  setTimeout(() => {
    isHintVisible.value = false
  }, 1000)
}

const providePointsHint = async () => {
  if (internalSelectedPoints.value !== null) {
    const correctPointsHash = 'a9358dbf6ba44289451b64b14c0a98eb4c56c6b6374ac16a36ddf41f5e5fa3d6'
    const pointsHash = await hashString(internalSelectedPoints.value.toString())
    if (pointsHash === correctPointsHash) {
      hintMessage.value = 'Correct incubation points!'
    } else {
      hintMessage.value = 'Try another incubation point value.'
    }
  } else {
    hintMessage.value = 'Try another incubation point value.'
  }
}

const selectDnaTraitWithHint = async (trait) => {
  await props.selectDnaTrait(trait)
  const correctDNAHash = '9ffa865f2bc6e850157bb454ef3e00fa789e3f8cc631552941a99ba3fcddde51'
  const combination = `${props.selectedDnaTrait || ''}`
  const combinationHash = await hashString(combination)

  if (combinationHash === correctDNAHash) {
    hintMessage.value = 'Correct DNA trait!'
  } else {
    hintMessage.value = 'Try another DNA trait.'
  }
  checkForEasterEgg()
}

const selectBoostTraitWithHint = async (trait) => {
  await props.selectBoostTrait(trait)
  const correctBoostHash = 'a47fdf6415fc436ee65ac597251edfa2e58a5ea60b53e65d2886ea6cb17ba374'
  const combination = `${props.selectedBoostTraits || ''}`
  const combinationHash = await hashString(combination)
  if (combinationHash === correctBoostHash) {
    hintMessage.value = 'Correct boost trait.'
  } else {
    hintMessage.value = 'Try another boost trait.'
  }
  checkForEasterEgg()
}

window.showHint = () => {
  showHintMessage()
  return 'Do you saw me ?'
}

window.checkEggNumber = async () => {
  const eggNumber = prompt('Enter the egg number:')
  const eggNumberHash = await hashString(eggNumber)
  if (eggNumberHash === correctEggNumberHash) {
    console.log('You won the game! 🎉')
  } else {
    console.log('Incorrect egg number. Try again!')
  }
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
        @click="selectDnaTraitWithHint(trait)"
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
        @click="selectBoostTraitWithHint(trait)"
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
      <p>Results: {{ totalResults }} /10004</p>
    </section>
    <p :class="['hint', { visible: isHintVisible }]">{{ hintMessage }}</p>
    <a href="https://x.com/damian_shard" target="_blank" class="sig">
      <p>Made with ❤️ by</p>
      <img src="/assets/images/clone_436.png" />
    </a>
  </section>
</template>
