

async function loadTypeDefs() {
    const typeDefs: string[] = [];

    const files: any = import.meta.dirname;

    for (const file of Deno.readDirSync(files)) {
        if (file.name.endsWith(".graphql")) {
            const content = await Deno.readTextFileSync(import.meta.dirname + '\\' + file.name)
            typeDefs.push(content);
        }
    }

    return typeDefs;
}

const typeDefs = loadTypeDefs();
export default typeDefs;
