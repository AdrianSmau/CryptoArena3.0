export const shorten_address = (address) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
