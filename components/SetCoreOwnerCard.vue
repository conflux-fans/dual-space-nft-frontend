<script setup lang="ts">
import {
  NButton,
  NInput,
  NInputNumber,
  NCard,
  NSpace,
  NInputGroup,
  NInputGroupLabel,
} from "naive-ui";
import { format } from "js-conflux-sdk";
import { typedSign, useAccount, } from "@cfxjs/use-wallet-vue3/ethereum";
import {
  constructMetatransaction,
  setCoreOwnerUsingMetatransaction,
} from "~/composables/sdk";
const txHash = ref("");
const tokenId = ref(20635690040002);
const coreOwnerAddress = ref("cfx:aanhtnrex2nj56kkbws4yx0jeab34ae16pjn9n92xx");
const evmAccount = useAccount();
const coreOwnerHexAddress = computed(() => {
  try {
    return format.hexAddress(coreOwnerAddress.value);
  } catch (e) {
    return "";
  }
});
async function sendMetatransaction() {
  if (!evmAccount.value) {
    window.alert("espace account not found");
    return;
  }
  if (!coreOwnerHexAddress.value) {
    window.alert("new core owner address not valid");
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
  console.log(txHash.value)
}
</script>
<template>
  <n-card title="Set Core Owner" size="medium" hoverable>
    <template #header-extra>
      Core Owner and eSpace Owner Shares Equal Permission
    </template>
    <!-- TODO: add verification here -->
    <n-space vertical>
      <n-input-group>
        <n-input-group-label>token id</n-input-group-label>
        <n-input-number
          v-model:value="tokenId"
          placeholder="batch number"
          :step="100"
        />
      </n-input-group>
      <n-input-group>
        <n-input-group-label>New Core Owner Address</n-input-group-label>
        <n-input v-model:value="coreOwnerAddress" placeholder="core owner" />
        <n-button secondary type="info">use fluent address</n-button>
        <n-button secondary type="warning">use empty core address</n-button>
      </n-input-group>
      <n-button type="info" @click="sendMetatransaction"> set core owner from espace </n-button>
    </n-space>
    <TxDisplay :tx-hash="txHash" />
  </n-card>
</template>
<style scoped></style>
