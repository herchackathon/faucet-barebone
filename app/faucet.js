if (typeof web3 !== 'undefined') {
    // Don't lose an existing provider, like Mist or Metamask
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
web3.eth.getCoinbase(function(err, coinbase) {
    if (err) {
        console.error(err);
    } else {
        console.log("Coinbase: " + coinbase);
    }
});

// Your deployed address changes every time you deploy.
const faucetAddress = "0xf8767ad850761e0682fbb4949a5c51f9c364311b"; // <-- Put your own
const faucetContractFactory = web3.eth.contract(JSON.parse(faucetCompiled.contracts["Faucet.sol:Faucet"].abi));
const faucetInstance = faucetContractFactory.at(faucetAddress);

// Query eth for balance
web3.eth.getBalance(faucetAddress, function(err, balance) {
    if (err) {
        console.error(err);
    } else {
        console.log("Contract balance: " + balance);
    }
});

// Query the contract directly
faucetInstance.getBalance.call(function(err, balance) {
    if (err) {
        console.error(err);
    } else {
        console.log("Faucet balance: " + balance);
    }
});

function topUp() {
    web3.eth.getCoinbase(function(err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            web3.eth.sendTransaction({ 
                from: coinbase, 
                to: faucetAddress,
                value: web3.toWei(1, "ether") 
            }, function(err, txn) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("topUp txn: " + txn);
                }
            });
        }
    });
}

function sendWei() {
    web3.eth.getCoinbase(function(err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            web3.eth.getAccounts(function(err, accounts) {
                if (err) {
                    console.error(err);
                } else {
                    const targetAccount = accounts[1];      
                    faucetInstance.sendWei(
                        targetAccount,
                        { from: coinbase },
                        function(err, txn) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("sendWei txn: " + txn);
                            }
                        });
                }
            });
        }
    });
}