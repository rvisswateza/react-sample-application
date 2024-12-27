import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Names: a
    .model({
      id: a.id(),
      tags: a.string().array(),
      pythagoreanVowels: a.integer().required(),
      chaldeanVowels: a.integer().required(),
      pythagoreanConsonants: a.integer().required(),
      chaldeanConsonants: a.integer().required(),
      pythagoreanTotal: a.integer().required(),
      chaldeanTotal: a.integer().required(),
      pythagoreanActual: a.integer().required(),
      chaldeanActual: a.integer().required(),
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