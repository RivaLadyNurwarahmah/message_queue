import ampq from "amqplib"
import { config } from "../config/config"

class rabbitMQService {
    private channel: ampq.Channel | null = null

    async connect(){
        try {
            const connection = await ampq.connect(config.rabbitmqUrl)
            this.channel = await connection.createChannel()
            await this.channel.assertExchange(config.exchangeName, config.exchangeType)
            console.log("Connected to RabbitMQ");
        } catch (error) {
            console.error('RabbitMQ connection error: ${errror}');
            throw error;
        }
    }

    async publish(message: any){
        if (!this.channel){
            throw new Error('RabbitMQ channel not initialized.')
        }
        const msgBuffer = Buffer.from(JSON.stringify(message))
        this.channel.publish(config.exchangeName, '', msgBuffer, {persistent: true})
    }

    async subcribeQueue(queueName: string){
        try {
            const connection = await ampq.connect(config.rabbitmqUrl)
            this.channel = await connection.createChannel()
            await this.channel.assertExchange(config.exchangeName, config.exchangeType, {durable:true})
            await this.channel.assertQueue(queueName, {durable:true})
            await this.channel.bindQueue(queueName, config.exchangeName, '')

            console.log(`Waiting for message in ${queueName}. To exit press CTRL + C`);

            this.channel.consume(queueName, (msg) => {
                if (msg !==null){
                    const messageContent = JSON.parse(msg.content.toString())
                    console.log(`Received message in ${queueName}: `, messageContent);
                    console.log(`[${queueName}] sending for messages on queue: ${queueName}`);
                    console.log(`[${queueName}] Waiting for messages on queue: ${queueName}`);
                    this.channel?.ack(msg)                
                }            
            }, { noAck: false })            
        } catch (error) {
            throw error
        }
    }
}

export default new rabbitMQService;