import rabbitmqServices from "../services/rabbitmq.services";

const queueName = "SMS"

async function startSmsConsumer() {
    try {
        rabbitmqServices.subcribeQueue(queueName)
    } catch (error) {
        console.error(`[${queueName}] Error:`, error);
    }
}

startSmsConsumer();