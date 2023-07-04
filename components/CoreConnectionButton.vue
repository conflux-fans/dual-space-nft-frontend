<script setup lang="ts">
import { connect } from "@cfxjs/use-wallet-vue3/conflux";
import { useNotification, NButton, NIcon } from "naive-ui";

const notification = useNotification();

async function connectWallet() {
  try {
    await connect();
    console.log(`Connect to core Success!`);
  } catch (err) {
    if ((err as any)?.code === 4001) {
      notification.error({ content: "User rejected connection." });
    }
  }
}
</script>
<template>
  <n-button @click="connectWallet">
    <template #icon>
      <n-icon>
        <fluent-icon />
      </n-icon>
    </template>
    Connect
  </n-button>
</template>
