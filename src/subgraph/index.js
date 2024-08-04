export const GET_BURNED = `
  query GetTransfers($tokenIds: [BigInt!]) {
    transfers(where: { to: "0x0000000000000000000000000000000000000000", tokenId_in: $tokenIds }, first: 10000) {
      tokenId
    }
  }
`;
