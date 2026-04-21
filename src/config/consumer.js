const kafka = require('./kafka');

const consumer = kafka.consumer({ groupId: 'order-management-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order.placed', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('order.placed event received:', event);
    },
  });

  console.log('Kafka consumer started');
};

module.exports = { startConsumer };
