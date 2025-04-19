import { Router } from "express";
import { publishNotification } from "../controller/notification_controller";

const notificationRouter = Router()

notificationRouter.post('/publish', publishNotification)

export default notificationRouter;