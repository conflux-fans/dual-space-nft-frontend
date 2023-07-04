import axios from 'axios'

function baseScanUrl(space: "core" | "evm") {
  const runtimeConfig = useRuntimeConfig();
  switch (space) {
    case "core":
      return runtimeConfig.public.coreScanUrl;
    case "evm":
      return runtimeConfig.public.evmScanUrl;
  }
}

function baseScanApiUrl(space: "core" | "evm") {
  const runtimeConfig = useRuntimeConfig();
  switch (space) {
    case "core":
      return runtimeConfig.public.coreScanApiUrl;
    case "evm":
      return runtimeConfig.public.evmScanApiUrl;
  }
}

function scanUrl(
  space: "core" | "evm",
  typ: "transaction" | "address",
  id: string
) {
  const baseUrl: string = baseScanUrl(space)
  return `${baseUrl}/${typ}/${id}`;
}

function nftUrl(
  space: "core" | "evm",
  contractAddress: string,
  id: string
) {
  const baseUrl: string = baseScanUrl(space);
  return `${baseUrl}/nft/${contractAddress}/${id}`
}

async function queryNfts(space: "core" | "evm", owner: string): Promise<{
  tokenId: string,
  contract: string
}[]> {
  const apiUrl: string = baseScanApiUrl(space);
  const runtimeConfig = useRuntimeConfig();
  const res = await axios.get(`${apiUrl}/nft/tokens`, {
    headers: {
      accept: "application/json",
    },
    params: {
      contract: space === "evm" ? runtimeConfig.public.evmContractAddress: runtimeConfig.public.coreContractAddress,
      owner,
      // sort: "DESC",
      // sortField: "latest_update_time",
      // cursor: 0,
      // skip: 0,
      limit: 100,
      // withBrief: false,
      // withMetadata: false,
    },
  });
  console.log(res.data)
  return res.data.result.list
}

export { scanUrl, nftUrl, queryNfts };
