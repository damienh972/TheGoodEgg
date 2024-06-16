<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<!-- src/components/ShowResults.vue -->
<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { useLBoardStore } from '@/stores'
import './showresults.scss'
import eggGif from '@assets/video/egg.webp'
import meButton from '@assets/images/me.svg'

const props = defineProps({
  filteredEggs: Array,
  getTraitImage: Function,
  getCloneId: Function
})

const store = useLBoardStore()
const scrollContainer = ref(null)
const loading = ref(false)
const error = ref(null)
const itemsPerPage = 10
const currentPage = ref(1)

const displayedLBoard = ref([])

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
const loadMore = async () => {
  if (!loading.value) {
    loading.value = true
    try {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = currentPage.value * itemsPerPage
      const newItems = props.filteredEggs.slice(start, end)
      displayedLBoard.value.push(...newItems)
      currentPage.value += 1
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
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

onMounted(async () => {
  try {
    await store.loadLBoard()
    initializeDisplayedLBoard()
    nextTick(() => {
      if (scrollContainer.value && typeof scrollContainer.value.addEventListener === 'function') {
        scrollContainer.value.addEventListener('scroll', onScroll)
      } else {
        console.error(
          'scrollContainer is not a DOM element or component element:',
          scrollContainer.value
        )
      }
    })
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})
</script>
<template>
  <div v-if="filteredEggs.length > 0" class="results">
    <ul class="infinite-scroll" ref="scrollContainer">
      <div v-for="(item, index) in displayedLBoard" class="egg-entry" :key="index">
        <h2 class="results__title">Egg #{{ item.tokenId }}</h2>
        <li>
          <img :src="getTraitImage('black', 'egg')" alt="egg" />
          <p>{{ item.points }} pts</p>
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
            <img :src="getTraitImage('black', trait)" :alt="trait" />
            <p>{{ trait }} Boost</p>
            <div class="button-secondary cta-hidden"></div>
          </li>
        </template>
        <hr />
      </div>
    </ul>
    <div v-if="loading" class="loading">Loading...</div>
  </div>

  <div v-else class="results no-entries">
    <img :src="eggGif" alt="egg gif" />
  </div>
</template>
