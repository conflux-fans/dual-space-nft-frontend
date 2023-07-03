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
import { NButton } from "naive-ui";
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
} from "@cfxjs/use-wallet-vue3/ethereum";

const eStatus = useStatus();
const account = useAccount();
const chainId = useChainId();
const balance = useBalance();


async function connectWallet() {
  try {
    await connect();
    console.log("Connect to Fluent Success!");
  } catch (err) {
    if ((err as any)?.code === 4001) {
      console.log("User rejected connection.", {
        key: "user-rejected-connection",
      });
    }
  }
}
</script>

<template>
  <div class="flex justify-between max-w-2xl px-4 py-4 mx-auto sm:px-8">
    <!-- Social icons & Color Mode -->
    <div class="space-x-3 transition text-primary-500">
      <NButton
        v-if="eStatus !== 'in-detecting' && eStatus !== 'active'"
        :disabled="eStatus !== 'not-active'"
        type="primary"
        @click="connectWallet"
      >
        connect
      </NButton>
      <div v-else-if="eStatus === 'active'">
        <p>account: {{ account }}</p>
        <p>chainId: {{ chainId }}</p>
        <p>balance: {{ `${balance?.toDecimalStandardUnit()} CFX` }}</p>

        <!-- <button @click="handleClickSendTransaction">
          Send 1 native token to self (connected account)
        </button> -->
      </div>
    </div>
  </div>
</template>
