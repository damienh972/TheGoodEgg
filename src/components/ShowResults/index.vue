<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<!-- src/components/ShowResults.vue -->
<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import './showresults.scss'
import eggGif from '@assets/video/egg.webp'
import meButton from '@assets/images/me.svg'

const props = defineProps({
  filteredEggs: Array,
  getTraitImage: Function,
  getCloneId: Function,
  loading: Boolean
})

const scrollContainer = ref(null)
const loadingScroll = ref(false)
const error = ref(null)
const itemsPerPage = 10
const currentPage = ref(1)

const displayedLBoard = ref([])

const roundUpToTwoDecimals = (num) => {
  return Math.ceil(num * 100) / 100
}

const initializeDisplayedLBoard = () => {
  displayedLBoard.value = props.filteredEggs.slice(0, itemsPerPage)
  currentPage.value = 2
}

watch(
  () => props.filteredEggs,
  (newEggs) => {
    initializeDisplayedLBoard()
  },
  { immediate: true }
)

watch(scrollContainer, async (newValue) => {
  if (newValue) {
    await attachScrollListener()
  }
})

const loadMore = async () => {
  if (!loadingScroll.value) {
    loadingScroll.value = true
    try {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = currentPage.value * itemsPerPage
      const newItems = props.filteredEggs.slice(start, end)
      displayedLBoard.value.push(...newItems)
      currentPage.value += 1
    } catch (err) {
      error.value = err.message
    } finally {
      loadingScroll.value = false
    }
  }
}

const onScroll = () => {
  if (scrollContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadMore()
    }
  }
}

const attachScrollListener = async () => {
  await nextTick()
  if (scrollContainer.value && typeof scrollContainer.value.addEventListener === 'function') {
    scrollContainer.value.addEventListener('scroll', onScroll)
  }
}

onMounted(async () => {
  try {
    await initializeDisplayedLBoard()
    await attachScrollListener()
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})
</script>
<template>
  <section v-if="filteredEggs.length > 0 && !loading" class="results">
    <ul class="infinite-scroll" ref="scrollContainer">
      <div v-for="(item, index) in displayedLBoard" class="egg-entry" :key="index">
        <li class="egg-entry__title">
          <h2 class="results__title">Egg #{{ item.tokenId }}</h2>
          <p class="price" v-if="item.price">{{ roundUpToTwoDecimals(item.price) }} eth</p>
        </li>
        <li>
          <img :src="getTraitImage('black', 'egg')" alt="egg" />
          <p>
            {{
              typeof item.points === 'number' && !isNaN(item.points) ? item.points + ' pts' : 'N/A'
            }}
          </p>
          <a
            :href="`https://magiceden.io/item-details/ethereum/0x6c410cf0b8c113dc6a7641b431390b11d5515082/${item.tokenId}`"
            target="blank"
          >
            <img :src="meButton" alt="link" class="me-button" />
          </a>
        </li>
        <li v-if="item.bonusTraits[0]">
          <img :src="getTraitImage('black', item.bonusTraits[0])" :alt="item.bonusTraits[0]" />
          <p>{{ item.bonusTraits[0] }} DNA</p>

          <img
            class="clone-pfp"
            v-lazy="`https://clonex-assets.rtfkt.com/images/${getCloneId(item)}.png`"
            alt="clone pfp"
          />
        </li>
        <template v-if="item.bonusTraits.length > 1">
          <li v-for="(trait, index) in item.bonusTraits.slice(1)" :key="index">
            <div class="trait-image-box">
              <img :src="getTraitImage('black', trait)" :alt="trait" />
            </div>
            <p>{{ trait }} {{ trait !== 'Artist Edition' ? 'Boost' : '' }}</p>
            <div class="button-secondary cta-hidden"></div>
          </li>
        </template>
        <hr />
      </div>
    </ul>
    <div v-if="loadingScroll" class="loading">Loading datas...</div>
  </section>
  <div v-if="!loading && filteredEggs.length === 0" class="results no-entries">
    <img :src="eggGif" alt="egg gif" />
  </div>
</template>
