// Mongoose models are defined per collection in sibling files. The mongo
// connection itself lives in ../mongo.ts; this directory only holds schemas.
export {
	type SampleDoc,
	SampleDocument,
	sampleQualitySchema,
	sampleSchema,
	sampleWorkflowsSchema,
} from "./samples";
