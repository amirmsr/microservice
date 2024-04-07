const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



function getAllUsers() {
  return prisma.user.findMany();
}
function getUserById(id) {
  return prisma.user.findUnique({
    where: { id: id },
  });
}

async function createUser(data) {
  return prisma.user.create({
    data: data,
  });
}


async function loginUser(req, res, next) {
    const { mail, password } = req.body;
  
    // Trouver l'utilisateur correspondant à l'adresse e-mail
    const user = await prisma.user.findUnique({
      where: { mail: mail },
    });
  
    // Vérifier que l'utilisateur existe et que le mot de passe correspond
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect' });
    }
  
    // Générer un jeton JWT pour l'utilisateur
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  
    // Renvoie le jeton JWT dans la réponse
    res.json({ token: token });
  }

module.exports = {
  getAllUsers,
  getUserById,
  createUser
};
