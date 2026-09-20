"use client";
import React from "react";
import { useOrgCreateStore } from "./CreateorgStateProvider";
import { CreateAccountForm } from "./createAccountForm";
import CreateOrganization from "./create-organisation";
 
 

export default function OrgFormhandeler() {
  const { position } = useOrgCreateStore();
  switch (position) {
    case 0:
      return <CreateAccountForm />;

    case 1:
      return <CreateOrganization />;
    default:
      return (
        <>
          <h1>some thing went wrong</h1>
        </>
      );
  }
}
