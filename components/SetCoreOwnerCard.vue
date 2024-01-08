<script setup lang="ts">
import {
  NButton,
  NInput,
  NIcon,
  NCard,
  NSpace,
  NSelect,
  NRadio,
  NRadioGroup,
  NInputGroup,
  NInputGroupLabel,
  useNotification,
} from "naive-ui";
import { format } from "js-conflux-sdk";
import { useAccount as useCfxAccount } from "@cfxjs/use-wallet-vue3/conflux";
import { typedSign, useAccount, useChainId } from "@cfxjs/use-wallet-vue3/ethereum";
import {
  constructMetatransaction,
  setCoreOwnerUsingMetatransaction,
  useEvmNfts,
  evmOwnerOf,
} from "~/composables/sdk";
const txHash = ref("");
const tokenId = ref(0);
const coreOwnerAddress = ref("");
const evmAccount = useAccount();
const runtimeConfig = useRuntimeConfig()
const evmChainId= useChainId()
const canSendMetatransaction = computed(() => {
  return Number(evmChainId.value) === Number(runtimeConfig.public.evmNetworkId) && !!evmAccount.value && tokenIdStatus.value === 'success'
});
const coreOwnerHexAddress = computed(() => {
  if (setOrReset.value === 'reset') {
    return format.hexAddress(runtimeConfig.public.coreContractAddress)
  }
  try {
    return format.hexAddress(coreOwnerAddress.value);
  } catch (e) {
    return "";
  }
});

async function sendMetatransaction() {
  if (!evmAccount.value) {
    notification.error({ content: "espace account not found"});
    return;
  }
  if (!coreOwnerHexAddress.value) {
    notification.error({ content: "new core owner address not valid" });
    return;
  }
  const signature = await typedSign(
    await constructMetatransaction(
      evmAccount.value,
      tokenId.value,
      coreOwnerHexAddress.value
    )
  );
  txHash.value = await setCoreOwnerUsingMetatransaction(
    evmAccount.value,
    tokenId.value,
    coreOwnerHexAddress.value,
    signature
  );
  console.log(txHash.value);
}

const notification = useNotification()
const cfxAccount = useCfxAccount()
const tokenIdStatus = ref("error" as "error" | "success")

watch(tokenId, async (newVal) => {
  const eOwner = await evmOwnerOf(newVal)
  console.log(eOwner)
  if(eOwner === evmAccount.value ) {
    tokenIdStatus.value = "success"
  } else {
    tokenIdStatus.value = "error"
  }
})

function useFluentAccount() {
  if (cfxAccount.value)
    coreOwnerAddress.value = cfxAccount.value
  else {
    notification.error({ content: "cannot get fluent account" })
  }
}

const nfts = useEvmNfts()

const tokenIdOptions = computed(() => {
  return nfts.value.map((item) => {
    return {
      value: item.tokenId,
      label: item.tokenId
    }
  })
})

const setOrReset = ref("set" as "set" | "reset")

</script>
<template>
  <n-card title="Set Core Owner" size="medium" hoverable>
    <template #header-extra>
      Set Core Owner Using eSpace Metatransaction
    </template>
    <!-- TODO: add verification here -->
    <n-space vertical>
      <n-input-group>
        <n-input-group-label>Token ID</n-input-group-label>
        <n-select
          v-model:value="tokenId"
          :options="tokenIdOptions"
          :status="tokenIdStatus"
        />
      </n-input-group>
      <n-radio-group v-model:value="setOrReset">
        <n-radio value="set" label="Change Core Owner" />
        <n-radio value="reset" label="Reset Core Owner" />
      </n-radio-group>
      <n-input-group v-if="setOrReset === 'set'">
        <n-input-group-label>New Core Owner Address</n-input-group-label>
        <n-input
          v-model:value="coreOwnerAddress"
          clearable
          placeholder="Make sure you own this account"
        />
        <n-button secondary type="info" @click="useFluentAccount">
          <template #icon>
            <n-icon>
              <FluentIcon></FluentIcon>
            </n-icon>
          </template>
          Use Core Space Address
        </n-button>
      </n-input-group>
      <span v-else>
        The resetted core owner will be the core contract 
        <a _target="blank" :href='scanUrl("core", "address", coreOwnerHexAddress)'>{{coreOwnerAddress}}{{ runtimeConfig.public.coreContractAddress }} </a> (<b>{{ coreOwnerHexAddress }}</b> in hex)
      </span>
      <n-button type="info" :disabled="!canSendMetatransaction" @click="sendMetatransaction">
        Send Metatransaction
      </n-button>
    </n-space>
    <TxDisplay :tx-hash="txHash" />
  </n-card>
</template>
<style scoped></style>
