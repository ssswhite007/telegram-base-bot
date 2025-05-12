import { ethers } from 'ethers';
import { getOrCreateUserWallet } from './wallet';
import dotenv from 'dotenv';
dotenv.config();

const RPC = new ethers.JsonRpcProvider(process.env.RPC_URL);
const ROUTER_ADDRESS = '0xRouterAddress'; // UniswapV2/3 router on Base
const ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
] as const satisfies ethers.InterfaceAbi;

export async function handleSwap(userId: string, tokenAddress: string, amountInEth: string) {
  const wallet = await getOrCreateUserWallet(userId);
  const signer = wallet.connect(RPC);

  const router = new ethers.Contract(ROUTER_ADDRESS, ABI, signer);
  const amount = ethers.parseEther(amountInEth);
  const fee = amount / 100n; // 1%
  const amountAfterFee = amount - fee;

  const tx = await signer.sendTransaction({
    to: process.env.OWNER_WALLET,
    value: fee
  });

  const swapTx = await router.swapExactETHForTokens(
    0,
    [ethers.ZeroAddress, tokenAddress],
    wallet.address,
    Math.floor(Date.now() / 1000) + 60 * 10,
    { value: amountAfterFee }
  );

  return swapTx.hash;
}
