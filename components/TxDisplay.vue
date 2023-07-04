<template>
  <a v-if="props.txHash" target="_blank" :href="scanTxUrl">{{ props.txHash }}</a>
</template>
<script setup lang="ts">

const props = defineProps<{
  txHash: string
}>()

const scanTxUrl = computed(() => {
  return `https://testnet.confluxscan.io/transaction/${props.txHash}`
})

</script>
