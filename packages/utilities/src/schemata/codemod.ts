import * as v from "valibot";

import { argumentRecordSchema } from "./argument-record.js";
import {
  knownEnginesCodemodConfigSchema,
  recipeCodemodConfigSchema,
} from "./codemod-config.js";
import { engineOptionsSchema } from "./engine-options.js";
import type { FileCommand } from "./file-commands.js";

export const codemodSchemaBase = v.object({
  $schema: v.optional(v.string()),
  path: v.string(),
  source: v.union([v.literal("local"), v.literal("remote")]),
  type: v.union([v.literal("standalone"), v.literal("package")]),
  safeArgumentRecord: v.optional(argumentRecordSchema, {}),
  engineOptions: v.optional(v.nullable(engineOptionsSchema), null),
});

export const knownEnginesCodemodSchema = v.object({
  ...codemodSchemaBase.entries,
  ...v.object({ config: knownEnginesCodemodConfigSchema }).entries,
});

export const recipeCodemodSchema = v.object({
  ...codemodSchemaBase.entries,
  ...v.object({
    config: recipeCodemodConfigSchema,
    codemods: v.optional(v.array(knownEnginesCodemodSchema), []),
  }).entries,
});

export const codemodSchema = v.union([
  knownEnginesCodemodSchema,
  recipeCodemodSchema,
]);

export const parseKnownEnginesCodemod = (codemod: unknown) =>
  v.parse(knownEnginesCodemodSchema, codemod);
export const safeParseKnownEnginesCodemod = (codemod: unknown) =>
  v.safeParse(knownEnginesCodemodSchema, codemod);
export const isKnownEnginesCodemod = (codemod: unknown) =>
  v.is(knownEnginesCodemodSchema, codemod);

export const parseRecipeCodemod = (codemod: unknown) =>
  v.parse(recipeCodemodSchema, codemod);
export const safeParseRecipeCodemod = (codemod: unknown) =>
  v.safeParse(recipeCodemodSchema, codemod);
export const isRecipeCodemod = (codemod: unknown) =>
  v.is(recipeCodemodSchema, codemod);

export const parseCodemod = (codemod: unknown) =>
  v.parse(codemodSchema, codemod);
export const safeParseCodemod = (codemod: unknown) =>
  v.safeParse(codemodSchema, codemod);
export const isCodemod = (codemod: unknown) => v.is(codemodSchema, codemod);

export type Codemod = v.InferOutput<typeof codemodSchema>;
export type RecipeCodemod = v.InferOutput<typeof recipeCodemodSchema>;
export type KnownEnginesCodemod = v.InferOutput<
  typeof knownEnginesCodemodSchema
>;

export type CodemodValidationInput = v.InferInput<typeof codemodSchema>;
export type RecipeCodemodValidationInput = v.InferInput<
  typeof recipeCodemodSchema
>;
export type KnownEnginesCodemodValidationInput = v.InferInput<
  typeof knownEnginesCodemodSchema
>;

export type RunResult = {
  codemod: Codemod;
  output: unknown;
  commands: FileCommand[];
};
