const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

function getAllMoneyTransfers() {
  return prisma.moneyTransfers.findMany();
}

async function createMoneyTransfers(data, account) {
  const { amount, accountId, userId } = data;
  // Mettre à jour le solde du compte
  await axios.put(`http://localhost:3002/accounts/${accountId}`, {
      amount :  account.data.amount + amount ,

  })
  // Créer le nouveau transfert d'argent
  const newMoneyTransfer = await prisma.moneyTransfers.create({
    data: {
      accountName: account.data.name,
      amount,
      accountId,
      userId
    },
  });

  return newMoneyTransfer;
}


async function createMoneyTransfersAccounts(data, account) {
  const { amount, accountId, userId } = data;
  // Mettre à jour le solde du compte A
  await axios.put(`http://localhost:3002/accounts/${accountId}`, {
      amount :  account.data.amount + amount ,

  })
  // Créer le nouveau transfert d'argent
  const newMoneyTransfer = await prisma.moneyTransfers.create({
    data: {
      accountName: account.data.name,
      amount,
      accountId,
      userId
    },
  });

  return newMoneyTransfer;
}



async function createTransfert(data) {
  return prisma.moneyTransfers.create({
    data: {
      accountName: data.name,
      amount: data.amount,
      transferDate: data.createdDate,
      userId: data.userId,
      accountId: data.id
    }
  });
}


module.exports = {
  getAllMoneyTransfers,
  createMoneyTransfers,
  createTransfert
};
