import { apiClient } from "../app/api";
import { Message } from "./types";

/**
 * Fetch the instance message
 *
 * @returns A promise resolving to an instance message
 */
export function getMessage(): Promise<Message> {
    return apiClient.get("/instance_message").then((res) => res.body);
}

/**
 * Updates the instance message
 *
 * @param message - The updated message
 * @returns A promise resolving to an updated instance message
 */
export function setMessage(message: string): Promise<Message> {
    return apiClient
        .put("/instance_message")
        .send({ color: "red", message })
        .then((res) => res.body);
}
