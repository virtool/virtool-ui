import { z } from "zod";

/**
 * A row id. Every id the server accepts is a Postgres serial primary key, so
 * one definition covers them all — validators name the field
 * (`referenceId: rowIdSchema`) and reuse this for the value.
 */
export const rowIdSchema = z.number().int().positive();

/** The page number a paginated server function accepts. */
export const pageSchema = z.number().int().positive().default(1);

/**
 * The page size a paginated server function accepts, capped so a caller cannot
 * ask for an unbounded page.
 */
export const perPageSchema = z.number().int().positive().max(100).default(25);
