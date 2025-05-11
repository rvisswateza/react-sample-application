import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Names: a
    .model({
      id: a.id().required(),
      tags: a.string().array().required(),
      pythagoreanVowels: a.integer().required(),
      chaldeanVowels: a.integer().required(),
      pythagoreanConsonants: a.integer().required(),
      chaldeanConsonants: a.integer().required(),
      pythagoreanTotal: a.integer().required(),
      chaldeanTotal: a.integer().required(),
      pythagoreanActual: a.integer().required(),
      chaldeanActual: a.integer().required(),
      letterCount: a.integer().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  Tags: a.model({
    id: a.id().required(),
    name: a.string().required(),
    display: a.boolean().default(false),
  })
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