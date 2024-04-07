const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getAllAccounts() {
  return prisma.account.findMany();
}

function getAccountById(id) {
  return prisma.account.findUnique({
    where: { id: id },
  });
}

async function createAccount(data) {
  console.log(data);
  return prisma.account.create({
    data: data,
  });
}

async function updateAccount(id, data) {
  return prisma.account.update({
    where: { id: id },
    data: {
      amount: {
        increment: data.amount
      },
    },
  });
}

module.exports = {
  updateAccount,
  getAllAccounts,
  getAccountById,
  createAccount,
};
