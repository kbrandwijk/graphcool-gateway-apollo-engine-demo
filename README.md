# graphcool-gateway-apollo-engine-demo

This demo demonstrates using Apollo Engine with the Graphcool API Gateway pattern. TL;DR: This does not work as expected...

## Setup

- Register on https://www.apollographql.com/engine/

- Create a new service and note the API Key

- Create a `.env` file in the root of your project folder with the following keys:
  - `GRAPHCOOL_ENDPOINT`
  - `APOLLO_ENGINE_KEY`


- Run `yarn install` or `npm install`

- Run `yarn start` or `npm start`

- Open http://localhost:3000/playground and execute some queries

- Go over to the Apollo Engine website to check your metrics

## Notes

- Unfortunately, `makeRemoteExecutableSchema` turns every query into a single request to the underlying API (our Graphcool API). This means the metrics will not show any useful data about how your query is actually executed by the Graphcool server. It does, however, give you an overall indication.
