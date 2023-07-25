<template>
  <n-card title="Poap Panel" size="medium" hoverable>
    <template #header-extra>
      Current poap owned by espace owner
    </template>
    <n-grid x-gap="12" :cols="3">
      <n-gi v-for="(nft, key) in nfts">
        <SinglePoap  space="evm" :token-id="nft.tokenId" :contract="nft.contract"/>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script setup lang="ts">
import { NCard, NGi, NGrid } from "naive-ui";
import { useAccount } from "@cfxjs/use-wallet-vue3/ethereum";
import { queryNfts } from "~/utils/scan";
import { useEvmNfts } from "~/composables/sdk"

const account = useAccount();
const nfts = useEvmNfts()

onMounted(async () => {
  await updateNftInfo();
});

async function updateNftInfo() {
  if (account.value) {
    nfts.value = await queryNfts("evm", account.value);
    console.log(nfts.value);
  }
}

watch(account, async () => {
  await updateNftInfo();
});
</script>
