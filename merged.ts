require('dotenv').config()

import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { graphqlExpress } from 'apollo-server-express'
import { makeRemoteExecutableSchema, introspectSchema, mergeSchemas } from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { expressPlayground } from 'graphql-playground-middleware'
import { Engine } from 'apollo-engine'

async function run() {

  // Create and start Apollo Engine instance
  const engine = new Engine({ engineConfig: { apiKey: process.env.APOLLO_ENGINE_KEY! }, graphqlPort: 3000 });
  engine.start();

  // Create schemas from remote endpoints
  const postEndpoint = process.env.GRAPHCOOL_POST_ENDPOINT || 'https://api.graph.cool/simple/v1/apollo-engine-demo-posts'
  const postLink = new HttpLink({ uri: postEndpoint, fetch })
  const postSchema = makeRemoteExecutableSchema({
    schema: await introspectSchema(postLink),
    link: postLink,
  })

  const commentsEndpoint = process.env.GRAPHCOOL_COMMENT_ENDPOINT || 'https://api.graph.cool/simple/v1/apollo-engine-demo-comments'
  const commentsLink = new HttpLink({ uri: commentsEndpoint, fetch })
  const commentsSchema = makeRemoteExecutableSchema({
    schema: await introspectSchema(commentsLink),
    link: commentsLink,
  })

  // Extend the schemas to link them together
  const linkTypeDefs = `
  extend type Post {
    comments: [Comment]
  }

  extend type Comment {
    post: Post
  }
`;

  const schema = mergeSchemas({
  schemas: [postSchema, commentsSchema, linkTypeDefs],
  resolvers: mergeInfo => ({
    Post: {
      comments: {
        fragment: `fragment PostFragment on Post { id }`,
        resolve(parent:any, args:any, context:any, info:any) {
          const postId = parent.id;
          return mergeInfo.delegate(
            'query', 'allComments', { filter: { postId }}, context, info
          )
        }
      }
    },
    Comment: {
      post: {
        fragment: `fragment CommentFragment on Comment { postId }`,
        resolve(parent:any, args:any, context:any, info:any) {
          const id = parent.id;
          return mergeInfo.delegate(
            'query', 'Post', { id }, context, info
          )
        }
      }
    }
  })
});

  const app = express()
  app.use(engine.expressMiddleware());
  app.use('/graphql', cors(), bodyParser.json(), graphqlExpress({ schema: schema, tracing: true }))
  app.use('/playground', expressPlayground({ endpoint: '/graphql' }))

  app.listen(3000, () => console.log('Server running. Open http://localhost:3000/playground to run queries.'))
}

run().catch(console.error.bind(console))
