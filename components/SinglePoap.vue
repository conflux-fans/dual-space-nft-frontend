<template>
  <n-card title="Poap" size="small" hoverable>
    <n-space>
      <n-button text @click="toScan">Token ID: {{ tokenId }}</n-button>
      <n-button text @click="copyTokenId">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
          >
            <path
              d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"
              fill="currentColor"
            ></path>
            <path
              d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4z"
              fill="currentColor"
            ></path>
          </svg>
        </template>
      </n-button>
    </n-space>
  </n-card>
</template>
<script setup lang="ts">
import { NButton, NCard, useNotification, NSpace } from "naive-ui";
import { nftUrl } from "~/utils/scan";

const notification = useNotification();

const props = defineProps<{
  tokenId: string;
  space: "evm" | "core";
  contract: string;
}>();

function toScan() {
  window.open(nftUrl(props.space, props.contract, props.tokenId));
}

function copyTokenId() {
  console.log(notification);
  navigator.clipboard
    .writeText(props.tokenId.toString())
    .then(() => {
      notification.success({ content: "Copied to Clipboard!", duration: 3000 });
    })
    .catch((err) => {
      console.error(err);
      notification.error({ content: "Copy fails!", duration: 3000 });
    });
}
</script>
