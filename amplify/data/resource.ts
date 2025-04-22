import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
// import { Visibility } from "aws-cdk-lib/aws-appsync";
import { parseISO } from 'date-fns';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a
  .schema({
    Role: a.model({
      name: a.string().required(),
    }),

    Domain: a.model({
      name: a.string().required(),
      protocols: a.hasMany('DomainProtocol', 'domainId'),
      roles: a.hasMany('DomainRole', 'domainId'),
      forms: a.hasMany('DomainForm', 'domainId'),
    }),

    DomainProtocol: a.model({
      name: a.string().required(),
      language: a.string().required(),
      tmProtocolId: a.string().required(), // The ID or Key of the customer request 
      domainId: a.id(),
      domain: a.belongsTo('Domain', 'domainId')
    }),

    DomainRole: a.model({
      name: a.string().required(),    
      domainId: a.id(),
      domain: a.belongsTo('Domain', 'domainId')
    }),

    DomainForm: a.model({
      name: a.string().required(),
      ktFormId: a.string().required(),
      domainId: a.id(),
      domain: a.belongsTo('Domain', 'domainId')
    }),
    
    
    // Todo: a.model({
    //   content: a.string(),
    //   isDone: a.boolean().default(true),
    // }),

    // Visibility: a.enum([
    //   "COMMUNITY",
    //   "PRIVATE"
    // ]),

    // Scope: a.enum([
    //   "NONE",
    //   "INHERITED",
    //   "DOMAIN",
    //   "AREA",
    //   "WORKSPACE",
    //   "FARM",
    //   "FIELD"
    // ]),

    // Template: a.model({
    //   id: a.id().required(),
    //   templateUrl: a.url().required(),
    //   name: a.string().required(),
    //   description: a.string(),
    //   taskCount: a.integer(),
    //   space: a.string(),
    //   tags: a.string().array(),
    //   visibility: a.ref("Visibility").required(),
    //   thumbnail: a.string(),
    //   scope: a.ref("Scope"),
    // }),

    // ProjectRole: a.model({
    //   id: a.id().required(),
    //   projectId: a.string(),
    //   projectName: a.string(),
    //   userId: a.string().required(),
    //   userName: a.string(),
    //   userEmail: a.email(),
    //   roleId: a.string(),
    //   roleName: a.string().required(),
    //   status: a.string().default("ACTIVE"),
    // }),

    // TaskManagerConfig: a.model({
    //   apiKey: a.string(),
    //   teamId: a.string(),
    // })

  })
  .authorization((allow) => [allow.publicApiKey()]);

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

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
