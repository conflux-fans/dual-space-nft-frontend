<template>
  <nft-panel space="core"></nft-panel>
  <ClaimRewardCard/>
  <ScanContractLinkCard space="core" title="Set Evm Owner" method="setEvmOwner" :extra-content="scanCardExtraContent" extra="Set POAP owner in eSpace"></ScanContractLinkCard>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const scanCardExtraContent = `If you want to enable core space transfer, set evm owner to ${runtimeConfig.public.evmContractAddress}`
</script>
<style scoped>
.n-card {
  margin: 10px 0;
}
</style>
