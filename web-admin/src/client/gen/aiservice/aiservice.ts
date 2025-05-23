/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * rill/admin/v1/ai.proto
 * OpenAPI spec version: version not set
 */
import { createMutation } from "@tanstack/svelte-query";
import type {
  CreateMutationOptions,
  CreateMutationResult,
  MutationFunction,
  QueryClient,
} from "@tanstack/svelte-query";

import type {
  RpcStatus,
  V1CompleteRequest,
  V1CompleteResponse,
} from "../index.schemas";

import { httpClient } from "../../http-client";

type AwaitedInput<T> = PromiseLike<T> | T;

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

/**
 * @summary Complete sends the messages of a chat to the AI and asks it to generate a new message.
 */
export const aIServiceComplete = (
  v1CompleteRequest: V1CompleteRequest,
  signal?: AbortSignal,
) => {
  return httpClient<V1CompleteResponse>({
    url: `/v1/ai/complete`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: v1CompleteRequest,
    signal,
  });
};

export const getAIServiceCompleteMutationOptions = <
  TError = RpcStatus,
  TContext = unknown,
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof aIServiceComplete>>,
    TError,
    { data: V1CompleteRequest },
    TContext
  >;
}): CreateMutationOptions<
  Awaited<ReturnType<typeof aIServiceComplete>>,
  TError,
  { data: V1CompleteRequest },
  TContext
> => {
  const mutationKey = ["aIServiceComplete"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof aIServiceComplete>>,
    { data: V1CompleteRequest }
  > = (props) => {
    const { data } = props ?? {};

    return aIServiceComplete(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type AIServiceCompleteMutationResult = NonNullable<
  Awaited<ReturnType<typeof aIServiceComplete>>
>;
export type AIServiceCompleteMutationBody = V1CompleteRequest;
export type AIServiceCompleteMutationError = RpcStatus;

/**
 * @summary Complete sends the messages of a chat to the AI and asks it to generate a new message.
 */
export const createAIServiceComplete = <TError = RpcStatus, TContext = unknown>(
  options?: {
    mutation?: CreateMutationOptions<
      Awaited<ReturnType<typeof aIServiceComplete>>,
      TError,
      { data: V1CompleteRequest },
      TContext
    >;
  },
  queryClient?: QueryClient,
): CreateMutationResult<
  Awaited<ReturnType<typeof aIServiceComplete>>,
  TError,
  { data: V1CompleteRequest },
  TContext
> => {
  const mutationOptions = getAIServiceCompleteMutationOptions(options);

  return createMutation(mutationOptions, queryClient);
};
