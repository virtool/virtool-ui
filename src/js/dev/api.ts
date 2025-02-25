import { Request } from "@app/request";

/**
 * Executes a developer command
 *
 * @param command - The command to execute
 * @returns A promise resolving to executing a developer command
 */
export function postDevCommand(command: string) {
    return Request.post("/dev")
        .send({ command })
        .then((res) => res.body);
}
