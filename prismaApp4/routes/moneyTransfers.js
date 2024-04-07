const express = require("express");
const axios = require("axios");
const router = express.Router();
const {
  getAllMoneyTransfers,
  createMoneyTransfers,
  createTransfert,
} = require("../models/moneyTransfers");

const amqp = require('amqplib');

/* GET users listing. */
router.get("/", function (req, res, next) {
  getAllMoneyTransfers().then((moneyTransfers) => res.json(moneyTransfers));
});



/* ajout d'argent a un compte */
/* 
router.post("/", async function (req, res, next) {
  const moneyTransfersData = req.body; 

  try {
    const user = await axios.get(
      `http://localhost:3001/users/${moneyTransfersData.userId}`
    );

    if (!user.data) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const account = await axios.get(
      `http://localhost:3002/accounts/${moneyTransfersData.accountId}`
    ); 

    if (!account.data) {
      return res.status(400).json({ error: "Invalid account id" });    
    }

    console.log(user.data.id)

    createMoneyTransfers(moneyTransfersData, account)
    .then((moneyTransfers) => {
      res.status(201).json(moneyTransfers);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });


  } catch (error) {
    return res.status(400).json({ error: "Invalid user or account" });
  }
  
}); 
 */



// Créez une connexion à RabbitMQ
amqp.connect('amqp://rabbitmq')  //amqp://127.0.0.1
  .then((conn) => {
    return conn.createChannel();
  })
  .then((channel) => {
    const queueName = 'account_updates';

    // Assurez-vous que la file d'attente existe
    channel.assertQueue(queueName, { durable: false });

    // Consommez les messages de la file d'attente
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const accountData = JSON.parse(msg.content.toString());
        
        // Créez un transfert d'argent en fonction des données du compte
        createTransfert(accountData)
          .then((moneyTransfers) => {
            console.log('Transfert d\'argent créé :', moneyTransfers);
          })
          .catch((error) => {
            console.error('Erreur lors de la création du transfert d\'argent :', error);
          });

        // Confirmez la réception du message
        channel.ack(msg);
      }
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à RabbitMQ :', error);
  });





module.exports = router;
