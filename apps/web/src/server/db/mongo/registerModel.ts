import mongoose, {
	type InferSchemaType,
	type Model,
	type Schema,
} from "mongoose";

/**
 * Register a Mongoose model, reusing the existing one if already compiled.
 *
 * Vite's SSR module runner re-evaluates modules on HMR, which causes
 * `mongoose.model(name, ...)` to throw `OverwriteModelError`. The mongoose
 * registry persists across re-evaluations, so we return the existing model
 * when one is already registered under `name`.
 */
export function registerModel<TSchema extends Schema>(
	name: string,
	schema: TSchema,
): Model<InferSchemaType<TSchema>> {
	return (
		(mongoose.models[name] as Model<InferSchemaType<TSchema>> | undefined) ??
		mongoose.model<InferSchemaType<TSchema>>(name, schema)
	);
}
