import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import typeDefs from "./typeDefs/index.ts";
import resolvers from "./resolvers/index.ts";


async function main() {
    const server = new ApolloServer({
        typeDefs: await typeDefs,
        resolvers: await resolvers
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        // context: async ({ req }) => {
        //     return {
        //         headers: req.headers,
        //     };
        // }
    });
    console.log(`🚀  Server ready at: ${url}`);
}

main().then()
