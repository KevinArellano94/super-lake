

async function loadResolvers() {
    const resolvers: Record<string, any> = {
        Query: {},
        Mutation: {},
        // Subscription: {},
    };

    const files: any = import.meta.dirname;

    for (const file of Deno.readDirSync(files)) {
        if (file.name.endsWith(".ts") && file.name !== "index.ts") {
            const module = new URL(file.name, import.meta.url).href;

            const importedModule = await import(module);

            for (const [key, value] of Object.entries(importedModule)) {
                if (resolvers[key]) {
                    Object.assign(resolvers[key], value);
                } else {
                    resolvers[key] = value;
                }
            }
        }
    }

    return resolvers;
}

const resolvers = Promise.all([loadResolvers()]);
export default resolvers;
