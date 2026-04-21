const kafka = require('./kafka');

const producer = kafka.producer();
const admin = kafka.admin();

const TOPICS = ['order.placed'];

const connectProducer = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: TOPICS.map((topic) => ({ topic, numPartitions: 1 })),
    waitForLeaders: true,
  });
  await admin.disconnect();

  await producer.connect();
  console.log('Kafka producer connected');
};

const publishEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

module.exports = { connectProducer, publishEvent };
