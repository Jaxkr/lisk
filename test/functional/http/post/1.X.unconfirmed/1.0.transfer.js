'use strict';

var node = require('../../../../node');
var shared = require('../../../shared');
var localShared = require('./shared');

var sendTransactionPromise = require('../../../../common/apiHelpers').sendTransactionPromise;

describe('POST /api/transactions (unconfirmed type 0 on top of type 1)', function () {

	var transaction;
	var badTransactions = [];
	var goodTransactions = [];

	var account = node.randomAccount();

	localShared.beforeUnconfirmedPhase(account);

	describe('sending funds', function () {

		it('using second signature with an account that has a pending second passphrase registration should fail', function () {
			transaction = node.lisk.transaction.createTransaction(node.randomAccount().address, 1, account.password, account.secondPassword);

			return sendTransactionPromise(transaction).then(function (res) {
				node.expect(res).to.have.property('status').to.equal(400);
				node.expect(res).to.have.nested.property('body.message').to.equal('Sender does not have a second signature');
				badTransactions.push(transaction);
			});
		});
	});

	describe('confirmation', function () {

		shared.confirmationPhase(goodTransactions, badTransactions);
	});
});
