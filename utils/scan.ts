
function scanUrl(space: "core" | "evm", typ: "transaction" | "address", id: string) {
  let baseUrl: string
  switch (space) {
    case "core":
      baseUrl = "https://testnet.confluxscan.io"
      break
    case "evm":
      baseUrl = "https://evmtestnet.confluxscan.io";
      break
  }
  console.log(baseUrl)
  return `${baseUrl}/${typ}/${id}`
}

export {
  scanUrl
}
