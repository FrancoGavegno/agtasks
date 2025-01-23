"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

interface Props {
  initialProjectRoles: Array<Schema["ProjectRole"]["type"]>;
}

export default function AwsExample({ initialProjectRoles }: Props) {
  const [projectRoles, setProjectRoles] = useState<Array<Schema["ProjectRole"]["type"]>>(initialProjectRoles);

  useEffect(() => {
    // Subscription for real-time updates on ProjectRole
    const subscription = client.models.ProjectRole.observeQuery().subscribe({
      next: (data) => {
        if (JSON.stringify(data.items) !== JSON.stringify(projectRoles)) {
          setProjectRoles([...data.items]);
        }
      },
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, [projectRoles]);

  const createProjectRole = async () => {
    // This is a simplified example. In practice, you'd want to ask for more details like projectId, userId, userRole
    const userRole = window.prompt("Role for the user");
    const projectId = window.prompt("Project ID");
    const userId = window.prompt("User ID");
    if (userRole && projectId && userId) {
      const response = await client.models.ProjectRole.create({ 
        userRole: userRole, 
        projectId: projectId, 
        userId: userId 
      });
      const newProjectRole = response.data as Schema["ProjectRole"]["type"];
      setProjectRoles(prevProjectRoles => [...prevProjectRoles, newProjectRole]);
    }
  };

  return (
    <main>
      <h1>Project Roles</h1>
      <button onClick={createProjectRole}>+ new role</button>
      <ul>
        {projectRoles.map((role) => (
          <li key={role.id}>
            Project: {role.projectId}, User: {role.userId}, Role: {role.userRole}, Status: {role.status} , Created at: {role.createdAt} </li>
        ))}
      </ul>
    </main>
  );
}