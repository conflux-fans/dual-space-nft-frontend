<template>
  <n-card title="Poap Panel" size="medium" hoverable>
    <template #header-extra>
      Current poaps owned by {{ space }} account
    </template>
    <span v-if="nfts.length===0">
      No Contributor Poap owned by 
      <a target="_blank" :href='scanUrl(space, "address", account)'>{{ account }}</a>
    </span>
    <n-grid x-gap="12" :cols="3">
      <n-gi v-for="(nft, key) in nfts">
        <SinglePoap  :space="space" :token-id="nft.tokenId" :contract="nft.contract"/>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script setup lang="ts">
import { NCard, NGi, NGrid } from "naive-ui";
import { useAccount as useCfxAccount } from "@cfxjs/use-wallet-vue3/conflux";
import { useAccount as useEvmAccount } from "@cfxjs/use-wallet-vue3/ethereum";
import { queryNfts } from "~/utils/scan";
import { useCoreNfts, useEvmNfts } from "~/composables/sdk"
import { scanUrl } from "~/utils/scan";

const props = defineProps<{
  space: "evm" | "core";
}>();

const space = computed(()=>props.space)

let account: any

let nfts: any

if (props.space == "evm") {
  nfts = useEvmNfts()
  account = useEvmAccount()
} else {
  nfts = useCoreNfts()
  account = useCfxAccount()
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
