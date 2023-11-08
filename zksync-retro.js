// imports
const { Wallet, Provider, utils } = require("zksync-web3");
const ethers = require("ethers");

const MuteioABI = require("./zkSyncABI/MuteioABI.json");
const SpacefiABI = require("./zkSyncABI/SpacefiABI.json");
const VelocoreABI = require("./zkSyncABI/VelocoreABI.json");
const zkSyncBridge = require("./zkSyncABI/zkSyncBridge.json");
const ERC20ABI = require("./zkSyncABI/ERC20ABI.json");

const FactoryMuteIoABI = require("./zkSyncABI/FactoryMuteIoABI.json");
const FactoryABI = require("./zkSyncABI/FactoryABI.json");

// for provider
const ethereumProvider = new Provider("https://rpc.ankr.com/eth"); // interface
const zkSyncProvider = new Provider("https://mainnet.era.zksync.io"); // interface
const arbitrumProvider = new Provider("https://arb1.croswap.com/rpc");
const auroraProvider = new Provider("https://mainnet.aurora.dev");
const avalancheProvider = new Provider("https://avalanche.public-rpc.com");
const bscProvider = new Provider("https://bsc-mainnet.public.blastapi.io");
const fantomProvider = new Provider("https://fantom.publicnode.com");
const gnosisProvider = new Provider("https://rpc.ankr.com/gnosis");
const polygonProvider = new Provider("https://polygon.llamarpc.com");
const optimismProvider = new Provider("https://endpoints.omniatech.io/v1/op/mainnet/public");

const  globalTunnel  = require("global-tunnel-ng");
const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // SOCKET PUBLIC API KEY


const { Alchemy, Network, AlchemySubscription } = require("alchemy-sdk");
// const useStore = require("../app/model");
const bigInt = require('big-integer');

// const store = useStore.store

const ADDRESS_ZERO = ethers.constants.AddressZero;

// token's address
const WETH = "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91";
const USDC = "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4";
const BUSD = "0x2039bb4116B4EFc145Ec4f0e2eA75012D6C0f181";
const MVX = "0xC8Ac6191CDc9c7bF846AD6b52aaAA7a0757eE305";
const MUTE = "0x0e97C7a0F8B2C9885C8ac9fC6136e829CbC21d42";
const SPACE = "0x47260090cE5e83454d5f05A0AbbB2C953835f777";

const oneDayInMiliseconds = "86_400_000";
const twoDayInMiliseconds = "172_800_000";
const threeDayInMiliseconds = "259_200_000";
const fourDayInMiliseconds = "345_600_000";

const addLiquidityIdSwaps = [1, 2, 4, 5];

// Pool ids
const muteioPoolId = [1, 2, 4];
const spacefiPoolId = [1, 5];
const velocorePoolId = [1, 4];

// router
const muteio = "0x8B791913eB07C32779a16750e3868aA8495F5964";
const spacefi = "0xbE7D1FD1f6748bbDefC4fbaCafBb11C6Fc506d1d";
const velocore = "0xB2CEF7f2eCF1f4f0154D129C6e111d81f68e6d03";
const zkBridge = "0x32400084C286CF3E17e7B677ea9583e60a000324";

let bungeeBridgeAmountMin = "10"; // мин деп в зк синк с любой сети
let bungeeBridgeAmountMax = "20";

let bungeeBridgeWithdrawAmountMin = "0.003"; // мин деп в любую сеть с зк синк
let bungeeBridgeWithdrawAmountMax = "0.005";

let zkSyncEraBridge = true; // true //false делать бридж зк синк ера или нет
let zkSyncEraBridgeWithdraw = true; // true или false, делать в конце круга вывод через мост zkSync в Eth
let bungeeBridgeInZkSyncEra = true; // true или false, делать бридж из любой сети в зк или нет
let bungeeBridgeInOtherNetwork = true; // true или false, делать вывод с зк синк в любую сеть или нет


// networks for bungee

const networksRefuel = {
  ArbitrumOne: "0xc0E02AA55d10e38855e13B64A8E1387A04681A00",
  Aurora: "0x2b42AFFD4b7C14d9B7C2579229495c052672Ccd3",
  Avalanche: "0x040993fbF458b95871Cd2D73Ee2E09F4AF6d56bB",
  BinanceSmartChain: "0xBE51D38547992293c89CC589105784ab60b004A9",
  Ethereum: "0xb584D4bE1A5470CA1a8778E9B86c81e165204599",
  Fantom: "0x040993fbF458b95871Cd2D73Ee2E09F4AF6d56bB",
  GnosisChain: "0xBE51D38547992293c89CC589105784ab60b004A9",
  Optimism: "0x5800249621DA520aDFdCa16da20d8A5Fc0f814d8",
  Polygon: "0xAC313d7491910516E06FBfC2A0b5BB49bb072D91",
  zkSyncEra: "0x7Ee459D7fDe8b4a3C22b9c8C7aa52AbadDd9fFD5"
};

const refuelABI = require("./zkSyncABI/RefuelABI.json");

// Token Decimals
async function decimals(tokenAddress) {
  var signer = new ethers.Wallet(store.privateKeys[0], zkSyncProvider);
  const Token = new ethers.Contract(tokenAddress, ERC20ABI, signer); // Write only
  const result = await Token.decimals();
  return result;
}

// gasPrice Ethereum/zkSync
async function getGasPriceEthereum() {
  const gasPrice = await ethereumProvider.getGasPrice();
  return gasPrice;
}

async function getGasPricezkSync() {
  const gasPrice = await zkSyncProvider.getGasPrice();
  return gasPrice;
}

// random time
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// random amount
function randomBN(max) {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32)).mod(max);
}

const platforms = {
  muteio: "muteio", // 0
  spacefi: "spacefi", // 1
  velocore: "velocore", // 2
};

async function auto(tokenIn, signer) {
  const Token = new ethers.Contract(tokenIn, ERC20ABI, signer); // Write only
  const balance = await Token.balanceOf(signer.address);
  const randomAmountIn = randomBN(balance);
  return randomAmountIn;
}

async function percentageOfTheEtherBalance(SignerWithAddress, percent) {
  const balance = await SignerWithAddress.getBalance();

  const amount = ethers.BigNumber.from(balance)
    .mul(ethers.BigNumber.from(percent))
    .div(100)
    .toString();
  return amount;
}

async function getPrivateKey(to) {
  for (let i = 0; i < store.privateKeys.length; i++) {
    var signer = new ethers.Wallet(store.privateKeys[i], ethereumProvider);

    if (signer.address.toLowerCase() == to.toLowerCase()) {
      return store.privateKeys[i];
    }
  }
}

function getRandomBigNumber(min, max) {
  const range = max.sub(min).add(1);
  const randomNumber = ethers.BigNumber.from(bigInt.randBetween(bigInt.zero, range.toBigInt()).toString()).add(min);
  return randomNumber.toString();
}

async function balanceOf(token, signer) {
  const Token = new ethers.Contract(token, ERC20ABI, signer); // Write only
  const balance = await Token.balanceOf(signer.address);
  return balance;
}

async function getBridgeStatus(transactionHash, fromChainId, toChainId) {
  const response = await fetch(`https://api.socket.tech/v2/bridge-status?transactionHash=${transactionHash}&fromChainId=${fromChainId}&toChainId=${toChainId}`, {
      method: 'GET',
      headers: {
          'API-KEY': API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  });

  const json = await response.json();
  return json;
}

//

async function l2TransactionBaseCost(recipient) {
  const key = await getPrivateKey(recipient);
  const zkSyncWallet = new Wallet(key, zkSyncProvider, ethereumProvider);

  const result = await zkSyncWallet.getDepositTx({
    token: utils.ETH_ADDRESS,
    amount: 1,
  });
  return result.overrides.value.mul(12).div(10);
}

async function baseCost(recipient) {
  const key = await getPrivateKey(recipient);
  const eth_signer = new ethers.Wallet(key, ethereumProvider);

  const basecost = await l2TransactionBaseCost(recipient);
  const balance = await percentageOfTheEtherBalance(eth_signer, 100);
  const gasPrice = await ethereumProvider.getGasPrice();

  const result = ethers.BigNumber.from(balance)
    .sub(ethers.BigNumber.from(basecost))
    .sub(ethers.BigNumber.from(150_000).mul(gasPrice));

  return result;
}

const precompile = require("./zkSyncABI/precompileZk.json");

async function getGasLimitL2(recipient) {
  const key = await getPrivateKey(recipient);
  const zkSyncWallet = new Wallet(key, zkSyncProvider, ethereumProvider);

  const contract = new ethers.Contract("0x000000000000000000000000000000000000800A", precompile, zkSyncWallet); // Write only

  const gasLimitL2 = await contract.estimateGas.withdraw(recipient, {value: 1});
  return gasLimitL2;
}

async function maxWithdrawalAmountFromL2(recipient) {
  const key = await getPrivateKey(recipient);
  const zkSync_signer = new ethers.Wallet(key, zkSyncProvider);

  const balance = await percentageOfTheEtherBalance(zkSync_signer, 100);

  const gasLimitL2 = await getGasLimitL2(recipient);
  const gasPrice = await zkSyncProvider.getGasPrice();

  const costs = gasLimitL2.mul(gasPrice).mul(12).div(10);

  return ethers.BigNumber.from(balance).sub(costs);
}

async function bridgeETHtoZkSync(recipient, bridgeAmount, gasLimit) {
  console.log(`Running script to deposit ETH in L2`);

  const key = await getPrivateKey(recipient);
  const zkSyncWallet = new Wallet(key, zkSyncProvider, ethereumProvider);

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await ethereumProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice <= gasLimit) {
      await new Promise((r) =>
          setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const deposit = await zkSyncWallet.deposit({
          token: utils.ETH_ADDRESS,
          amount: bridgeAmount,
          overrides: { gasLimit: 150_000, gasPrice: gasPrice },
        });
        await deposit.wait();
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }

      txCompleted++;
      break;
    }
  }
}

async function bridgeZkSynctoETH(recipient, bridgeAmount, gasLimit) {
  console.log(`Running script to withdraw ETH in L2`);

  const key = await getPrivateKey(recipient);
  const zkSyncWallet = new Wallet(key, zkSyncProvider, ethereumProvider);

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await ethereumProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice <= gasLimit) {
      await new Promise((r) =>
          setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const withdrawL2 = await zkSyncWallet.withdraw({
          token: utils.ETH_ADDRESS,
          amount: bridgeAmount,
        });
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }

      txCompleted++;
      break;
    }
  }
}

let bungeeAmountMin = 10;
let bungeeAmountMax = 20;

let transferNetwork = networksRefuel.Optimism;
let withdrawNetwork = networksRefuel.Aurora;
let useAproxy = false;

async function bungeeBridgeDeposit(network, privateKey) {
  await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
  switch(network) {
    case networksRefuel.ArbitrumOne:
      const arbitrumone_signer = new ethers.Wallet(privateKey, arbitrumProvider);
      const refuelArbitrumOne = new ethers.Contract(networksRefuel.ArbitrumOne, refuelABI, arbitrumone_signer);
      
      const arbitrumAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const arbitrumAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const arbitrumRandomAmount = getRandomBigNumber(arbitrumAmountMin, arbitrumAmountMax);

      const txArbitrum = await refuelArbitrumOne.depositNativeToken(324, arbitrumone_signer.address, {value: arbitrumRandomAmount});
      await txArbitrum.wait();

      const txHashArbitrum = txArbitrum.transactionHash;

      const txStatusArbitrum = setInterval(async () => {
        const status = await getBridgeStatus(txHashArbitrum, 42161, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusArbitrum);
        }
    }, 20000);
    case networksRefuel.Aurora:
      const aurora_signer = new ethers.Wallet(privateKey, auroraProvider);
      const refuelAurora = new ethers.Contract(networksRefuel.Aurora, refuelABI, aurora_signer); 

      const auroraAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const auroraAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const auroraRandomAmount = getRandomBigNumber(auroraAmountMin, auroraAmountMax);

      const txAurora = await refuelAurora.depositNativeToken(324, aurora_signer.address, {value: auroraRandomAmount});
      await txAurora.wait();

      const txHashAurora = txAurora.transactionHash;

      const txStatusAurora = setInterval(async () => {
        const status = await getBridgeStatus(txHashAurora, 1313161554, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusAurora);
        }
    }, 20000);
    case networksRefuel.Avalanche:
      const avalanche_signer = new ethers.Wallet(privateKey, avalancheProvider);
      const refuelAvalanche = new ethers.Contract(networksRefuel.Avalanche, refuelABI, avalanche_signer); 

      const avalancheAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const avalancheAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const avalancheRandomAmount = getRandomBigNumber(avalancheAmountMin, avalancheAmountMax);

      const txAvalanche = await refuelAvalanche.depositNativeToken(324, avalanche_signer.address, {value: avalancheRandomAmount});
      await txAvalanche.wait();

      const txHashAvalanche = txAvalanche.transactionHash;

      const txStatusAvalanche = setInterval(async () => {
        const status = await getBridgeStatus(txHashAvalanche, 43114, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusAvalanche);
        }
    }, 20000);
    case networksRefuel.BinanceSmartChain:
      const bsc_signer = new ethers.Wallet(privateKey, bscProvider);
      const refuelBsc = new ethers.Contract(networksRefuel.BinanceSmartChain, refuelABI, bsc_signer);

      const bscAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const bscAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const bscRandomAmount = getRandomBigNumber(bscAmountMin, bscAmountMax);
      
      const txBsc = await refuelBsc.depositNativeToken(324, bsc_signer.address, {value: bscRandomAmount});
      await txBsc.wait();

      const txHashBsc = txBsc.transactionHash;

      const txStatusBsc = setInterval(async () => {
        const status = await getBridgeStatus(txHashBsc, 56, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusBsc);
        }
    }, 20000);
    case networksRefuel.Ethereum:
      const ethereum_signer = new ethers.Wallet(privateKey, ethereumProvider);
      const refuelEthereum = new ethers.Contract(networksRefuel.Ethereum, refuelABI, ethereum_signer);

      const ethereumAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const ethereumAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const ethereumRandomAmount = getRandomBigNumber(ethereumAmountMin, ethereumAmountMax);
      
      const txEthereum = await refuelEthereum.depositNativeToken(324, ethereum_signer.address, {value: ethereumRandomAmount});
      await txEthereum.wait();

      const txHashEthereum = txEthereum.transactionHash;

      const txStatusEthereum = setInterval(async () => {
        const status = await getBridgeStatus(txHashEthereum, 1, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusEthereum);
        }
    }, 20000);
    case networksRefuel.Fantom:
      const fantom_signer = new ethers.Wallet(privateKey, fantomProvider);
      const refuelFantom = new ethers.Contract(networksRefuel.Fantom, refuelABI, fantom_signer);
      
      const fantomAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const fantomAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const fantomRandomAmount = getRandomBigNumber(fantomAmountMin, fantomAmountMax);

      const txFantom = await refuelFantom.depositNativeToken(324, fantom_signer.address, {value: fantomRandomAmount});
      await txFantom.wait();

      const txHashFantom = txFantom.transactionHash;

      const txStatusFantom = setInterval(async () => {
        const status = await getBridgeStatus(txHashFantom, 250, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusFantom);
        }
    }, 20000);
    case networksRefuel.GnosisChain:
      const gnosis_signer = new ethers.Wallet(privateKey, gnosisProvider);
      const refuelGnosis = new ethers.Contract(networksRefuel.GnosisChain, refuelABI, gnosis_signer);

      const gnosisAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const gnosisAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const gnosisRandomAmount = getRandomBigNumber(gnosisAmountMin, gnosisAmountMax); 

      const txGnosis = await refuelGnosis.depositNativeToken(324, gnosis_signer.address, {value: gnosisRandomAmount});
      await txGnosis.wait();

      const txHashGnosis = txGnosis.transactionHash;

      const txStatusGnosis = setInterval(async () => {
        const status = await getBridgeStatus(txHashGnosis, 100, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusGnosis);
        }
    }, 20000);
    case networksRefuel.Optimism:
      const optimism_signer = new ethers.Wallet(privateKey, optimismProvider);
      const refuelOptimism = new ethers.Contract(networksRefuel.Optimism, refuelABI, optimism_signer);

      const optimismAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const optimismAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const optimismRandomAmount = getRandomBigNumber(optimismAmountMin, optimismAmountMax);
      
      const txOptimism = await refuelOptimism.depositNativeToken(324, optimism_signer.address, {value: optimismRandomAmount});
      await txOptimism.wait();

      const txHashOptimism = txOptimism.transactionHash;

      const txStatusOptimism = setInterval(async () => {
        const status = await getBridgeStatus(txHashOptimism, 10, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusOptimism);
        }
    }, 20000);
    case networksRefuel.Polygon:
      const polygon_signer = new ethers.Wallet(privateKey, polygonProvider);
      const refuelPolygon = new ethers.Contract(networksRefuel.Polygon, refuelABI, polygon_signer);

      const polygonAmountMin = ethers.utils.parseEther(bungeeBridgeAmountMin);
      const polygonAmountMax = ethers.utils.parseEther(bungeeBridgeAmountMax);
      const polygonRandomAmount = getRandomBigNumber(polygonAmountMin, polygonAmountMax);
      
      const txPolygon = await refuelPolygon.depositNativeToken(324, polygon_signer.address, {value: polygonRandomAmount});
      await txPolygon.wait();

      const txHashPolygon = txPolygon.transactionHash;

      const txStatusPolygon = setInterval(async () => {
        const status = await getBridgeStatus(txHashPolygon, 137, 324);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusPolygon);
        }
    }, 20000);
  }
}

async function bungeeBridgeWithdraw(network, privateKey) {
  await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
  const signer = new ethers.Wallet(privateKey, zkSyncProvider);
  const refuelzkSync = new ethers.Contract(networksRefuel.zkSyncEra, refuelABI, signer);

  switch(network) {
    case networksRefuel.ArbitrumOne:      
      const arbitrumAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      const arbitrumAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      const arbitrumRandomAmount = getRandomBigNumber(arbitrumAmountMin, arbitrumAmountMax);

      const txArbitrum = await refuelzkSync.depositNativeToken(42161, signer.address, {value: arbitrumRandomAmount});
      await txArbitrum.wait();

      const txHashArbitrum = txArbitrum.transactionHash;

      const txStatusArbitrum = setInterval(async () => {
        const status = await getBridgeStatus(txHashArbitrum, 324, 42161);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusArbitrum);
        }
    }, 20000);
    case networksRefuel.Aurora:
      const auroraAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      const auroraAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      const auroraRandomAmount = getRandomBigNumber(auroraAmountMin, auroraAmountMax);

      const txAurora = await refuelzkSync.depositNativeToken(1313161554, signer.address, {value: auroraRandomAmount});
      await txAurora.wait();

      const txHashAurora = txAurora.transactionHash;

      const txStatusAurora = setInterval(async () => {
        const status = await getBridgeStatus(txHashAurora, 324, 1313161554);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusAurora);
        }
    }, 20000);
    case networksRefuel.Avalanche:
      const avalancheAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      const avalancheAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      const avalancheRandomAmount = getRandomBigNumber(avalancheAmountMin, avalancheAmountMax);

      const txAvalanche = await refuelzkSync.depositNativeToken(43114, signer.address, {value: avalancheRandomAmount});
      await txAvalanche.wait();

      const txHashAvalanche = txAvalanche.transactionHash;

      const txStatusAvalanche = setInterval(async () => {
        const status = await getBridgeStatus(txHashAvalanche, 324, 43114);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusAvalanche);
        }
    }, 20000);
    case networksRefuel.BinanceSmartChain:
      const bscAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      const bscAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      const bscRandomAmount = getRandomBigNumber(bscAmountMin, bscAmountMax);
      
      const txBsc = await refuelzkSync.depositNativeToken(56, signer.address, {value: bscRandomAmount});
      await txBsc.wait();

      const txHashBsc = txBsc.transactionHash;

      const txStatusBsc = setInterval(async () => {
        const status = await getBridgeStatus(txHashBsc, 324, 56);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusBsc);
        }
    }, 20000);
    case networksRefuel.Fantom:      
      const fantomAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      const fantomAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      const fantomRandomAmount = getRandomBigNumber(fantomAmountMin, fantomAmountMax);

      const txFantom = await refuelzkSync.depositNativeToken(250, signer.address, {value: fantomRandomAmount});
      await txFantom.wait();

      const txHashFantom = txFantom.transactionHash;

      const txStatusFantom = setInterval(async () => {
        const status = await getBridgeStatus(txHashFantom, 324, 250);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusFantom);
        }
    }, 20000);
    case networksRefuel.GnosisChain:
      const gnosisAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      const gnosisAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      const gnosisRandomAmount = getRandomBigNumber(gnosisAmountMin, gnosisAmountMax); 

      const txGnosis = await refuelzkSync.depositNativeToken(100, signer.address, {value: gnosisRandomAmount});
      await txGnosis.wait();

      const txHashGnosis = txGnosis.transactionHash;

      const txStatusGnosis = setInterval(async () => {
        const status = await getBridgeStatus(txHashGnosis, 324, 100);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusGnosis);
        }
    }, 20000);
    case networksRefuel.Optimism:
      const optimismAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      console.log(optimismAmountMin);
      const optimismAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      console.log(optimismAmountMax);
      const optimismRandomAmount = getRandomBigNumber(optimismAmountMin, optimismAmountMax);
      
      console.log(optimismRandomAmount);
      
      const txOptimism = await refuelzkSync.depositNativeToken(10, signer.address, {value: optimismRandomAmount});
      await txOptimism.wait();

      const txHashOptimism = txOptimism.transactionHash;

      const txStatusOptimism = setInterval(async () => {
        const status = await getBridgeStatus(txHashOptimism, 324, 10);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusOptimism);
        }
    }, 20000);
    case networksRefuel.Polygon:
      const polygonAmountMin = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMin);
      const polygonAmountMax = ethers.utils.parseEther(bungeeBridgeWithdrawAmountMax);
      const polygonRandomAmount = getRandomBigNumber(polygonAmountMin, polygonAmountMax);
      
      const txPolygon = await refuelzkSync.depositNativeToken(137, signer.address, {value: polygonRandomAmount});
      await txPolygon.wait();

      const txHashPolygon = txPolygon.transactionHash;

      const txStatusPolygon = setInterval(async () => {
        const status = await getBridgeStatus(txHashPolygon, 324, 137);

        console.log(`SOURCE TX : ${status.result.sourceTxStatus}\nDEST TX : ${status.result.destinationTxStatus}`)

        if (status.result.destinationTxStatus == "COMPLETED") {
            console.log('DEST TX HASH :', status.result.destinationTransactionHash);
            clearInterval(txStatusPolygon);
        }
    }, 20000);
  }
}

// Pool id: 1
async function swapWETHtoUSDC(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap WETH to USDC`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, USDC],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${ethers.utils.formatEther(
          amountIn
        ).toString()} to USDC on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, USDC],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${ethers.utils.formatEther(
          amountIn
        ).toString()} to USDC on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, USDC],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${ethers.utils.formatEther(
          amountIn
        ).toString()} to USDC on the velocore platform`
      );
      break;
  }
}

async function swapUSDCtoWETH(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap USDC to WETH`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactTokensForETH(
        recipient,
        amountIn,
        [USDC, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap USDC in the amount of ${amountIn.toString()} to WETH on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactTokensForETH(
        recipient,
        amountIn,
        [USDC, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap USDC in the amount of ${amountIn.toString()} to WETH on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactTokensForETH(
        recipient,
        amountIn,
        [USDC, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap USDC in the amount of ${amountIn.toString()} to WETH on the velocore platform`
      );
      break;
  }
}

// Pool id: 2
async function swapWETHtoMUTE(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap WETH to MUTE`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactETHForTokens(
          recipient,
          amountIn,
          [WETH, MUTE],
          gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
          setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
          `Swap WETH in the amount of ${amountIn.toString()} to MUTE on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactETHForTokens(
          recipient,
          amountIn,
          [WETH, MUTE],
          gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
          setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
          `Swap WETH in the amount of ${amountIn.toString()} to MUTE on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactETHForTokens(
          recipient,
          amountIn,
          [WETH, MUTE],
          gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
          setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
          `Swap WETH in the amount of ${amountIn.toString()} to MUTE on the velocore platform`
      );
      break;
  }
}


async function swapMUTEtoWETH(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap MUTE to WETH`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactTokensForETH(
        recipient,
        amountIn,
        [MUTE, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap MUTE in the amount of ${amountIn.toString()} to WETH on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactTokensForETH(
        recipient,
        amountIn,
        [MUTE, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap MUTE in the amount of ${amountIn.toString()} to WETH on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactTokensForETH(
        recipient,
        amountIn,
        [MUTE, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap MUTE in the amount of ${amountIn.toString()} to WETH on the velocore platform`
      );
      break;
  }
}

// Pool id: 3
// async function swapMUTEtoUSDC(platform, amountIn, gasLimit) {

//   switch (platform) {
//     case platforms.muteio:
//       await muteIoSwap(ids, amountIn, 0 [MUTE, USDC], 9683908380, gasLimit);
//       break;
//     case platforms.spacefi:
//       await spaceFiSwap(ids, amountIn, 0, [MUTE, USDC], 9683908380, gasLimit);
//       break;
//     case platforms.velocore:
//       await velocoreSwap(ids, amountIn, 0, [MUTE, USDC], 9683908380, gasLimit);
//       break;
//   }
// }

// async function swapUSDCtoMUTE(platform, amountIn, gasLimit) {

//   switch (platform) {
//     case platforms.muteio:
//       await muteIoSwap(ids, amountIn, 0 [USDC, MUTE], 9683908380, gasLimit);
//       break;
//     case platforms.spacefi:
//       await spaceFiSwap(ids, amountIn, 0, [USDC, MUTE], 9683908380, gasLimit);
//       break;
//     case platforms.velocore:
//       await velocoreSwap(ids, amountIn, 0, [USDC, MUTE], 9683908380, gasLimit);
//       break;
//   }
// }

// Pool id: 4
async function swapWETHtoMVX(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap WETH to MVX`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, MVX],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${amountIn.toString()} to MVX on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, MVX],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${amountIn.toString()} to MVX on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, MVX],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${amountIn.toString()} to MVX on the velocore platform`
      );
      break;
  }
}

async function swapMVXtoWETH(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap MVX to WETH`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactTokensForETH(
        recipient,
        amountIn,
        [MVX, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap MVX in the amount of ${amountIn.toString()} to WETH on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactTokensForETH(
        recipient,
        amountIn,
        [MVX, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap MVX in the amount of ${amountIn.toString()} to WETH on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactTokensForETH(
        recipient,
        amountIn,
        [MVX, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap MVX in the amount of ${amountIn.toString()} to WETH on the velocore platform`
      );
      break;
  }
}

// Pool id: 5
async function swapWETHtoSPACE(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap WETH to SPACE`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, SPACE],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${amountIn.toString()} to SPACE on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, SPACE],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${amountIn.toString()} to SPACE on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactETHForTokens(
        recipient,
        amountIn,
        [WETH, SPACE],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap WETH in the amount of ${amountIn.toString()} to SPACE on the velocore platform`
      );
      break;
  }
}

async function swapSPACEtoWETH(platform, recipient, amountIn, gasLimit) {
  store.pushLoggerMessage(`Running script to swap SPACE to WETH`);

  switch (platform) {
    case platforms.muteio:
      await muteIoSwapExactTokensForETH(
        recipient,
        amountIn,
        [SPACE, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap SPACE in the amount of ${amountIn.toString()} to WETH on the muteio platform`
      );
      break;
    case platforms.spacefi:
      await spaceFiSwapExactTokensForETH(
        recipient,
        amountIn,
        [SPACE, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap SPACE in the amount of ${amountIn.toString()} to WETH on the spacefi platform`
      );
      break;
    case platforms.velocore:
      await velocoreSwapExactTokensForETH(
        recipient,
        amountIn,
        [SPACE, WETH],
        gasLimit
      );
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );

      store.pushLoggerMessage(
        `Swap SPACE in the amount of ${amountIn.toString()} to WETH on the velocore platform`
      );
      break;
  }
}

// Pool id: 6
// async function swapBUSDtoUSDC(platform, amountIn, gasLimit) {

//   switch (platform) {
//     case platforms.muteio:
//       await muteIoSwap(ids, amountIn, 0 [BUSD, USDC], 9683908380, gasLimit);
//       break;
//     case platforms.spacefi:
//       await spaceFiSwap(ids, amountIn, 0, [BUSD, USDC], 9683908380, gasLimit);
//       break;
//     case platforms.velocore:
//       await velocoreSwap(ids, amountIn, 0, [BUSD, USDC], 9683908380, gasLimit);
//       break;
//   }
// }

// async function swapUSDCtoBUSD(platform, amountIn, gasLimit) {

//   switch (platform) {
//     case platforms.muteio:
//       await muteIoSwap(ids, amountIn, 0 [USDC, BUSD], 9683908380, gasLimit);
//       break;
//     case platforms.spacefi:
//       await spaceFiSwap(ids, amountIn, 0, [USDC, BUSD], 9683908380, gasLimit);
//       break;
//     case platforms.velocore:
//       await velocoreSwap(ids, amountIn, 0, [USDC, BUSD], 9683908380, gasLimit);
//       break;
//   }
// }

async function spaceFiPools(signer, amountIn, gasLimit) {
  const randomIndex = Math.floor(Math.random() * spacefiPoolId.length);
  const pool = spacefiPoolId[randomIndex];

  // расчёт нужен amountIn

  switch (pool) {
    case 1:
      await swapWETHtoUSDC(
        platforms.spacefi,
        signer.address,
        amountIn,
        gasLimit
      );

      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
      const balanceInUSDC = await balanceOf(USDC, signer);

      await swapUSDCtoWETH(
        platforms.spacefi,
        signer.address,
        balanceInUSDC,
        gasLimit
      );
      break;
    case 5:
      await swapWETHtoSPACE(
        platforms.spacefi,
        signer.address,
        amountIn,
        gasLimit
      );

      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
      const balanceInSPACE = await balanceOf(SPACE, signer);

      await swapSPACEtoWETH(
        platforms.spacefi,
        signer.address,
        balanceInSPACE,
        gasLimit
      );
      break;
  }
}

async function muteIoPools(signer, amountIn, gasLimit) {
  const randomIndex = Math.floor(Math.random() * muteioPoolId.length);
  const pool = muteioPoolId[randomIndex];

  switch (pool) {
    case 1:
      await swapWETHtoUSDC(
        platforms.muteio,
        signer.address,
        amountIn,
        gasLimit
      );

      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
      const balanceInUSDC = await balanceOf(USDC, signer);

      await swapUSDCtoWETH(
        platforms.muteio,
        signer.address,
        balanceInUSDC,
        gasLimit
      );
      break;
    case 2:
      await swapWETHtoMUTE(
        platforms.muteio,
        signer.address,
        amountIn,
        gasLimit
      );

      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
      const balanceInMUTE = await balanceOf(MUTE, signer);

      await swapMUTEtoWETH(
        platforms.muteio,
        signer.address,
        balanceInMUTE,
        gasLimit
      );
      break;
    case 4:
      await swapWETHtoMVX(platforms.muteio, signer.address, amountIn, gasLimit);

      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
      const balanceInMVX = await balanceOf(MVX, signer);

      await swapMVXtoWETH(
        platforms.muteio,
        signer.address,
        balanceInMVX,
        gasLimit
      );
      break;
  }
}

async function velocorePools(signer, amountIn, gasLimit) {
  const randomIndex = Math.floor(Math.random() * velocorePoolId.length);
  const pool = velocorePoolId[randomIndex];

  switch (pool) {
    case 1:
      await swapWETHtoUSDC(
        platforms.velocore,
        signer.address,
        amountIn,
        gasLimit
      );

      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
      const balanceInUSDC = await balanceOf(USDC, signer);

      await swapUSDCtoWETH(
        platforms.velocore,
        signer.address,
        balanceInUSDC,
        gasLimit
      );
      break;
    case 4:
      await swapWETHtoMVX(
        platforms.velocore,
        signer.address,
        amountIn,
        gasLimit
      );

      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(60_000, 240_000))
      );
      const balanceInMVX = await balanceOf(MVX, signer);

      await swapMVXtoWETH(
        platforms.velocore,
        signer.address,
        balanceInMVX,
        gasLimit
      );
      break;
  }
}

// const proxies = [
//   {
//     host: string,
//     port: number
//   },
//   {
//     host: string,
//     port: number
//   }
// ];

async function script(gasLimitETH, gasLimitZkSync) {
  for (let i = 0; i < store.privateKey; i++) {
      
      if(useAproxy) {
        const proxyConfig = proxies[i];
        if(!proxyConfig) throw new Error('proxy not found');
        globalTunnel.initialize(proxyConfig);
      }
      
      scriptCore(store.privateKey[i], gasLimitETH, gasLimitZkSync);
  }
}

async function scriptCore(keys, gasLimitETH, gasLimitZkSync) {
        const key = keys;

        store.pushLoggerMessage(
          `Replenishment was found on the ${to.toString()} account, I start performing activities...`
        );

        const zkSync_signer = new ethers.Wallet(key, zkSyncProvider);
        const to = zkSync_signer.address;

        const numberOfSwaps = await getRandomIntInclusive(
          store.minCountSwaps,
          store.maxCountSwaps
        );

        // Step 1 Bridge ETH -> zkSync | ZkSync Bridge
        if(zkSyncEraBridge) {
          const bridgeAmount = await baseCost(to);

          store.pushLoggerMessage(
            `Transfer from the account ${to}, of ether in the amount of ${ethers.utils.formatEther(
              bridgeAmount
            )}, to the zkSync network`
          );

          await bridgeETHtoZkSync(to, bridgeAmount, gasLimitETH);

          store.pushLoggerMessage(`Delay before further execution...`);
          await new Promise((r) =>
            setTimeout(r, getRandomIntInclusive(300_000, 600_000))
          );
        }

        if(bungeeBridgeInZkSyncEra) {
          await bungeeBridgeDeposit(transferNetwork, key);
        }
        
        // Step 2 Swaps
        const amountForSwap = await percentageOfTheEtherBalance(
          zkSync_signer,
          store.percentageOfTheBalanceForOneSwap
        );
        store.pushLoggerMessage(
          `Account: ${to.toString()} - In the range from ${store.minCountSwaps.toString()} to ${store.maxCountSwaps.toString()}, a random number of swaps ${numberOfSwaps.toString()}`
        );
        store.pushLoggerMessage(
          `Account: ${to.toString()} - Start swaps with sum for 1st swap ${ethers.utils.formatEther(
            amountForSwap
          ).toString()}`
        );

        for (let i = 0; i < numberOfSwaps; i++) {
          const platform = getRandomInt(3);

          store.pushLoggerMessage(`Delay before further execution...`);
          await new Promise((r) =>
            setTimeout(r, getRandomIntInclusive(150_000, 600_000))
          );
          switch (platform) {
            case 0: // muteio
              store.pushLoggerMessage(
                `Account: ${to.toString()} - Muteio swap platform was randomly chosen`
              );
              await muteIoPools(
                zkSync_signer,
                amountForSwap,
                gasLimitZkSync
              );
              break;
            case 1: // spacefi
              store.pushLoggerMessage(
                `Account: ${to.toString()} - Spacefi swap platform was randomly chosen`
              );
              await spaceFiPools(
                zkSync_signer,
                amountForSwap,
                gasLimitZkSync
              );
              break;
            case 2: // velocore
              store.pushLoggerMessage(
                `Account: ${to.toString()} - Velocore swap platform was randomly chosen`
              );
              await velocorePools(
                zkSync_signer,
                amountForSwap,
                gasLimitZkSync
              );
              break;
          }
        }

        // Step 3 Add Liquidity
        if (store.addLiquidityFlag) {
          const numberOfAddLiquidity = await getRandomIntInclusive(
            store.minCountAddLiquidity,
            store.maxCountAddLiquidity
          );

          store.pushLoggerMessage(
            `Account: ${to.toString()} - In the range from ${store.minCountAddLiquidity.toString()} to ${store.maxCountAddLiquidity.toString()}, a random number of addLiquidity ${numberOfAddLiquidity.toString()}`
          );

          const percent = store.percentageOfTheBalanceForOneAddLiquidity;
          const amountForAddLiquidityETH = await percentageOfTheEtherBalance(
            zkSync_signer,
            percent
          );

          store.pushLoggerMessage(
            `Account: ${to.toString()} - Start addLiquidity with sum for 1st addLiquidity ${ethers.utils.formatEther(
              amountForAddLiquidityETH
            ).toString()}`
          );

          for (let i = 0; i < numberOfAddLiquidity; i++) {
            const platformId = getRandomInt(3);
            const platform =
              platformId == 0
                ? platforms.muteio
                : platformId == 1
                ? platforms.spacefi
                : platformId == 2
                ? platforms.velocore
                : 0;

            store.pushLoggerMessage(`Delay before further execution...`);
            await new Promise((r) =>
              setTimeout(r, getRandomIntInclusive(250_000, 600_000))
            );
            if (platformId == 0) {
              store.pushLoggerMessage(
                `Muteio platform for adding liquidity was chosen randomly`
              );
              const muteioRandomAddLiquidity = await getRandomIntInclusive(1,3);
              switch (muteioRandomAddLiquidity) { // muteio
                case 1:
                  await swapWETHtoUSDC(
                    platform,
                    zkSync_signer.address,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );

                  store.pushLoggerMessage(`Delay before further execution...`);
                  await new Promise((r) =>
                    setTimeout(r, getRandomIntInclusive(60_000, 240_000))
                  );
                  const balanceInUSDC = await balanceOf(USDC, zkSync_signer);

                  await muteIoAddLiquidityETH(
                    zkSync_signer.address,
                    USDC,
                    balanceInUSDC,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );
                  store.pushLoggerMessage(
                    `Account: ${to.toString()} - Liquidity added to WETH/USDC pool`
                  );
                  break;
                case 2:
                  await swapWETHtoMUTE(
                    platform,
                    zkSync_signer.address,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );

                  store.pushLoggerMessage(`Delay before further execution...`);
                  await new Promise((r) =>
                    setTimeout(r, getRandomIntInclusive(60_000, 240_000))
                  );
                  const balanceInMUTE = await balanceOf(MUTE, zkSync_signer);

                  await muteIoAddLiquidityETH(
                    zkSync_signer.address,
                    MUTE,
                    balanceInMUTE,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );
                  store.pushLoggerMessage(
                    `Account: ${to.toString()} - Liquidity added to WETH/MUTE pool`
                  );
                  break;
                case 3:
                  await swapWETHtoMVX(
                    platform,
                    zkSync_signer.address,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );

                  store.pushLoggerMessage(`Delay before further execution...`);
                  await new Promise((r) =>
                    setTimeout(r, getRandomIntInclusive(60_000, 240_000))
                  );
                  const balanceInMVX = await balanceOf(MVX, zkSync_signer);

                  await muteIoAddLiquidityETH(
                    zkSync_signer.address,
                    MVX,
                    balanceInMVX,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );
                  store.pushLoggerMessage(
                    `Account: ${to.toString()} - Liquidity added to WETH/MVX pool`
                  );
                  break;
              }
            } else if (platformId == 1) {
              // spacefi
              store.pushLoggerMessage(
                `SpaceFi platform for adding liquidity was chosen randomly`
              );
              const spaceFiRandomAddLiquidity = await getRandomIntInclusive(1,2);
              switch (spaceFiRandomAddLiquidity) {
                case 1:
                  await swapWETHtoUSDC(
                    platform,
                    zkSync_signer.address,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );

                  store.pushLoggerMessage(`Delay before further execution...`);
                  await new Promise((r) =>
                    setTimeout(r, getRandomIntInclusive(60_000, 240_000))
                  );
                  const balanceInUSDC = await balanceOf(USDC, zkSync_signer);

                  await spaceFiAddLiquidityETH(
                    zkSync_signer.address,
                    USDC,
                    balanceInUSDC,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );
                  store.pushLoggerMessage(
                    `Account: ${to.toString()} - Liquidity added to WETH/USDC pool`
                  );
                  break;
                case 2:
                  await swapWETHtoSPACE(
                    platform,
                    zkSync_signer.address,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );

                  store.pushLoggerMessage(`Delay before further execution...`);
                  await new Promise((r) =>
                    setTimeout(r, getRandomIntInclusive(60_000, 240_000))
                  );
                  const balanceInSPACE = await balanceOf(SPACE, zkSync_signer);

                  await spaceFiAddLiquidityETH(
                    zkSync_signer.address,
                    SPACE,
                    balanceInSPACE,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );
                  store.pushLoggerMessage(
                    `Account: ${to.toString()} - Liquidity added to WETH/SPACE pool`
                  );
                  break;
              }
            } else if (platformId == 2) {
              // velocore
              store.pushLoggerMessage(
                `Velocore platform for adding liquidity was chosen randomly`
              );
              const velocoreRandomAddLiquidity = await getRandomIntInclusive(1,2);
              switch (velocoreRandomAddLiquidity) {
                case 1:
                  await swapWETHtoUSDC(
                    platform,
                    zkSync_signer.address,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );

                  store.pushLoggerMessage(`Delay before further execution...`);
                  await new Promise((r) =>
                    setTimeout(r, getRandomIntInclusive(60_000, 240_000))
                  );
                  const balanceInUSDC = await balanceOf(USDC, zkSync_signer);

                  await velocoreAddLiquidityETH(
                    zkSync_signer.address,
                    USDC,
                    balanceInUSDC,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );
                  store.pushLoggerMessage(
                    `Account: ${to.toString()} - Liquidity added to WETH/USDC pool`
                  );
                  break;
                case 2:
                  await swapWETHtoMVX(
                    platform,
                    zkSync_signer.address,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );

                  store.pushLoggerMessage(`Delay before further execution...`);
                  await new Promise((r) =>
                    setTimeout(r, getRandomIntInclusive(60_000, 240_000))
                  );
                  const balanceInMVX = await balanceOf(MVX, zkSync_signer);

                  await velocoreAddLiquidityETH(
                    zkSync_signer.address,
                    MVX,
                    balanceInMVX,
                    amountForAddLiquidityETH,
                    gasLimitZkSync
                  );
                  store.pushLoggerMessage(
                    `Account: ${to.toString()} - Liquidity added to WETH/MVX pool`
                  );
                  break;
              }
            }
          }
        }
        if(zkSyncEraBridgeWithdraw) {
          store.pushLoggerMessage(`Preparing to withdraw ether from zkSync to Ethereum`);

          store.pushLoggerMessage(`Delay before further execution...`);
          await new Promise((r) =>
            setTimeout(r, getRandomIntInclusive(300_000, 800_000))
          );

          const withdrawAmount = await maxWithdrawalAmountFromL2(to);

          await bridgeZkSynctoETH(to, withdrawAmount, gasLimitZkSync);
          store.pushLoggerMessage(`Ether output from zkSync is put on hold for 24 hours`);
        }

        if(bungeeBridgeInOtherNetwork) {
          await bungeeBridgeWithdraw(withdrawNetwork, key) // передать network
        }
      }

// Swap
async function muteIoSwapExactETHForTokens(
  recipient,
  amountInETH,
  path,
  gasLimit
) {
  const key = await getPrivateKey(recipient);

  var signer = new ethers.Wallet(key, zkSyncProvider);
  const muteIo_write = new ethers.Contract(muteio, MuteioABI, signer); // Write only

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx =
          await muteIo_write.swapExactETHForTokensSupportingFeeOnTransferTokens(
            0,
            path,
            signer.address,
            9683908380,
            [false, false],
            { value: amountInETH }
          );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }
      txCompleted++;
      break;
    }
  }
}

async function muteIoSwapExactTokensForETH(
  recipient,
  amountIn,
  path,
  gasLimit
) {
  const key = await getPrivateKey(recipient);

  var signer = new ethers.Wallet(key, zkSyncProvider);
  const muteIo_write = new ethers.Contract(muteio, MuteioABI, signer); // Write only

  const Token = new ethers.Contract(path[0], ERC20ABI, signer); // Write only

  const tx = await Token.approve(muteio, amountIn);
  await tx.wait();
  store.pushLoggerMessage(`The router was approved from the address - ${signer.address.toString()}`);
  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx =
          await muteIo_write.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountIn,
            0,
            path,
            signer.address,
            9683908380,
            [false, false]
          );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }

      txCompleted++;
      break;
    }
  }
}

async function spaceFiSwapExactETHForTokens(
  recipient,
  amountInETH,
  path,
  gasLimit
) {
  const key = await getPrivateKey(recipient);

  var signer = new ethers.Wallet(key, zkSyncProvider);
  const spaceFi_write = new ethers.Contract(spacefi, SpacefiABI, signer); // Write only

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx = await spaceFi_write.swapExactETHForTokens(
          0,
          path,
          signer.address,
          9683908380,
          { value: amountInETH }
        );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }
      txCompleted++;
      break;
    }
  }
}

async function spaceFiSwapExactTokensForETH(
  recipient,
  amountIn,
  path,
  gasLimit
) {
  const key = await getPrivateKey(recipient);

  var signer = new ethers.Wallet(key, zkSyncProvider);
  const spaceFi_write = new ethers.Contract(spacefi, SpacefiABI, signer); // Write only

  const Token = new ethers.Contract(path[0], ERC20ABI, signer); // Write only

  const tx = await Token.approve(spacefi, amountIn);
  await tx.wait();
  store.pushLoggerMessage(`The router was approved from the address - ${signer.address}`);

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx = await spaceFi_write.swapExactTokensForETH(
          amountIn,
          0,
          path,
          signer.address,
          9683908380
        );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }
      txCompleted++;
      break;
    }
  }
}

// [{from: ..., to: ..., stable: ...}]

async function velocoreSwapExactETHForTokens(
  recipient,
  amountInETH,
  path,
  gasLimit
) {
  const key = await getPrivateKey(recipient);

  var signer = new ethers.Wallet(key, zkSyncProvider);
  const velocore_write = new ethers.Contract(velocore, VelocoreABI, signer); // Write only

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx = await velocore_write.swapExactETHForTokens(
          0,
          [[path[0], path[1], false]],
          signer.address,
          9683908380,
          { value: amountInETH }
        );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }
      txCompleted++;
      break;
    }
  }
}

async function velocoreSwapExactTokensForETH(
  recipient,
  amountIn,
  path,
  gasLimit
) {
  const key = await getPrivateKey(recipient);

  var signer = new ethers.Wallet(key, zkSyncProvider);
  const velocore_write = new ethers.Contract(velocore, VelocoreABI, signer); // Write only

  const Token = new ethers.Contract(path[0], ERC20ABI, signer); // Write only

  const tx = await Token.approve(velocore, amountIn);
  await tx.wait();
  store.pushLoggerMessage(`The router was approved from the address - ${signer.address.toString()}`);

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx = await velocore_write.swapExactTokensForETH(
          amountIn,
          0,
          [[path[0], path[1], false]],
          signer.address,
          9683908380
        );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }

      txCompleted++;
      break;
    }
  }
}

// Add Luqidity
async function muteIoAddLiquidityETH(
  recipient,
  token,
  amountTokenDesired,
  amountETHDesired,
  gasLimit
) {
  const key = await getPrivateKey(recipient);
  var signer = new ethers.Wallet(key, zkSyncProvider);

  const muteIo_write = new ethers.Contract(muteio, MuteioABI, signer); // Write only

  const decimalsFromTokenIn = await decimals(token);
  store.pushLoggerMessage(decimalsFromTokenIn.toString());

  const Token = new ethers.Contract(token, ERC20ABI, signer); // Write only

  const tx = await Token.approve(muteio, amountTokenDesired);
  await tx.wait();
  store.pushLoggerMessage(`The router was approved from the address - ${signer.address.toString()}`);

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      try {
        store.pushLoggerMessage(`Delay before further execution...`);
        await new Promise((r) =>
          setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
        );
        const tx = await muteIo_write.addLiquidityETH(
          token,
          amountTokenDesired,
          0,
          0,
          signer.address,
          9683908380,
          0,
          false,
          {
            value: amountETHDesired,
          }
        );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }

      txCompleted++;
      break;
    }
  }
}

async function spaceFiAddLiquidityETH(
  recipient,
  token,
  amountTokenDesired,
  amountETHDesired,
  gasLimit
) {
  const key = await getPrivateKey(recipient);
  var signer = new ethers.Wallet(key, zkSyncProvider);

  const spaceFi_write = new ethers.Contract(spacefi, SpacefiABI, signer); // Write only
  const decimalsFromTokenIn = await decimals(token);

  const Token = new ethers.Contract(token, ERC20ABI, signer); // Write only

  const tx = await Token.approve(spacefi, amountTokenDesired);
  await tx.wait();
  store.pushLoggerMessage(`The router was approved from the address - ${signer.address.toString()}`);

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx = await spaceFi_write.addLiquidityETH(
          token,
          amountTokenDesired,
          0,
          0,
          signer.address,
          9683908380,
          {
            value: amountETHDesired,
          }
        );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }

      txCompleted++;
      break;
    }
  }
}

async function velocoreAddLiquidityETH(
  recipient,
  token,
  amountTokenDesired,
  amountETHDesired,
  gasLimit
) {
  const key = await getPrivateKey(recipient);
  var signer = new ethers.Wallet(key, zkSyncProvider);

  const velocore_write = new ethers.Contract(velocore, VelocoreABI, signer); // Write only
  const decimalsFromTokenIn = await decimals(token);

  const Token = new ethers.Contract(token, ERC20ABI, signer); // Write only

  const tx = await Token.approve(velocore, amountTokenDesired);
  await tx.wait();
  store.pushLoggerMessage(`The router was approved from the address - ${signer.address.toString()}`);

  let txCompleted = 0;
  while (txCompleted < 1) {
    const gasPrice = await zkSyncProvider.getGasPrice();

    if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
      store.pushLoggerMessage(`Delay before further execution...`);
      await new Promise((r) =>
        setTimeout(r, getRandomIntInclusive(store.delayMin, store.delayMax))
      );
      try {
        const tx = await velocore_write.addLiquidityETH(
          token,
          true,
          amountTokenDesired,
          0,
          0,
          signer.address,
          9683908380,
          {
            value: amountETHDesired,
          }
        );
        await tx.wait(2);
      } catch (error) {
        store.pushLoggerMessage(error.toString());
      }

      txCompleted++;
      break;
    }
  }
}

///////////////////////////////////////// OBSOLETE ////////////////////////////////////

// Remove Liquidity

async function muteIoRemoveLiquidityETH(
  ids,
  token,
  liquidity,
  amountsTokenMin,
  amountsETHMin,
  deadline,
  stable,
  gasLimit
) {
  for (let i = 0; i < ids.length; i++) {
    const keyID = ids[i];
    var signer = new ethers.Wallet(store.privateKeys[keyID], zkSyncProvider);

    const muteIo_write = new ethers.Contract(muteio, MuteioABI, signer); // Write only
    const muteIo_read = new ethers.Contract(muteio, MuteioABI, zkSyncProvider); // Read only

    const to = ethers.utils.computeAddress(store.privateKeys[keyID]);

    const factoryAddress = await muteIo_read.factory();
    const factory = new ethers.Contract(
      factoryAddress,
      FactoryMuteIoABI,
      zkSyncProvider
    ); // Read only
    const LP = await factory.getPair(token, WETH, false);

    const decimalsFromLP = await decimals(LP);
    const decimalsFromToken = await decimals(token);

    const Token = new ethers.Contract(LP, ERC20ABI, signer); // Write only
    await Token.approve(
      muteio,
      ethers.utils.parseUnits(`${liquidity[i]}`, `${decimalsFromLP}`)
    );

    let txCompleted = 0;
    while (txCompleted < ids.length) {
      const gasPrice = await zkSyncProvider.getGasPrice();

      if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
        setTimeout(async function () {
          try {
            await muteIo_write.removeLiquidityETH(
              token,
              ethers.utils.parseUnits(`${liquidity[i]}`, `${decimalsFromLP}`),
              ethers.utils.parseUnits(
                `${amountsTokenMin[i]}`,
                `${decimalsFromToken}`
              ),
              ethers.utils.parseUnits(`${amountsETHMin[i]}`, `18`),
              to,
              deadline,
              stable
            );
          } catch (error) {
            store.pushLoggerMessage(error);
          }
        }, getRandomInt(120000));

        txCompleted++;
        break;
      }
    }
  }
}

async function spaceFiRemoveLiquidityETH(
  ids,
  token,
  liquidity,
  amountsTokenMin,
  amountsETHMin,
  deadline,
  gasLimit
) {
  for (let i = 0; i < ids.length; i++) {
    const keyID = ids[i];
    var signer = new ethers.Wallet(store.privateKeys[keyID], zkSyncProvider);

    const spaceFi_write = new ethers.Contract(spacefi, SpacefiABI, signer); // Write only
    const spaceFi_read = new ethers.Contract(
      spacefi,
      SpacefiABI,
      zkSyncProvider
    ); // Read only

    const to = ethers.utils.computeAddress(store.privateKeys[keyID]);

    const factoryAddress = await spaceFi_read.factory();
    const factory = new ethers.Contract(
      factoryAddress,
      FactoryABI,
      zkSyncProvider
    ); // Read only
    const LP = await factory.getPair(token, WETH);

    const decimalsFromLP = await decimals(LP);
    const decimalsFromToken = await decimals(token);

    const Token = new ethers.Contract(LP, ERC20ABI, signer); // Write only
    await Token.approve(
      spacefi,
      ethers.utils.parseUnits(`${liquidity[i]}`, `${decimalsFromLP}`)
    );

    let txCompleted = 0;
    while (txCompleted < ids.length) {
      const gasPrice = await zkSyncProvider.getGasPrice();

      if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
        setTimeout(async function () {
          try {
            await spaceFi_write.removeLiquidityETH(
              token,
              ethers.utils.parseUnits(`${liquidity[i]}`, `${decimalsFromLP}`),
              ethers.utils.parseUnits(
                `${amountsTokenMin[i]}`,
                `${decimalsFromToken}`
              ),
              ethers.utils.parseUnits(`${amountsETHMin[i]}`, `18`),
              to,
              deadline
            );
          } catch (error) {
            store.pushLoggerMessage(error.toString());
          }
        }, getRandomInt(120000));

        txCompleted++;
        break;
      }
    }
  }
}

async function velocoreRemoveLiquidityETH(
  ids,
  token,
  stable,
  liquidity,
  amountsTokenMin,
  amountsETHMin,
  deadline,
  gasLimit
) {
  for (let i = 0; i < ids.length; i++) {
    const keyID = ids[i];
    var signer = new ethers.Wallet(store.privateKeys[keyID], zkSyncProvider);

    const velocore_write = new ethers.Contract(velocore, VelocoreABI, signer); // Write only
    const velocore_read = new ethers.Contract(
      velocore,
      VelocoreABI,
      zkSyncProvider
    ); // Read only

    const to = ethers.utils.computeAddress(store.privateKeys[keyID]);

    const factoryAddress = await velocore_read.factory();
    const factory = new ethers.Contract(
      factoryAddress,
      FactoryMuteIoABI,
      zkSyncProvider
    ); // Read only
    const LP = await factory.getPair(token, WETH, false);

    const decimalsFromLP = await decimals(LP);
    const decimalsFromToken = await decimals(token);

    const Token = new ethers.Contract(LP, ERC20ABI, signer); // Write only
    await Token.approve(
      velocore,
      ethers.utils.parseUnits(`${liquidity[i]}`, `${decimalsFromLP}`)
    );

    let txCompleted = 0;
    while (txCompleted < ids.length) {
      const gasPrice = await zkSyncProvider.getGasPrice();

      if (gasLimit == 0 || gasPrice.lte(ethers.BigNumber.from(gasLimit))) {
        setTimeout(async function () {
          try {
            await velocore_write.removeLiquidityETH(
              token,
              stable,
              ethers.utils.parseUnits(`${liquidity[i]}`, `${decimalsFromLP}`),
              ethers.utils.parseUnits(
                `${amountsTokenMin[i]}`,
                `${decimalsFromToken}`
              ),
              ethers.utils.parseUnits(`${amountsETHMin[i]}`, `18`),
              to,
              deadline
            );
          } catch (error) {
            store.pushLoggerMessage(error.toString());
          }
        }, getRandomInt(120000));

        txCompleted++;
        break;
      }
    }
  }
}

module.exports = {
  velocoreAddLiquidityETH,
  velocoreRemoveLiquidityETH,
  muteIoAddLiquidityETH,
  muteIoRemoveLiquidityETH,
  spaceFiAddLiquidityETH,
  spaceFiRemoveLiquidityETH,
};



// bungeeBridgeWithdraw("0x5800249621DA520aDFdCa16da20d8A5Fc0f814d8", "0xfeaaf0634785a2f181ff9f9cb06a5742a557257063d737e428c94d744be67c3c");
