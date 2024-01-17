<script setup lang="ts">
import {
  NButton,
  NCard,
  NSpace,
  NSelect,
  NInputGroup,
  NInputGroupLabel,
  useNotification,
} from "naive-ui";
import { Conflux, format } from "js-conflux-sdk";
// @ts-ignore
import { Contract } from "js-conflux-sdk/src/contract";
import { abi as poolAbi } from '@/assets/metadata/ContributorRewardsPool.json'
import { useAccount as useCfxAccount, provider } from "@cfxjs/use-wallet-vue3/conflux";
import {
  useCoreNfts,
} from "~/composables/sdk";
const txHash = ref("");
const tokenId = ref(0);
const runtimeConfig = useRuntimeConfig()

const sdk = new Conflux({
  networkId: Number(runtimeConfig.public.coreNetworkId), // Note: network is required
  logger: console, // for debug
});

sdk.provider = provider

const rewardsPoolContract: Contract = sdk.Contract({
  abi: poolAbi,
  address: runtimeConfig.public.poolContractAddress,
})

async function claimReward(tokenId: number) {
  try{
    const hash = await rewardsPoolContract.claimReward(tokenId).sendTransaction({from: cfxAccount.value})
  txHash.value = hash
  } catch(e: any) {
    console.error(e)
    notification.error({
      description: e?.data,
      meta: e.message,
      content: 'Error',
    })
  }
}

const notification = useNotification()
const cfxAccount = useCfxAccount()
const tokenIdStatus = computed(()=>{
  return amountCanClaim.value > 0n ? "success" : "error"
})

const getAmountCanClaim = async (tokenId: number) => {
  try {
    const amount = (await rewardsPoolContract.rewardAmountsCanClaimForNFTs([tokenId]))[0]
    return BigInt(format.bigInt(amount))
  } 
  catch(e: any) {
    console.error(e)
    return 0n
  }
}

const amountCanClaim = ref(0n)

watch(tokenId, async (newVal) => {
  amountCanClaim.value = (await getAmountCanClaim(newVal)) / 10n ** 18n
})

const nfts = useCoreNfts()

const tokenIdOptions = computed(() => {
  return nfts.value.map((item) => {
    return {
      value: item.tokenId,
      label: item.tokenId
    }
  })
})

</script>
<template>
  <n-card title="Claim FC Reward" size="medium" hoverable>
    <template #header-extra>
      Claim FC reward for each poap you own (once for each token)
    </template>
    <n-space vertical>
      <n-input-group>
        <n-input-group-label>Token ID</n-input-group-label>
        <n-select
          v-model:value="tokenId"
          :options="tokenIdOptions"
          :status="tokenIdStatus"
        />
        <n-button v-if="tokenId===0" type="info" disabled>
          Token Not Selected
        </n-button>
          <div v-else>
            <n-button v-if="amountCanClaim!==0n" type="info"
            @click="claimReward(tokenId)">
              Claim {{ amountCanClaim }} FC
          </n-button>
          <n-button v-else type="info">
            Reward Already Claimed
          </n-button>
        </div>
        
      </n-input-group>
    </n-space>
    <TxDisplay :tx-hash="txHash" />
  </n-card>
</template>
<style scoped>
</style>
