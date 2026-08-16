/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as constants from "../constants.js";
import type * as http from "../http.js";
import type * as lib_polar from "../lib/polar.js";
import type * as lib_resend from "../lib/resend.js";
import type * as public_documents from "../public/documents.js";
import type * as public_documents_snapshot from "../public/documents_snapshot.js";
import type * as public_subscription from "../public/subscription.js";
import type * as public_user from "../public/user.js";
import type * as system_document from "../system/document.js";
import type * as system_documents_snapshot from "../system/documents_snapshot.js";
import type * as system_subscriptions from "../system/subscriptions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  constants: typeof constants;
  http: typeof http;
  "lib/polar": typeof lib_polar;
  "lib/resend": typeof lib_resend;
  "public/documents": typeof public_documents;
  "public/documents_snapshot": typeof public_documents_snapshot;
  "public/subscription": typeof public_subscription;
  "public/user": typeof public_user;
  "system/document": typeof system_document;
  "system/documents_snapshot": typeof system_documents_snapshot;
  "system/subscriptions": typeof system_subscriptions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
};
