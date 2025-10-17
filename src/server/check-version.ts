import { parseOptions } from "./options";
import { verifyApiVersion } from "./version";

async function main() {
    const options = parseOptions(process.argv);
    await verifyApiVersion(options.apiUrl);
}

main();
