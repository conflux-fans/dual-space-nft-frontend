<template>
  <a v-if="props.txHash" target="_blank" :href="scanTxUrl">{{ props.txHash }}</a>
</template>
<script setup lang="ts">

const props = defineProps<{
  txHash: string
}>()

const scanTxUrl = computed(() => {
  return scanUrl("core", "transaction", props.txHash)
})

</script>
