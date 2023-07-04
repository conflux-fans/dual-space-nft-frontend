import { Conflux, PrivateKeyAccount, format } from "js-conflux-sdk";
// @ts-ignore
import { Contract } from "js-conflux-sdk/src/contract";
import { abi } from "@/assets/metadata/DualSpaceNFTCore.json";

const runtimeConfig = useRuntimeConfig();

const coreSdk = new Conflux({
  url: runtimeConfig.public.coreUrl,
  networkId: Number(runtimeConfig.public.coreNetworkId), // Note: network is required
  logger: console, // for debug
});

const randomCoreSender: PrivateKeyAccount = coreSdk.wallet.addRandom();

const coreContract: Contract = coreSdk.Contract({
  abi,
  address: runtimeConfig.public.coreContractAddress,
});

async function doMintFromCoreRandom(
  batchNbr: number,
  username: string,
  coreOwnerAddress: string,
  evmOwnerAddress: string,
  v: number,
  r: string,
  s: string
): Promise<string> {
  return await coreContract
    .mint(batchNbr, username, coreOwnerAddress, evmOwnerAddress, [v, r, s])
    .sendTransaction({
      from: randomCoreSender.address,
    });
}

async function getMetatransactionNonce(evmAddress: string) {
  return await coreContract.getMetatransactionNonce(evmAddress).call();
}

async function constructMetatransaction(
  evmAddress: string,
  tokenId: number,
  newCoreOwnerAddress: string
) {
  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      EvmMetatransaction: [
        { name: "metatransactionNonce", type: "uint256" },
        { name: "tokenId", type: "uint256" },
        { name: "newCoreOwner", type: "address" },
      ],
    },
    primaryType: "EvmMetatransaction",
    domain: {
      name: runtimeConfig.public.coreContractName,
      version: runtimeConfig.public.coreContractVersion,
      chainId: Number(runtimeConfig.public.evmNetworkId),
      verifyingContract: format.hexAddress(
        runtimeConfig.public.coreContractAddress
      ),
    },
    message: {
      metatransactionNonce: await getMetatransactionNonce(evmAddress),
      tokenId,
      newCoreOwner: newCoreOwnerAddress,
    },
  };
}

async function setCoreOwnerUsingMetatransaction(
  evmOwnerAddress: string,
  tokenId: number,
  newCoreOwnerAddress: string,
  signature: string
) {
  return await coreContract
    .setCoreOwner(evmOwnerAddress, tokenId, newCoreOwnerAddress, signature)
    .sendTransaction({
      from: randomCoreSender.address,
    });
}

const useCoreSdk = () => useState<Conflux>("coreSdk", () => coreSdk);
const useRandomCoreSender = () =>
  useState<PrivateKeyAccount>("randomCoreSender", () => randomCoreSender);

export {
  useCoreSdk,
  useRandomCoreSender,
  doMintFromCoreRandom,
  constructMetatransaction,
  setCoreOwnerUsingMetatransaction,
};
