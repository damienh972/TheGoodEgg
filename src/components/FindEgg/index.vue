<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch } from 'vue'
import './findegg.scss'
import meButton from '@assets/images/me.svg'

const props = defineProps({
  eggId: Number,
  getTraitImage: Function,
  filteredEgg: Object,
  getCloneId: Function
})

const emit = defineEmits(['update:eggId'])

const internalEggId = ref(props.eggId)

watch(
  () => props.eggId,
  (newVal) => {
    internalEggId.value = newVal
  }
)

const updateEggId = (event) => {
  internalEggId.value = event.target.value
  emit('update:eggId', event.target.value)
}
</script>
<template>
  <section class="find-egg">
    <label>Find egg by id</label>
    <input type="number" v-model="internalEggId" placeholder="Enter Egg ID" @input="updateEggId" />
    <ul v-if="filteredEgg">
      <li>
        <img :src="getTraitImage('black', 'egg')" alt="egg" />
        <p>{{ filteredEgg.points }} pts</p>
        <a
          :href="`https://magiceden.io/item-details/ethereum/0x6c410cf0b8c113dc6a7641b431390b11d5515082/${filteredEgg.tokenId}`"
          target="blank"
        >
          <img :src="meButton" alt="link" class="me-button" />
        </a>
      </li>
      <li v-if="filteredEgg.bonusTraits[0]">
        <img
          :src="getTraitImage('black', filteredEgg.bonusTraits[0])"
          :alt="filteredEgg.bonusTraits[0]"
        />
        <p>{{ filteredEgg.bonusTraits[0] }} DNA</p>
        <img
          class="clone-pfp"
          :src="`https://clonex-assets.rtfkt.com/images/${getCloneId(filteredEgg)}.png`"
          alt="clone pfp"
        />
      </li>
      <template v-if="filteredEgg.bonusTraits.length > 1">
        <li v-for="(trait, index) in filteredEgg.bonusTraits.slice(1)" :key="index">
          <img :src="getTraitImage('black', trait)" :alt="trait" />
          <p>{{ trait }} Boost</p>
          <div class="button-secondary cta-hidden"></div>
        </li>
      </template>
    </ul>
    <hr />
    <p v-if="!filteredEgg && internalEggId">Id not found</p>
  </section>
</template>
