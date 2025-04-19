import { Request, Response } from "express";
import rabbitmqServices from "../services/rabbitmq.services";

export const publishNotification = async (req: Request, res: Response) => {
    try {
        const {order_id, user_id, content, timestamp} = req.body;

        if (!order_id || !user_id || !content || !timestamp) {
            res.status(400).json({code: 400, message: 'Invalid payload'});
        }

        const message = {order_id, user_id, content, timestamp}

        await rabbitmqServices.publish(message)        
        console.log('Message published:', message);
        res.status(200).json({success: true, message: "Message published successfully"})
    } catch (error:any) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message})
    }
}