<template>
  <n-card :title="title" size="medium" hoverable>
    <template #header-extra>
      Precheck mint permission
    </template>

    <n-space vertical>
      <n-input-group>
        <n-input-group-label>Batch Number</n-input-group-label>
        <n-input-number
          v-model:value="batchNbr"
          placeholder="batch number"
          :step="100"
        />
      </n-input-group>
      <n-radio-group v-model:value="authChoice" name="authChoiceGroup">
        <n-radio key="crowdin" value="crowdin" label="Crowdin Authorization" />
        <n-radio key="github" value="github" label="Github Authorization" />
      </n-radio-group>
      <n-input-group>
        <n-input v-model:value="username" :placeholder="placeholder"></n-input>
        <n-button type="info" @click="check"> Check </n-button>
      </n-input-group>
      <p>{{ result }}</p>
    </n-space>
  </n-card>
</template>
<script setup lang="ts">
import {
  NButton,
  NInput,
  NInputNumber,
  NCard,
  NSpace,
  NInputGroup,
  NInputGroupLabel,
  NRadio,
  NRadioGroup,
  useNotification
} from 'naive-ui';
import { checkMintPermission } from '../composables/sdk'

const notification = useNotification()
const runtimeConfig = useRuntimeConfig()
const batchNbr = ref(Number(runtimeConfig.public.defaultBatchNbr));
const title = "Precheck Mint Permission"

const authChoice = ref("github")
const placeholder = computed(() => `Input your ${authChoice.value} username to check`)
const result = ref("")
const username = ref("")

async function check() {
  try {
    const authUsername = `${authChoice.value}-${username.value.toLocaleLowerCase()}`
    const rtn = await checkMintPermission(batchNbr.value, authUsername)
    if (BigInt(rtn)=== BigInt(0)) {
      result.value = `No mint permission for ${authUsername} ❌`
    } else {
      result.value = `Permission check for ${authUsername} passed ✅`
    }

  } catch (e: any) {
    notification.error({
      description: e?.data,
      meta: e.message,
      content: 'Error',
    });
  }
}
</script>
