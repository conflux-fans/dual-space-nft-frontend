<template>
  <n-button type="info" @click="authorize">authorize</n-button>
  <n-button v-if="pendingAuthorization" @click="refreshCode">
    refreshCode
  </n-button>
  <n-input v-model:value="username" placeholder="github username" />
  <n-button type="success" :disabled="!code || !username" @click="visitOracle">
    visit oracle
  </n-button>
</template>

<script setup lang="ts">
import { NButton, NInput } from "naive-ui";
import Axios from "axios";

const code = ref("" as string | null);
const username = ref("")

const pendingAuthorization = ref(false);

function refreshCode() {
  code.value = localStorage.getItem("code");
  if (code.value) {
    pendingAuthorization.value = false;
  }
}

function authorize() {
  openGithubAuthorizationWindow();
}

function openGithubAuthorizationWindow() {
  // TODO: state should be unguessable
  const state = new Date().getTime();
  localStorage.setItem("state", state.toString());
  const url = `https://github.com/login/oauth/authorize?client_id=d0c381ebc79d32d0ed38&redirect_uri=http://localhost:3000/callback&state=${state}`;
  window.open(url, "_blank", "popup,width=480,height=640");
  pendingAuthorization.value = true;
}

async function visitOracle() {
  const state = localStorage.getItem("state");
  const code = localStorage.getItem("code");
  try {
    const response = await Axios.request({
      url: `http://localhost:8000/sign/${state}`,
      method: "POST",
      data: {
        batch_nbr: 20230401,
        username: username.value,
        core_address: "cfx:aanhtnrex2nj56kkbws4yx0jeab34ae16pjn9n92xx",
        evm_address: "0x4677ADa49E168df1290C9daA4EC820039D0097E3",
        code,
      },
    });
    console.log(response.data);
  } finally {
    localStorage.removeItem("state");
    localStorage.removeItem("code");
    refreshCode();
  }
}
</script>
