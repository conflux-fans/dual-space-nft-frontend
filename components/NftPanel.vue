<template>
  <n-card title="Poap Panel" size="medium" hoverable>
    <template #header-extra>
      Current poaps owned by {{ space }} owner
    </template>
    <n-grid x-gap="12" :cols="3">
      <n-gi v-for="(nft, key) in nfts">
        <SinglePoap  :space="space" :token-id="nft.tokenId" :contract="nft.contract"/>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script setup lang="ts">
import { NCard, NGi, NGrid } from "naive-ui";
import { useAccount } from "@cfxjs/use-wallet-vue3/conflux";
import { queryNfts } from "~/utils/scan";
import { useCoreNfts, useEvmNfts } from "~/composables/sdk"

const props = defineProps<{
  space: "evm" | "core";
}>();

const space = computed(()=>props.space)

const account = useAccount();

let nfts: any

if (props.space == "evm") {
  nfts = useEvmNfts()
} else {
  nfts = useCoreNfts()
}

onMounted(async () => {
  await updateNftInfo();
});

async function updateNftInfo() {
  if (account.value) {
    nfts.value = await queryNfts(props.space, account.value);
    console.log(nfts.value);
  }
}

watch(account, async () => {
  await updateNftInfo();
});
</script>
