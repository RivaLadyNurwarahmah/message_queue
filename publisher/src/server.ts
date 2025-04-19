import express from "express";
import dotenv from "dotenv"
import notificationRouter from "./routes/notificationRoutes.routes";
import rabbitmqServices from "./services/rabbitmq.services";

dotenv.config()

const app = express()
const PORT = 8080

app.use(express.json())
app.use('/', notificationRouter)

async function startServer(port: number) {
    const server = app.listen(port, () => {
        console.log(`server running on port ${port}`);
    })

    try {
        await rabbitmqServices.connect()
    } catch (error) {
        console.error('Failed to connect RabbitMQ');
    }

    server.on('error', (error: any) => {
        if (error.code === "EADDRINUSE") {
            console.log(`Port ${port} already in use, traying port ${port as number + 1}`);
            startServer(port as number + 1)
        } else {
            console.log(`Error server: ${error}`);
        }
    })
}

startServer(Number(PORT))