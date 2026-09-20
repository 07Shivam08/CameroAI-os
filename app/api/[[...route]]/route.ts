import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import organization from "./oraganizatoin";
import user from "./user";
import branch from "./branch";
// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const route = app
  .route("/organization", organization)
  .route("/user", user)
  .route("/branch", branch);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
