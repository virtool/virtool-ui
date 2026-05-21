import { type InferSchemaType, Schema } from "mongoose";
import { registerModel } from "./registerModel";

const jobRefSchema = new Schema(
	{ id: { type: String, required: true } },
	{ _id: false },
);

const userRefSchema = new Schema(
	{ id: { type: Number, required: true } },
	{ _id: false },
);

const uploadRefSchema = new Schema(
	{ id: { type: Number, required: true } },
	{ _id: false },
);

export const sampleQualitySchema = new Schema(
	{
		bases: { type: [[Number]], required: true },
		composition: { type: [[Number]], required: true },
		count: { type: Number, required: true },
		encoding: { type: String, required: true },
		gc: { type: Number, required: true },
		length: { type: [Number], required: true },
		sequences: { type: [Number], required: true },
	},
	{ _id: false },
);

export const sampleWorkflowsSchema = new Schema(
	{
		aodp: { type: String, required: true },
		iimi: { type: String, required: true },
		nuvs: { type: String, required: true },
		pathoscope: { type: String, required: true },
	},
	{ _id: false },
);

export const sampleSchema = new Schema(
	{
		_id: { type: String, required: true },
		all_read: { type: Boolean, required: true },
		all_write: { type: Boolean, required: true },
		created_at: { type: Date, required: true },
		format: { type: String, required: true },
		group: { type: Schema.Types.Mixed, default: null },
		group_read: { type: Boolean, required: true },
		group_write: { type: Boolean, required: true },
		hold: { type: Boolean, required: true },
		host: { type: String, default: "" },
		isolate: { type: String, default: "" },
		job: { type: jobRefSchema, default: null },
		labels: { type: [Number], required: true },
		library_type: { type: String, required: true },
		locale: { type: String, default: "" },
		name: { type: String, required: true },
		notes: { type: String, default: "" },
		paired: { type: Boolean, required: true },
		quality: { type: sampleQualitySchema, default: null },
		ready: { type: Boolean, required: true },
		results: { type: Schema.Types.Mixed, default: null },
		subtractions: { type: [String], required: true },
		uploads: { type: [uploadRefSchema] },
		user: { type: userRefSchema, required: true },
		workflows: { type: sampleWorkflowsSchema, required: true },
	},
	{
		collection: "samples",
		strict: false,
		versionKey: false,
		timestamps: false,
	},
);

/** Mongoose-inferred shape of a `samples` document. */
export type SampleDoc = InferSchemaType<typeof sampleSchema>;

export const SampleDocument = registerModel("Sample", sampleSchema);
