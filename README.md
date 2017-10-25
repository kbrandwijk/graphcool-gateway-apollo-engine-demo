# graphcool-gateway-apollo-engine-demo

This demo demonstrates using Apollo Engine with the Graphcool API Gateway pattern. It contains a simple example with one endpoint, and an advanced example that stitches together two endpoints.

## Simple example

### Setup

- Register on https://www.apollographql.com/engine/

- Create a new service and note the API Key

![image](https://user-images.githubusercontent.com/852069/32007018-a6cce006-b9a8-11e7-8af4-ecad7d442053.png)

![image](https://user-images.githubusercontent.com/852069/32007103-deecc208-b9a8-11e7-8666-cf32adce5325.png)

- Create a `.env` file in the root of your project folder with the following keys:
  - `GRAPHCOOL_ENDPOINT`
  - `APOLLO_ENGINE_KEY`

```
GRAPHCOOL_ENDPOINT=https://api.graph.cool/simple/v1/...
APOLLO_ENGINE_KEY=service:xxx:.......
```

- Run `yarn install` or `npm install`

- Run `yarn start` or `npm start`

![image](https://user-images.githubusercontent.com/852069/32007217-34ff025a-b9a9-11e7-863e-2e09f83cd798.png)

- Open http://localhost:3000/playground and execute some queries

![image](https://user-images.githubusercontent.com/852069/32007245-52885c86-b9a9-11e7-99c3-976d2ee8f39a.png)

- Go over to the Apollo Engine website to check your metrics

![image](https://user-images.githubusercontent.com/852069/32006908-4ee587e4-b9a8-11e7-8ca5-28d38038674a.png)

![image](https://user-images.githubusercontent.com/852069/32006961-81139d32-b9a8-11e7-9d45-43d18029421f.png)


### Notes

- Unfortunately, `makeRemoteExecutableSchema` turns every query into a single request to the underlying API (our Graphcool API). This means the metrics will not show any useful data about how your query is actually executed by the Graphcool server. It does, however, give you an overall indication of relative performance.

## Advanced example

The advanced example combines two different endpoints, one with Posts, and one with Comments. Now, the tracing from Apollo Engine becomes a lot more interesting. I selected two different regions to illustrate the difference between the two endpoints.

![image](https://user-images.githubusercontent.com/852069/32010110-2b7566c2-b9b1-11e7-82d5-03fa6a439ab9.png)

- Create a `.env` file in the root of your project folder with the following keys:
  - `GRAPHCOOL_POST_ENDPOINT`
  - `GRAPHCOOL_COMMENT_ENDPOINT`
  - `APOLLO_ENGINE_KEY`

> If you leave out the endpoint keys, it will use two demo endpoints (read-only). If you want to use your own endpoints, use the schemas from the `schemas` folder to set up your endpoints.

- Start with `yarn start:merged` or `npm start:merged`

![image](https://user-images.githubusercontent.com/852069/32010386-f036dde2-b9b1-11e7-8439-2156f59c06ff.png)
