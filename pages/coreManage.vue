<template>
  <nft-panel space="core"></nft-panel>
  <ClaimRewardCard/>
  <ScanContractLinkCard space="core" title="Set Evm Owner" method="setEvmOwner" :extra-content="scanCardExtraContent" extra="Set POAP owner in eSpace"></ScanContractLinkCard>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const scanCardExtraContent = `Set Evm Owner to ${runtimeConfig.public.evmContractAddress} to enable core space transfer`
</script>
<style scoped>
.n-card {
  margin: 10px 0;
}
</style>
