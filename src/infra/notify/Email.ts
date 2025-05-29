import { ProblemDetails } from "../../common/problemDetails";

export interface INotificationAPI {
  notify(email: string): number;
}

export class EmailNotification {
  // This is to simulate notifying the next user in the queue
  notify(email: string): number {
    console.log(`Notifying next user : ${email}`);
    const notificationId = Math.floor(Math.random() * 10000);
    // Return notification ID for tracking
    return notificationId;
  }
}
