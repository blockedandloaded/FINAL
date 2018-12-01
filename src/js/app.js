App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("GunCore.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.GunCore = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.GunCore.setProvider(App.web3Provider);

      App.listenForEvents(); 

      return App.render();
    });
  },

    // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.GunCore.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.Transfer({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new transaction is recorded
        App.render();
      });
    });
  },

  render: function() {
    var transactionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.GunCore.deployed().then(function(instance) {
      gunInstance = instance;
      return gunInstance.tokensOfOwner(App.account)
    }).then(function(gunIDs) { 
      var accountGuns = $("#accountGuns");
      accountGuns.empty();

      var gunSelect = $('#gunSelect');
      gunSelect.empty();

      var guns = gunInstance.tokensOfOwner(App.account);

      for (var i = 0; i < guns.length; i++) {
        console.log(getGun(1));
        gunInstance.getGun(i).then(function(gun) {
          var name = gun[0];
          var serial = gun[1];
          var manufacturer = gun[2];

          // Render candidate Result
          var gunTemplate = "<tr><th>" + name + "</th><td>" + serial + "</td><td>" + manufacturer + "</td></tr>"
          accountGuns.append(gunTemplate);

          var gunOption = "<option value='" + serial + "'>" + name + "</ option>"
          gunSelect.append(gunOption);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  register: function() {
    var name = $('#name').val();
    var serial = $('#serial').val();
    var manufacturer = $('#manufacturer').val();
    App.contracts.GunCore.deployed().then(function(instance) {
      return instance.createGun(name, serial, manufacturer, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    })
  }
  };
//   recordTransaction: function() {
//     var cId = $('#gunSelect').val();
//     App.contracts.Election.deployed().then(function(instance) {
//       return instance.vote(candidateId, { from: App.account });
//     }).then(function(result) {
//       // Wait for votes to update
//       $("#content").hide();
//       $("#loader").show();
//     }).catch(function(err) {
//       console.error(err);
//     });
//   }
// };

$(function() {
  $(window).load(function() {
    App.init();
  });
});