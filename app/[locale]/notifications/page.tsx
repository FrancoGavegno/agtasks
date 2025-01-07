"use client"

// Amplify
// https://docs.amplify.aws/nextjs/start/connect-to-aws-resources/
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>()

export default async function NotificationsPage() {
    const { data: todos } = await client.models.Todo.list()


    return (
        <div>
            <h2>Notifications</h2>
            <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
        </div>
    )
}
