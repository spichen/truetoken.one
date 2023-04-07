import { BigNumber } from "ethers";
import { TrueToken } from "~~/types/truetoken";

const getTokenFromContractResponse: (
  rawTokens: readonly {
    id: BigNumber;
    owner: string;
    metadataCID: string;
    logCIDs: readonly string[];
  }[],
) => TrueToken[] = rawTokens => {
  return rawTokens.map((tok: any) => ({
    id: tok[0].toString(),
    owner: tok[1],
    uri: tok[2],
    logs: [],
  }));
};

export default getTokenFromContractResponse;
