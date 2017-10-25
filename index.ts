require('dotenv').config()

import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { graphqlExpress } from 'apollo-server-express'
import { makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { express as playground } from 'graphql-playground/middleware'
import { Engine } from 'apollo-engine'

async function run() {

  // Create and start Apollo Engine instance
  const engine = new Engine({ engineConfig: { apiKey: process.env.APOLLO_ENGINE_KEY! }, graphqlPort: 3000 });
  engine.start();

  // Create schema from remote endpoint
  const endpoint = process.env.GRAPHCOOL_ENDPOINT
  const link = new HttpLink({ uri: endpoint, fetch })
  const graphcoolSchema = makeRemoteExecutableSchema({
    schema: await introspectSchema(link),
    link,
  })

  const app = express()
  app.use(engine.expressMiddleware());
  app.use('/graphql', cors(), bodyParser.json(), graphqlExpress({ schema: graphcoolSchema,tracing: true, cacheControl: true }))
  app.use('/playground', playground({ endpoint: '/graphql' }))

  app.listen(3000, () => console.log('Server running. Open http://localhost:3000/playground to run queries.'))
}

run().catch(console.error.bind(console))
