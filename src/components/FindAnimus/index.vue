<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch } from 'vue'
import './findanimus.scss'

const props = defineProps({
  getTraitImage: Function,
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
  const bonus = egg?.bonusesItems?.find(
    (bonusItem) => bonusItem.bonusContractAddress === '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b'
  )
  return bonus ? bonus.bonusTokenId : 'N/A'
}
</script>

<template>
  <section class="find-animus">
    <label>Find animus origins by id</label>
    <input
      type="number"
      v-model="internalAnimusId"
      placeholder="Enter Animus ID"
      @input="updateAnimusId"
    />
    <ul class="find-animus__list" v-if="filteredAnimus">
      <li>
        <img
          class="clone-pfp"
          :src="`https://animus-assets.rtfkt.com/images/${internalAnimusId}.png`"
          alt="animus"
        />
        <p>{{ getPoints(filteredAnimus.tokenId) }} pts</p>
        <a
          :href="`https://magiceden.io/item-details/ethereum/0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b/${getBonusTokenId(filteredAnimus.tokenId)}`"
          target="blank"
        >
          <img
            v-if="getBonusTokenId(filteredAnimus.tokenId) !== 'N/A'"
            class="clone-pfp"
            v-lazy="
              `https://clonex-assets.rtfkt.com/images/${getBonusTokenId(filteredAnimus.tokenId)}.png`
            "
            alt="clone pfp"
          />
          <p v-else>No clone</p>
        </a>
      </li>
    </ul>
    <p v-if="!filteredAnimus && internalAnimusId">Not found</p>
  </section>
</template>
