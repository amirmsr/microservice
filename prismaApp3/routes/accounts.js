const express = require("express");
const router = express.Router();
const { getAllAccounts, getAccountById, createAccount, updateAccount } = require("../models/accounts.js");
const amqp = require('amqplib');



/* GET accounts listing. */ 

router.get("/", function (req, res, next) {
  getAllAccounts().then((accounts) => res.json(accounts));
});


router.get("/:id", function (req, res, next) {
  getAccountById(+req.params.id).then((account) => res.json(account));
});

router.post("/", function (req, res, next) {
  const accountData = req.body;
  createAccount(accountData)
    .then((account) => {
      res.status(201).json(account);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

/* router.put("/:id", function(req, res,next){
  const accountNewData = req.body;
  const id = parseInt(req.params.id, 10); // Convertir la chaîne en entier

  updateAccount(id, accountNewData)
    .then((account)=>{  
        res.status(201).json(account);
    })
    .catch((error)=>{
        res.status(500).json({error: error.message})
    })
})  */

amqp.connect('amqp://rabbitmq:5672')  //amqp://127.0.0.1 //important start rabbitmq in docker
  .then((conn) => {
    return conn.createChannel();
  })
  .then((channel) => {
    const queueName = 'account_updates';

    // Assurez-vous que la file d'attente existe
    channel.assertQueue(queueName, { durable: false });

    // Écoutez les modifications de compte et publiez un message
    router.put("/:id", function(req, res,next){
      const accountNewData = req.body;
      const id = parseInt(req.params.id, 10);

      updateAccount(id, accountNewData)
        .then((account) => {
          // Publiez un message avec les données mises à jour du compte
          channel.sendToQueue(queueName, Buffer.from(JSON.stringify(account)));
          res.status(201).json(account);
          
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à RabbitMQ :', error);
  });




module.exports = router;
