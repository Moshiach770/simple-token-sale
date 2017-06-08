const Sale = artifacts.require(`./Sale.sol`);
const Token = artifacts.require(`./HumanStandardToken.sol`);
const fs = require(`fs`);
const BN = require(`bn.js`);

module.exports = function(deployer, network, accounts) {
    const saleConf = JSON.parse(fs.readFileSync(`./conf/sale.json`));
    const tokenConf = JSON.parse(fs.readFileSync(`./conf/token.json`));
    const preBuyersConf = JSON.parse(fs.readFileSync(`./conf/preBuyers.json`));
    const foundersConf = JSON.parse(fs.readFileSync(`./conf/founders.json`));

    if(network === `development`) {
      saleConf.owner = accounts[0];
      saleConf.wallet = `0x000000000000000000000000000000000000dead`;
      saleConf.prod = false;
      fs.writeFileSync(`./conf/sale.json`, JSON.stringify(saleConf, null, `  `));

      foundersConf.founders.consensys.address = accounts[10];
      foundersConf.founders.metax.address = accounts[11];
      foundersConf.prod = false;
      fs.writeFileSync(`./conf/founders.json`, JSON.stringify(foundersConf, null, `  `));
    }

    if(network === `mainnet`) {
      if(saleConf.prod === false || foundersConf.prod === false) {
        throw new Error(`Sale conf file has prod flag set to false.`);
      }
    }

    const preBuyers = [];
    const preBuyersTokens = [];
    for (recipient in preBuyersConf) {
      preBuyers.push(preBuyersConf[recipient].address); 
      preBuyersTokens.push(new BN(preBuyersConf[recipient].amount, 10)); 
    }

    const founders = [];
    const foundersTokens = [];
    for (recipient in foundersConf.founders) {
      founders.push(foundersConf.founders[recipient].address); 
      foundersTokens.push(new BN(foundersConf.founders[recipient].amount, 10)); 
    }

    const vestingDates = [];
    for (date in foundersConf.vestingDates) {
      vestingDates.push(foundersConf.vestingDates[date])
    }


    return deployer.deploy(Sale,
      saleConf.owner,
      saleConf.wallet,
      tokenConf.initialAmount,
      tokenConf.tokenName,
      tokenConf.decimalUnits,
      tokenConf.tokenSymbol,
      saleConf.price,
      saleConf.startBlock,
      saleConf.freezeBlock,
      preBuyers,
      preBuyersTokens,
      founders,
      foundersTokens,
      vestingDates
    )
};
