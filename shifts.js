/**
 * This codemod extracts specific named imports from '@base' into individual imports
 *
 * Example:
 * Before:
 * import { Icon, Button, Card } from "@base";
 *
 * After:
 * import Icon from "@base/Icon";
 * import { Button, Card } from "@base";
 */

module.exports = function (fileInfo, api, options) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    // Define components to extract (add more as needed)
    const componentsToExtract = ["Icon", "IconButton"];

    // Find all import declarations from "@base"
    const baseImports = root.find(j.ImportDeclaration, {
        source: {
            value: "@base",
        },
    });

    // Process each import declaration
    baseImports.forEach((path) => {
        const importDeclaration = path.node;
        const specifiers = importDeclaration.specifiers;

        // Find which components from our list are in this import declaration
        const toExtract = [];
        const remaining = [];

        specifiers.forEach((specifier) => {
            // Only process named imports (ImportSpecifier)
            if (specifier.type === "ImportSpecifier") {
                const name = specifier.imported
                    ? specifier.imported.name
                    : specifier.local.name;

                // Check if this component should be extracted
                if (componentsToExtract.includes(name)) {
                    toExtract.push(name);
                } else {
                    remaining.push(specifier);
                }
            }
        });

        // If we found components to extract, modify the imports
        if (toExtract.length > 0) {
            // Create new individual imports
            const newImports = toExtract.map((name) =>
                j.importDeclaration(
                    [j.importDefaultSpecifier(j.identifier(name))],
                    j.literal(`@base/${name}`),
                ),
            );

            // If there are remaining imports, create a new import declaration for them
            if (remaining.length > 0) {
                newImports.push(
                    j.importDeclaration(remaining, j.literal("@base")),
                );
            }

            // Replace the original import with our new imports
            j(path).replaceWith(newImports);
        }
    });

    return root.toSource({ quote: "single" });
};
