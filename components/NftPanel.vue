<template>
  <n-card title="Poap Panel" size="medium" hoverable>
    <template #header-extra>
      Current poap owned by espace owner
    </template>
    <SinglePoap v-for="(nft, key) in nfts" space="evm" :token-id="nft.tokenId" :contract="nft.contract"/>
  </n-card>
</template>
<script setup lang="ts">
import { NCard } from "naive-ui";
import { useAccount } from "@cfxjs/use-wallet-vue3/ethereum";
import { queryNfts } from "~/utils/scan";

const account = useAccount();
const nfts = ref([] as {
  tokenId: string,
  contract: string
}[]);

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
