import { Conflux, PrivateKeyAccount } from "js-conflux-sdk";
// @ts-ignore
import { Account } from "js-conflux-sdk/src/wallet";

const coreSdk = new Conflux({
  url: "https://test.confluxrpc.com",
  networkId: 1, // Note: network is required
  logger: console, // for debug
});

const randomCoreSender = coreSdk.wallet.addRandom();

export const useCoreSdk = () => useState<Conflux>("coreSdk", () => coreSdk);
export const useRandomCoreSender = () =>
  useState<PrivateKeyAccount>("randomCoreSender", () => randomCoreSender);
