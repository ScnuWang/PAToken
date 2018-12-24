App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('PAToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var PATokenArtifact = data;
      App.contracts.PAToken = TruffleContract(PATokenArtifact);

      // Set the provider for our contract.
      App.contracts.PAToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' PAT to ' + toAddress);

    var paTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.PAToken.deployed().then(function(instance) {
        paTokenInstance = instance;

        return paTokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');



    var paTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {

      console.log("======>"+accounts);

      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.PAToken.deployed().then(function(instance) {
        paTokenInstance = instance;

        return paTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#PATBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
