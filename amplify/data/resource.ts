import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Names: a
    .model({
      id: a.id(),
      name: a.string(),
      category: a.string(),
      subCategory: a.string(),
      pythagoreanTotal: a.integer(),
      chaldeanTotal: a.integer(),
      pythagoreanValue: a.integer(),
      chaldeanValue: a.integer(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});