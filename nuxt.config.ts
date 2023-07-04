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
      coreScanApiUrl: "",
      coreNetworkId: "",
      coreNetworkName: "",
      evmUrl: "",
      evmScanUrl: "",
      evmScanApiUrl: "",
      evmNetworkId: "",
      evmNetworkName: "",
      coreContractName: "",
      coreContractVersion: "",
    },
  },
});
