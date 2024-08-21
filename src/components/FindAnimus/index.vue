<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch } from 'vue'
import './findanimus.scss'

const props = defineProps({
  animusId: [Number, String],
  burnedEggs: Array,
  filteredAnimus: Object
})

const emit = defineEmits(['update:animusId'])

const internalAnimusId = ref(props.animusId)

watch(
  () => props.animusId,
  (newVal) => {
    internalAnimusId.value = newVal
  }
)

const updateAnimusId = (event) => {
  internalAnimusId.value = event.target.value
  emit('update:animusId', internalAnimusId.value)
}

const getPoints = (tokenId) => {
  const egg = props.burnedEggs.find((egg) => egg.tokenId.toString() === tokenId.toString())
  return egg ? egg.points : 'N/A'
}

const getBonusTokenId = (tokenId) => {
  const egg = props.burnedEggs.find((egg) => egg.tokenId.toString() === tokenId.toString())
  const bonus = egg?.bonusesItems?.find((bonusItem) => bonusItem.bonusContractAddress === '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b')
  return bonus ? bonus.bonusTokenId : 'N/A'
}
console.log("filtered animus", props.filteredAnimus)
</script>

<template>
  <section class="find-animus">
    <label>Find animus by id</label>
    <input type="number" v-model="internalAnimusId" placeholder="Enter Animus ID" @input="updateAnimusId" />
    <ul v-if="filteredAnimus">
      <li>
        <p>{{ getPoints(filteredAnimus.tokenId) }} pts</p>
        <p>Bonus Token ID: {{ getBonusTokenId(filteredAnimus.tokenId) }}</p>
      </li>
    </ul>
    <p v-if="!filteredAnimus && internalAnimusId">ID not found</p>
  </section>
</template>
