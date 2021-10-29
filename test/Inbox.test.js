const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
 
const { abi, evm } = require('../compile');
const INIT_MSG = 'Initiation the first phase...'
let accounts;
let inbox;
 
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(abi).deploy({data: evm.bytecode.object, arguments:[INIT_MSG]}).send({from: accounts[0], gas: '1000000'});
});
 
describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });
  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INIT_MSG);
  });
  it('can change the message', async () => {
    const newMessage = 'Let\'s explore now';
    await inbox.methods.setMessage(newMessage).send({from : accounts[0]});
    const message = await inbox.methods.message().call(); 
    assert.equal(newMessage, message);
  });
});