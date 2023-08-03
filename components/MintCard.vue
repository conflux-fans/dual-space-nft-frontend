<template>
  <n-card title="Mint" size="medium" hoverable>
    <template #header-extra> mint poap if you had permission </template>
    <!-- TODO: add verification here -->
    <n-space vertical>
      <n-input-group>
        <n-input-group-label>Batch Number</n-input-group-label>
        <n-input-number
          v-model:value="batchNbr"
          placeholder="batch number"
          :step="100"
        />
      </n-input-group>
      <n-radio-group v-model:value="mintChoice" name="mintChoiceGroup">
        <n-radio
          v-for="mintOption in mintOptions"
          :key="mintOption.value"
          :value="mintOption.value"
          :label="mintOption.label"
        />
      </n-radio-group>
      <n-collapse-transition :show="mintChoice === 'both'">
        WARNING: core address and espace address shares equal authority.
        Poap will not be transferrable until one side owner is resetted.
      </n-collapse-transition>
      <n-collapse-transition :show="mintChoice !== 'evm'">
        <n-input-group>
          <n-input-group-label>Your Core Address</n-input-group-label>
          <n-input clearable v-model:value="coreOwnerInput" placeholder="core owner" />
          <n-button round secondary type="info"  @click="useFluentAccount">
            <template #icon>
              <n-icon>
                <FluentIcon></FluentIcon>
              </n-icon>
            </template>
            Use Core Space Address
          </n-button>
          <!-- <n-button secondary type="warning">use empty core address</n-button> -->
        </n-input-group>
      </n-collapse-transition>
      <n-collapse-transition :show="mintChoice !== 'core'">
        <n-input-group>
          <n-input-group-label>Your eSpace Address</n-input-group-label>
          <n-input clearable v-model:value="evmOwnerInput" placeholder="evm owner" />
          <n-button round secondary type="warning"  @click="useMetamaskAccount">
            <template #icon>
              <n-icon>
                <MetaMaskIcon />
              </n-icon>
            </template>
            Use eSpace Address
          </n-button>
          <!-- <n-button secondary type="warning">use empty evm address</n-button> -->
        </n-input-group>
      </n-collapse-transition>

      <n-space vertical>
        <n-radio-group v-model:value="authChoice" name="authChoiceGroup">
          <n-radio
            key="crowdin"
            value="crowdin"
            label="Crowdin Authorization"
          />
          <n-radio
            key="github"
            value="github"
            label="Github Authorization"
          />
        </n-radio-group>
        <n-button v-if="!code" type="info" @click="authorize">
          <template #icon>
            <LogoGithub v-if="authChoice==='github'"  />
            <CrowdinIcon v-else />
          </template>
          one-shot authorize
        </n-button>
        <n-button v-if="pendingAuthorization" @click="refreshCode">
          <template #icon>
            <Renew />
          </template>
          refreshCode
        </n-button>
        <n-button v-if="!!code" type="success" :disabled="isMint" @click="doMint">
          doMint
        </n-button>
      </n-space>
    </n-space>
    <a v-if="txHash" target="_blank" :href="scanTxUrl">{{ txHash }}</a>
  </n-card>
</template>

<script setup lang="ts">
import {
  NButton,
  NInput,
  NInputNumber,
  NIcon,
  NCard,
  NSpace,
  NInputGroup,
  NInputGroupLabel,
  NRadio,
  NRadioGroup,
  NCollapseTransition,
  useNotification
} from "naive-ui";
import { LogoGithub, Renew } from "@vicons/carbon";
import { useAccount as useCfxAccount } from "@cfxjs/use-wallet-vue3/conflux";
import { useAccount as useEthAccount } from "@cfxjs/use-wallet-vue3/ethereum";
import { format } from "js-conflux-sdk"
import Axios from "axios";

const cfxAccount = useCfxAccount()
const ethAccount = useEthAccount()
const notification = useNotification()
const authChoice = ref("crowdin" as "crowdin" | "github")

function useFluentAccount() {
  if (cfxAccount.value)
    coreOwnerInput.value = cfxAccount.value
  else {
    notification.error({ content: "cannot get fluent account" })
  }
}

function useMetamaskAccount() {
  if (ethAccount.value)
    evmOwnerInput.value = format.checksumAddress(ethAccount.value)
  else {
    notification.error({ content: "cannot get metamask account" })
  }
}

const mintChoice = ref("core" as "core" | "evm" | "both");
const mintOptions = [
  {
    value: "core",
    label: "Mint to Core Space",
  },
  {
    value: "evm",
    label: "Mint to eSpace",
  },
  {
    value: "both",
    label: "Mint to Dual Space",
  },
];

onMounted(() => {
  // poll localstorage status
  window.setInterval(() => refreshCode(), 300);
});

const runtimeConfig = useRuntimeConfig();

const batchNbr = ref(20484047);
const coreOwnerInput = ref("");
const coreOwnerAddress = computed(()=>{
  if (mintChoice.value === 'evm') {
    return runtimeConfig.public.coreContractAddress
  }
  return coreOwnerInput.value
})
const evmOwnerInput = ref("")
const evmOwnerAddress = computed(()=>{
  if (mintChoice.value === 'core') {
    return format.checksumAddress(runtimeConfig.public.evmContractAddress)
  }
  return evmOwnerInput.value
})

const code = ref("" as string | null);
const pendingAuthorization = ref(false);

const txHash = ref("");
const scanTxUrl = computed(() => {
  return `https://testnet.confluxscan.io/transaction/${txHash.value}`;
});

watch(mintChoice, () => {
  switch (mintChoice.value) { 
    case "core":
      evmOwnerInput.value = ""
      return
    case "evm":
      coreOwnerInput.value = ""
      return
  }
})

// pendingAuthorization is not !code
// click authorize => pendingAuthorization set to true
// code value got => pendingAuthorization set to false
function refreshCode() {
  code.value = localStorage.getItem("code");
  if (code.value) {
    pendingAuthorization.value = false;
  }
}

function authorize() {
  openAuthorizationWindow();
}

function openAuthorizationWindow() {
  // TODO: state should be unguessable
  const state = new Date().getTime();
  localStorage.setItem("state", state.toString());
  localStorage.setItem("authChoice", authChoice.value);
  let url: string
  switch (authChoice.value) {
    case "github":
      url = `https://github.com/login/oauth/authorize?client_id=${runtimeConfig.public.clientId}&redirect_uri=${runtimeConfig.public.redirectUri}&state=${state}`;
      break;
    case "crowdin":
      url =`https://accounts.crowdin.com/oauth/authorize?client_id=${runtimeConfig.public.crowdinClientId}&redirect_uri=${runtimeConfig.public.crowdinRedirectUri}&state=${state}&scope=project.status&response_type=code`;
  }
  window.open(url, "_blank", "popup,width=480,height=640");
  pendingAuthorization.value = true;
}

const isMint = ref(false)

async function doMint() {
  try {
    isMint.value = true
    const { username, signature } = await visitOracle();

    txHash.value = await doMintFromCoreRandom(
      batchNbr.value,
      username,
      coreOwnerAddress.value,
      evmOwnerAddress.value,
      signature.v,
      signature.r,
      signature.s
    );
  } catch (e: any) {
    isMint.value = false
    console.trace(e);
    notification.error({ content: e.message });
    if (e?.response?.data?.detail)
      notification.error({ content: e.response.data.detail });
  }
}

async function visitOracle() {
  const state = localStorage.getItem("state");
  const code = localStorage.getItem("code");
  const choice = localStorage.getItem("authChoice")
  if (choice !== authChoice.value) {
    throw new Error("Current choice does not match authorization, please select ${choice}")
  }
  try {
    const response = await Axios.request({
      url: `${runtimeConfig.public.oracleUrl}/sign/${choice}/${state}`,
      method: "POST",
      data: {
        batch_nbr: batchNbr.value,
        core_address: coreOwnerAddress.value,
        evm_address: evmOwnerAddress.value,
        code,
      },
    });
    console.log(response);
    console.log(response.data);
    return response.data as {
      signature: {
        v: number;
        r: string;
        s: string;
      };
      username: string;
    };
  } catch (e: any) {
    window.alert(e?.response?.data?.detail);
    throw e;
  } finally {
    localStorage.removeItem("state");
    localStorage.removeItem("code");
    localStorage.removeItem("authChoice")
    refreshCode();
  }
}
</script>
