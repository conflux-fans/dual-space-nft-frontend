<template>
  <n-card title="mint" size="medium" hoverable>
    <template #header-extra>
      mint poap if you had permission
    </template>
    <!-- TODO: add verification here -->
    <n-space vertical>
      <n-input-group>
        <n-input-group-label>Batch Number</n-input-group-label>
        <n-input-number v-model:value="batchNbr" placeholder="batch number" :step="100" />
      </n-input-group>
      <n-input-group>
        <n-input-group-label>Your Core Address</n-input-group-label>
        <n-input v-model:value="coreOwnerAddress" placeholder="core owner" />
        <n-button secondary type="info">use fluent address</n-button>
        <n-button secondary type="warning">use empty core address</n-button>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>Your eSpace Address</n-input-group-label>
        <n-input v-model:value="evmOwnerAddress" placeholder="evm owner" />
        <n-button secondary type="info">use metamask address</n-button>
        <n-button secondary type="warning">use empty evm address</n-button>
      </n-input-group>

      <n-space>
        <n-button v-if="!code" type="info" @click="authorize">
          <template #icon>
            <LogoGithub />
          </template>
          one-shot authorize
        </n-button>
        <n-button v-if="pendingAuthorization" @click="refreshCode">
          <template #icon>
            <Renew />
          </template>
          refreshCode
        </n-button>
        <n-button v-if="!!code" type="success" @click="doMint">
          doMint
        </n-button>
      </n-space>
    </n-space>
    <a v-if="txHash" target="_blank" :href="scanTxUrl">{{ txHash }}</a>
  </n-card>
</template>

<script setup lang="ts">
import { NButton, NInput, NInputNumber, NCard, NSpace, NInputGroup, NInputGroupLabel } from "naive-ui";
import { LogoGithub, Renew } from "@vicons/carbon";
import Axios from "axios";
import { abi } from "@/assets/metadata/DualSpaceNFTCore.json";

onMounted(() => {
  // poll localstorage status
  window.setInterval(() => refreshCode(), 300)
})

const batchNbr = ref(20896286)
const coreOwnerAddress = ref("cfx:aanhtnrex2nj56kkbws4yx0jeab34ae16pjn9n92xx")
const evmOwnerAddress = ref("0x4677ADa49E168df1290C9daA4EC820039D0097E3")

const conflux = useCoreSdk()

const randomSender = useRandomCoreSender()

const code = ref("" as string | null);
const pendingAuthorization = ref(false);

const txHash = ref("")
const scanTxUrl = computed(() => {
  return `https://testnet.confluxscan.io/transaction/${txHash.value}`
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

async function doMint() {
  try {
    const { username, signature } = await visitOracle()
    const coreContract = conflux.value.Contract({
      abi,
      address: "CFXTEST:TYPE.CONTRACT:ACHGW6Y86K619AWAYY47C20PNTDB0Y3PDYJHA6BXRX"
    })
    // mint(uint128 batchNbr, string memory username, address ownerCoreAddress, bytes20 ownerEvmAddress, Signature memory oracleSignature)
    txHash.value = await coreContract.mint(
      batchNbr.value, username, coreOwnerAddress.value, evmOwnerAddress.value, [signature.v, signature.r, signature.s]
    ).sendTransaction({
      from: randomSender.value.address
    })
  } catch (e) {
    console.trace(e)
    window.alert(e)
  }
}

async function visitOracle() {
  const state = localStorage.getItem("state");
  const code = localStorage.getItem("code");
  try {
    const response = await Axios.request({
      url: `http://localhost:8000/sign/${state}`,
      method: "POST",
      data: {
        batch_nbr: batchNbr.value,
        core_address: coreOwnerAddress.value,
        evm_address: evmOwnerAddress.value,
        code,
      },
    });
    console.log(response)
    console.log(response.data);
    return response.data as {
      signature: {
        v: number,
        r: string,
        s: string,
      },
      username: string
    }
  }
  catch (e: any) {
    window.alert(e?.response?.data?.detail)
    throw e
  }
  finally {
    localStorage.removeItem("state");
    localStorage.removeItem("code");
    refreshCode();
  }
}

</script>
