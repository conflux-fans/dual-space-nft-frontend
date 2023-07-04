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
      coreNetworkId: "",
      evmNetworkId: "",
      coreContractName: "",
      coreContractVersion: "",
    },
  },
});
