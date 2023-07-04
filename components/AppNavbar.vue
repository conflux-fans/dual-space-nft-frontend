<!-- MIT License

Copyright (c) 2022 Sébastien Chopin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. -->

<script lang="ts" setup>
import { NSpace } from "naive-ui";
import {
  useStatus as useEthStatus,
} from "@cfxjs/use-wallet-vue3/ethereum";
// import { connectWalletWithNetworkSwitching } from "~/composables/evm-connection";
import {
  useStatus as useCfxStatus,
} from "@cfxjs/use-wallet-vue3/conflux";

const eStatus = useEthStatus();
const cStatus = useCfxStatus();

</script>

<template>
  <div class="flex justify-between max-w-2xl px-4 py-4 mx-auto sm:px-8">
    <!-- Social icons & Color Mode -->
    <div class="space-x-3 transition text-primary-500">
      <n-space justify="end">
        <n-space vertical>
          <evm-connection-button
            v-if="eStatus !== 'in-detecting' && eStatus !== 'active'"
            :disabled="eStatus !== 'not-active'"
            />
          <div v-else-if="eStatus === 'active'">
            <EvmNetworkSwitch />
          </div>
          <core-connection-button
            v-if="cStatus !== 'in-detecting' && cStatus !== 'active'"
            :disabled="cStatus !== 'not-active'"
            />
          <div v-else-if="cStatus === 'active'">
            <CoreNetworkSwitch />
          </div>
        </n-space>
      </n-space>
    </div>
  </div>
</template>
