// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [],
  runtimeConfig: {
    public: {
      clientId: "",
      coreContractAddress: "",
      evmContractAddress: "",
      coreUrl: "",
      coreScanUrl: "",
      coreNetworkId: "",
      coreNetworkName: "",
      evmUrl: "",
      evmScanUrl: "",
      evmNetworkId: "",
      evmNetworkName: "",
      coreContractName: "",
      coreContractVersion: "",
    },
  },
});
