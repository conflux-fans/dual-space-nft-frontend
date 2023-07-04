<template>
  <n-space>
    <n-switch
      v-if="chainId"
      v-model:value="active"
      @click="guaranteeNetwork"
      :disabled="active"
    >
      <template #checked> Connected to eSpace </template>
      <template #unchecked> Click to Switch to eSpace </template>
      <template #checked-icon>
        <n-icon>
          <meta-mask-icon />
        </n-icon>
      </template>
      <template #unchecked-icon>
        <n-icon>
          <meta-mask-icon />
        </n-icon>
      </template>
    </n-switch>
    <n-button text @click="toScan"> {{ account }} </n-button>
  </n-space>
</template>
<script setup lang="ts">
import { NButton, NSpace, NSwitch, NIcon, useNotification } from "naive-ui";
import {
  useChainId,
  addChain,
  switchChain,
  useAccount,
} from "@cfxjs/use-wallet-vue3/ethereum";
import { scanUrl } from "~/utils/scan";

const chainId = useChainId();
const runtimeConfig = useRuntimeConfig();
const account = useAccount();

const active = computed(() => {
  return Number(chainId.value) === Number(runtimeConfig.public.evmNetworkId);
});

const expectedNetworkId = Number(runtimeConfig.public.evmNetworkId);
const expectedChainName = runtimeConfig.public.evmNetworkName;
const notification = useNotification();

function toScan() {
  window.open(scanUrl(
    "evm", "address", account.value!
  ));
}

async function addExpectedChain() {
  try {
    await addChain({
      chainId: "0x" + expectedNetworkId.toString(16),
      chainName: expectedChainName,
      nativeCurrency: {
        name: "Conflux",
        symbol: "CFX",
        decimals: 18,
      },
      rpcUrls: [runtimeConfig.public.evmUrl],
    });
  } catch (err) {
    console.error(err);
    if ((err as any)?.code === 4001) {
      notification.error({
        content: `User rejected add ${expectedChainName}.`,
      });
      throw err;
    } else if (
      (err as any)?.code === -32602 &&
      (err as any)?.message?.indexOf("Duplicate network endpoint") !== -1
    ) {
      notification.warning({ content: `Already added ${expectedChainName}.` });
    }
  }
}

async function switchToExpectedChain() {
  try {
    if (Number(chainId.value) === expectedNetworkId) {
      return;
    }
    console.log("0x" + expectedNetworkId.toString(16));
    await switchChain("0x" + expectedNetworkId.toString(16));
  } catch (err) {
    console.error(err);
    if ((err as any)?.code === 4001) {
      notification.error({
        content: `User rejected switch to ${expectedChainName}.`,
      });
    } else if (
      (err as any)?.code === -32602 &&
      (err as any)?.message?.indexOf("try add the network") !== -1
    ) {
      notification.error({
        content: `${expectedChainName} not added, add first.`,
      });
    }
    throw err;
  }
}

async function guaranteeNetwork() {
  try {
    await addExpectedChain();
    await switchToExpectedChain();
  } catch (err) {
    if (
      (err as any)?.code === -32602 &&
      (err as any)?.message?.indexOf("try add the network") !== -1
    ) {
      await addExpectedChain();
      await switchToExpectedChain();
    }
  }
}
</script>
~/utils/scan