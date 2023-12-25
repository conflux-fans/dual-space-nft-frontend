<template>
  <n-card :title="title" size="medium" hoverable>
    <template #header-extra>
      {{ props.extra }}
    </template>
    <n-space vertical>
      <span>Visit <a :href="scanUrl(props.space, 'address', contractAddress)" target="_blank">{{ contractAddress }}</a> and use method <i><b>{{ method }}</b></i></span>
      <span>{{ extraContent }}</span>
    </n-space>
  </n-card>
</template>
<script setup lang="ts">
import { NCard, NSpace } from 'naive-ui';
import { scanUrl } from '~/utils/scan';

const props = defineProps<{
  space: "evm" | "core";
  method: string;
  extraContent: string;
  extra?: string;
}>();

const config = useRuntimeConfig()
const title = "Set Evm Owner"

const contractAddress = 
  props.space === "evm" ? config.public.evmContractAddress
  : config.public.coreContractAddress


</script>
