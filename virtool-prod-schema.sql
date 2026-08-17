--
-- PostgreSQL database dump
--

\restrict OszgcW4caSwEXFNGFprmSfWDX0bS2cKuc6OpVgSgGHI7Wb2FBVmQvOoR7yfdtI0

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.6 (Debian 18.6-1.pgdg12+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: action; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.action AS ENUM (
    'create',
    'update',
    'delete',
    'modify',
    'remove'
);


--
-- Name: analysisformat; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.analysisformat AS ENUM (
    'sam',
    'bam',
    'fasta',
    'fastq',
    'csv',
    'tsv',
    'json'
);


--
-- Name: resourcetype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.resourcetype AS ENUM (
    'app',
    'group'
);


--
-- Name: subtractiontype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subtractiontype AS ENUM (
    'fasta',
    'bowtie2'
);


--
-- Name: sync_instance_messages_user_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_instance_messages_user_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    resolved_id INTEGER;
BEGIN
    IF NEW."user" IS NULL THEN
        RETURN NEW;
    END IF;

    IF NEW."user" ~ '^[0-9]+$' THEN
        SELECT id INTO resolved_id FROM users WHERE id = NEW."user"::int;
    END IF;

    IF resolved_id IS NULL THEN
        SELECT id INTO resolved_id FROM users WHERE legacy_id = NEW."user";
    END IF;

    IF resolved_id IS NULL THEN
        RAISE EXCEPTION
            'instance_messages."user" value % does not resolve to a users row',
            NEW."user";
    END IF;

    NEW.user_id := resolved_id;
    RETURN NEW;
END;
$_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analyses (
    legacy_id character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    workflow character varying NOT NULL,
    ready boolean NOT NULL,
    results jsonb,
    sample character varying NOT NULL,
    reference character varying,
    index character varying,
    user_id integer NOT NULL,
    job_id integer,
    id bigint NOT NULL,
    sample_id bigint,
    reference_id bigint,
    index_id bigint NOT NULL,
    CONSTRAINT ck_analyses_reference_present CHECK ((num_nonnulls(reference, reference_id) >= 1))
);


--
-- Name: analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.analyses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.analyses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: analysis_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_files (
    id integer NOT NULL,
    description character varying,
    format public.analysisformat,
    name character varying,
    name_on_disk character varying,
    size bigint,
    uploaded_at timestamp without time zone,
    analysis_id bigint NOT NULL,
    storage_key character varying
);


--
-- Name: analysis_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analysis_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analysis_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analysis_files_id_seq OWNED BY public.analysis_files.id;


--
-- Name: analysis_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_results (
    id integer NOT NULL,
    analysis_id character varying NOT NULL,
    results jsonb NOT NULL
);


--
-- Name: analysis_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analysis_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analysis_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analysis_results_id_seq OWNED BY public.analysis_results.id;


--
-- Name: analysis_subtractions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_subtractions (
    analysis_id bigint NOT NULL,
    subtraction_id bigint NOT NULL
);


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    hashed character varying NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    user_id integer NOT NULL,
    permissions jsonb NOT NULL
);


--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: caches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.caches (
    id integer NOT NULL,
    key character varying NOT NULL,
    storage_key character varying NOT NULL,
    params jsonb NOT NULL,
    size bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    last_accessed_at timestamp without time zone NOT NULL
);


--
-- Name: caches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.caches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: caches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.caches_id_seq OWNED BY public.caches.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    legacy_id character varying,
    permissions jsonb NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: legacy_history_diff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_history_diff (
    id integer CONSTRAINT history_diffs_id_not_null NOT NULL,
    change_id character varying CONSTRAINT history_diffs_change_id_not_null NOT NULL,
    diff jsonb CONSTRAINT history_diffs_diff_not_null NOT NULL,
    history_id bigint
);


--
-- Name: history_diffs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.history_diffs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: history_diffs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.history_diffs_id_seq OWNED BY public.legacy_history_diff.id;


--
-- Name: hmms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hmms (
    id bigint NOT NULL,
    legacy_id character varying,
    cluster integer NOT NULL,
    count integer NOT NULL,
    length integer NOT NULL,
    mean_entropy double precision NOT NULL,
    total_entropy double precision NOT NULL,
    hidden boolean NOT NULL,
    names jsonb NOT NULL,
    families jsonb NOT NULL,
    genera jsonb NOT NULL,
    entries jsonb NOT NULL
);


--
-- Name: hmms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hmms ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hmms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: index_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.index_files (
    id integer NOT NULL,
    name character varying NOT NULL,
    index character varying,
    type text,
    size bigint,
    index_id bigint NOT NULL,
    storage_key character varying NOT NULL,
    CONSTRAINT ck_index_files_type CHECK ((type = ANY (ARRAY['json'::text, 'fasta'::text, 'bowtie2'::text, 'sqlite'::text])))
);


--
-- Name: index_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.index_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: index_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.index_files_id_seq OWNED BY public.index_files.id;


--
-- Name: indexes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.indexes (
    id bigint NOT NULL,
    legacy_id character varying,
    version integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    manifest jsonb NOT NULL,
    ready boolean NOT NULL,
    storage_key character varying NOT NULL,
    reference_id bigint NOT NULL,
    user_id integer NOT NULL,
    job_id integer,
    task_id integer,
    otus_json_storage_key character varying,
    CONSTRAINT ck_indexes_job_or_task CHECK ((num_nonnulls(job_id, task_id) <= 1))
);


--
-- Name: indexes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.indexes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.indexes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: instance_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instance_messages (
    id integer NOT NULL,
    active boolean,
    color text NOT NULL,
    message character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    "user" character varying,
    user_id integer,
    CONSTRAINT ck_instance_messages_color CHECK ((color = ANY (ARRAY['red'::text, 'yellow'::text, 'blue'::text, 'purple'::text, 'orange'::text, 'grey'::text])))
);


--
-- Name: instance_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.instance_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: instance_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.instance_messages_id_seq OWNED BY public.instance_messages.id;


--
-- Name: job_analyses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_analyses (
    job_id integer NOT NULL,
    analysis_id character varying NOT NULL
);


--
-- Name: job_indexes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_indexes (
    job_id integer NOT NULL,
    index_id character varying NOT NULL
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    acquired boolean DEFAULT false NOT NULL,
    claim jsonb,
    claimed_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    finished_at timestamp without time zone,
    key character varying,
    legacy_id character varying,
    pinged_at timestamp without time zone,
    state character varying NOT NULL,
    steps jsonb,
    user_id integer NOT NULL,
    workflow character varying NOT NULL,
    CONSTRAINT ck_jobs_state CHECK (((state)::text = ANY (ARRAY[('pending'::character varying)::text, ('running'::character varying)::text, ('cancelled'::character varying)::text, ('failed'::character varying)::text, ('succeeded'::character varying)::text])))
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.labels (
    id integer NOT NULL,
    name character varying,
    color character varying(7),
    description character varying
);


--
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.labels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.labels_id_seq OWNED BY public.labels.id;


--
-- Name: legacy_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_history (
    id bigint NOT NULL,
    legacy_id character varying,
    created_at timestamp without time zone NOT NULL,
    description character varying NOT NULL,
    method_name character varying NOT NULL,
    user_id integer NOT NULL,
    otu character varying CONSTRAINT legacy_history_otu_id_not_null NOT NULL,
    otu_name character varying NOT NULL,
    otu_version character varying,
    reference character varying,
    index character varying,
    reference_id bigint,
    index_id bigint
);


--
-- Name: legacy_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.legacy_history ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.legacy_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: legacy_hmm_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_hmm_status (
    id integer NOT NULL,
    errors jsonb NOT NULL,
    release jsonb,
    installed jsonb,
    task_id integer,
    updates jsonb NOT NULL,
    CONSTRAINT ck_legacy_hmm_status_singleton CHECK ((id = 1))
);


--
-- Name: legacy_otus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_otus (
    id character varying NOT NULL,
    data jsonb NOT NULL,
    name character varying NOT NULL,
    abbreviation character varying NOT NULL,
    reference_id bigint NOT NULL,
    verified boolean NOT NULL,
    version integer NOT NULL,
    last_indexed_version integer
);


--
-- Name: legacy_reference_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_reference_groups (
    reference_id bigint NOT NULL,
    group_id integer NOT NULL,
    build boolean NOT NULL,
    modify boolean NOT NULL,
    modify_otu boolean NOT NULL
);


--
-- Name: legacy_reference_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_reference_users (
    reference_id bigint NOT NULL,
    user_id integer NOT NULL,
    build boolean NOT NULL,
    modify boolean NOT NULL,
    modify_otu boolean NOT NULL
);


--
-- Name: legacy_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_references (
    id bigint NOT NULL,
    legacy_id character varying,
    name character varying NOT NULL,
    description character varying NOT NULL,
    organism character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    archived boolean NOT NULL,
    restrict_source_types boolean NOT NULL,
    source_types jsonb NOT NULL,
    user_id integer NOT NULL,
    upload_id integer,
    cloned_from_id bigint,
    task_id integer
);


--
-- Name: legacy_references_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.legacy_references ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.legacy_references_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: legacy_sample_labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_sample_labels (
    sample_id bigint NOT NULL,
    label_id integer NOT NULL
);


--
-- Name: legacy_sample_subtractions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_sample_subtractions (
    sample_id bigint NOT NULL,
    subtraction_id bigint NOT NULL
);


--
-- Name: legacy_samples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_samples (
    id bigint NOT NULL,
    legacy_id character varying,
    name character varying NOT NULL,
    host character varying NOT NULL,
    isolate character varying NOT NULL,
    locale character varying NOT NULL,
    notes character varying NOT NULL,
    library_type character varying NOT NULL,
    format character varying NOT NULL,
    group_id integer,
    quality jsonb,
    created_at timestamp without time zone NOT NULL,
    paired boolean NOT NULL,
    ready boolean NOT NULL,
    hold boolean NOT NULL,
    is_legacy boolean NOT NULL,
    all_read boolean NOT NULL,
    all_write boolean NOT NULL,
    group_read boolean NOT NULL,
    group_write boolean NOT NULL,
    user_id integer,
    job_id integer
);


--
-- Name: legacy_samples_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.legacy_samples ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.legacy_samples_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: legacy_sequences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_sequences (
    id character varying NOT NULL,
    data jsonb NOT NULL,
    otu_id character varying NOT NULL,
    isolate_id character varying NOT NULL,
    segment character varying,
    "position" bigint
);


--
-- Name: nuvs_blast; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nuvs_blast (
    id integer NOT NULL,
    sequence_index integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    last_checked_at timestamp without time zone NOT NULL,
    error character varying,
    "interval" integer,
    rid character varying(24),
    ready boolean NOT NULL,
    result json,
    task_id integer,
    analysis_id bigint CONSTRAINT nuvs_blast_analysis_id_int_not_null NOT NULL
);


--
-- Name: nuvs_blast_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nuvs_blast_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nuvs_blast_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nuvs_blast_id_seq OWNED BY public.nuvs_blast.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id character varying NOT NULL,
    name character varying,
    description character varying,
    resource_type public.resourcetype,
    action public.action
);


--
-- Name: revisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revisions (
    id integer NOT NULL,
    name character varying NOT NULL,
    revision character varying,
    created_at timestamp without time zone NOT NULL,
    applied_at timestamp without time zone NOT NULL
);


--
-- Name: revisions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.revisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: revisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.revisions_id_seq OWNED BY public.revisions.id;


--
-- Name: sample_reads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sample_reads (
    id integer NOT NULL,
    sample character varying NOT NULL,
    name character varying(13) NOT NULL,
    name_on_disk character varying NOT NULL,
    size bigint,
    upload integer,
    uploaded_at timestamp without time zone,
    sample_id bigint,
    storage_key character varying NOT NULL
);


--
-- Name: sample_reads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sample_reads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sample_reads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sample_reads_id_seq OWNED BY public.sample_reads.id;


--
-- Name: sample_uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sample_uploads (
    id bigint NOT NULL,
    sample character varying NOT NULL,
    sample_id bigint,
    upload_id integer NOT NULL,
    index integer NOT NULL
);


--
-- Name: sample_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.sample_uploads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sample_uploads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    session_id character varying NOT NULL,
    user_id integer,
    ip character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    token_hash character varying,
    reset_code character varying,
    reset_remember boolean,
    session_type text NOT NULL,
    CONSTRAINT session_type_valid CHECK ((session_type = ANY (ARRAY['anonymous'::text, 'authenticated'::text, 'reset'::text])))
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    default_source_types jsonb NOT NULL,
    enable_api boolean NOT NULL,
    enable_sentry boolean NOT NULL,
    minimum_password_length integer NOT NULL,
    sample_all_read boolean NOT NULL,
    sample_all_write boolean NOT NULL,
    sample_group character varying NOT NULL,
    sample_group_read boolean NOT NULL,
    sample_group_write boolean NOT NULL,
    CONSTRAINT ck_settings_sample_group CHECK (((sample_group)::text = ANY ((ARRAY['none'::character varying, 'force_choice'::character varying, 'users_primary_group'::character varying])::text[]))),
    CONSTRAINT ck_settings_singleton CHECK ((id = 1))
);


--
-- Name: subtraction_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subtraction_files (
    id integer NOT NULL,
    name character varying,
    type public.subtractiontype,
    size bigint,
    subtraction_id bigint NOT NULL,
    storage_key character varying
);


--
-- Name: subtraction_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subtraction_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subtraction_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subtraction_files_id_seq OWNED BY public.subtraction_files.id;


--
-- Name: subtractions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subtractions (
    id bigint NOT NULL,
    legacy_id character varying,
    name character varying NOT NULL,
    nickname character varying NOT NULL,
    count integer,
    gc jsonb,
    created_at timestamp without time zone NOT NULL,
    deleted boolean NOT NULL,
    ready boolean NOT NULL,
    user_id integer,
    job_id integer,
    upload_id integer
);


--
-- Name: subtractions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.subtractions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.subtractions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    complete boolean,
    context jsonb,
    count integer,
    created_at timestamp without time zone NOT NULL,
    error character varying,
    file_size bigint,
    progress integer,
    step character varying,
    type character varying NOT NULL,
    acquired_at timestamp without time zone,
    runner_id character varying(255)
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.uploads (
    id integer NOT NULL,
    created_at timestamp without time zone,
    name character varying,
    name_on_disk character varying,
    ready boolean NOT NULL,
    removed boolean NOT NULL,
    removed_at timestamp without time zone,
    reserved boolean NOT NULL,
    size bigint,
    type text,
    uploaded_at timestamp without time zone,
    user_id integer NOT NULL,
    storage_key character varying,
    CONSTRAINT ck_uploads_type CHECK ((type = ANY (ARRAY['reference'::text, 'reads'::text, 'subtraction'::text])))
);


--
-- Name: uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.uploads_id_seq OWNED BY public.uploads.id;


--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_groups (
    group_id integer NOT NULL,
    "primary" boolean NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    legacy_id character varying,
    active boolean NOT NULL,
    force_reset boolean NOT NULL,
    handle character varying NOT NULL,
    last_password_change timestamp without time zone NOT NULL,
    password bytea NOT NULL,
    settings jsonb NOT NULL,
    email character varying NOT NULL,
    administrator_role text,
    CONSTRAINT administrator_role_valid CHECK ((administrator_role = ANY (ARRAY['full'::text, 'settings'::text, 'users'::text, 'base'::text])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: analysis_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_files ALTER COLUMN id SET DEFAULT nextval('public.analysis_files_id_seq'::regclass);


--
-- Name: analysis_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_results ALTER COLUMN id SET DEFAULT nextval('public.analysis_results_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: caches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.caches ALTER COLUMN id SET DEFAULT nextval('public.caches_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: index_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.index_files ALTER COLUMN id SET DEFAULT nextval('public.index_files_id_seq'::regclass);


--
-- Name: instance_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instance_messages ALTER COLUMN id SET DEFAULT nextval('public.instance_messages_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels ALTER COLUMN id SET DEFAULT nextval('public.labels_id_seq'::regclass);


--
-- Name: legacy_history_diff id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history_diff ALTER COLUMN id SET DEFAULT nextval('public.history_diffs_id_seq'::regclass);


--
-- Name: nuvs_blast id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuvs_blast ALTER COLUMN id SET DEFAULT nextval('public.nuvs_blast_id_seq'::regclass);


--
-- Name: revisions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revisions ALTER COLUMN id SET DEFAULT nextval('public.revisions_id_seq'::regclass);


--
-- Name: sample_reads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_reads ALTER COLUMN id SET DEFAULT nextval('public.sample_reads_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: subtraction_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtraction_files ALTER COLUMN id SET DEFAULT nextval('public.subtraction_files_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: uploads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads ALTER COLUMN id SET DEFAULT nextval('public.uploads_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: analyses analyses_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_legacy_id_key UNIQUE (legacy_id);


--
-- Name: analyses analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_pkey PRIMARY KEY (id);


--
-- Name: analysis_files analysis_files_name_on_disk_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_files
    ADD CONSTRAINT analysis_files_name_on_disk_key UNIQUE (name_on_disk);


--
-- Name: analysis_files analysis_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_files
    ADD CONSTRAINT analysis_files_pkey PRIMARY KEY (id);


--
-- Name: analysis_results analysis_results_analysis_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_results
    ADD CONSTRAINT analysis_results_analysis_id_key UNIQUE (analysis_id);


--
-- Name: analysis_results analysis_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_results
    ADD CONSTRAINT analysis_results_pkey PRIMARY KEY (id);


--
-- Name: analysis_subtractions analysis_subtractions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_subtractions
    ADD CONSTRAINT analysis_subtractions_pkey PRIMARY KEY (analysis_id, subtraction_id);


--
-- Name: api_keys api_keys_hashed_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_hashed_key UNIQUE (hashed);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: caches cache_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.caches
    ADD CONSTRAINT cache_key UNIQUE (key);


--
-- Name: caches caches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.caches
    ADD CONSTRAINT caches_pkey PRIMARY KEY (id);


--
-- Name: caches caches_storage_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.caches
    ADD CONSTRAINT caches_storage_key_key UNIQUE (storage_key);


--
-- Name: groups groups_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_legacy_id_key UNIQUE (legacy_id);


--
-- Name: groups groups_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_name_unique UNIQUE (name);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: legacy_history_diff history_diffs_change_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history_diff
    ADD CONSTRAINT history_diffs_change_id_key UNIQUE (change_id);


--
-- Name: legacy_history_diff history_diffs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history_diff
    ADD CONSTRAINT history_diffs_pkey PRIMARY KEY (id);


--
-- Name: hmms hmms_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hmms
    ADD CONSTRAINT hmms_legacy_id_key UNIQUE (legacy_id);


--
-- Name: hmms hmms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hmms
    ADD CONSTRAINT hmms_pkey PRIMARY KEY (id);


--
-- Name: index_files index_files_index_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.index_files
    ADD CONSTRAINT index_files_index_id_name_key UNIQUE (index_id, name);


--
-- Name: index_files index_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.index_files
    ADD CONSTRAINT index_files_pkey PRIMARY KEY (id);


--
-- Name: indexes indexes_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT indexes_legacy_id_key UNIQUE (legacy_id);


--
-- Name: indexes indexes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT indexes_pkey PRIMARY KEY (id);


--
-- Name: indexes indexes_storage_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT indexes_storage_key_key UNIQUE (storage_key);


--
-- Name: instance_messages instance_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instance_messages
    ADD CONSTRAINT instance_messages_pkey PRIMARY KEY (id);


--
-- Name: job_analyses job_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_analyses
    ADD CONSTRAINT job_analyses_pkey PRIMARY KEY (job_id);


--
-- Name: job_indexes job_indexes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_indexes
    ADD CONSTRAINT job_indexes_pkey PRIMARY KEY (job_id);


--
-- Name: jobs jobs_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_legacy_id_key UNIQUE (legacy_id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: labels labels_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_name_key UNIQUE (name);


--
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- Name: legacy_history_diff legacy_history_diff_history_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history_diff
    ADD CONSTRAINT legacy_history_diff_history_id_key UNIQUE (history_id);


--
-- Name: legacy_history legacy_history_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history
    ADD CONSTRAINT legacy_history_legacy_id_key UNIQUE (legacy_id);


--
-- Name: legacy_history legacy_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history
    ADD CONSTRAINT legacy_history_pkey PRIMARY KEY (id);


--
-- Name: legacy_hmm_status legacy_hmm_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_hmm_status
    ADD CONSTRAINT legacy_hmm_status_pkey PRIMARY KEY (id);


--
-- Name: legacy_otus legacy_otus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_otus
    ADD CONSTRAINT legacy_otus_pkey PRIMARY KEY (id);


--
-- Name: legacy_reference_groups legacy_reference_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_reference_groups
    ADD CONSTRAINT legacy_reference_groups_pkey PRIMARY KEY (reference_id, group_id);


--
-- Name: legacy_reference_users legacy_reference_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_reference_users
    ADD CONSTRAINT legacy_reference_users_pkey PRIMARY KEY (reference_id, user_id);


--
-- Name: legacy_references legacy_references_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_references
    ADD CONSTRAINT legacy_references_legacy_id_key UNIQUE (legacy_id);


--
-- Name: legacy_references legacy_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_references
    ADD CONSTRAINT legacy_references_pkey PRIMARY KEY (id);


--
-- Name: legacy_sample_labels legacy_sample_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sample_labels
    ADD CONSTRAINT legacy_sample_labels_pkey PRIMARY KEY (sample_id, label_id);


--
-- Name: legacy_sample_subtractions legacy_sample_subtractions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sample_subtractions
    ADD CONSTRAINT legacy_sample_subtractions_pkey PRIMARY KEY (sample_id, subtraction_id);


--
-- Name: legacy_samples legacy_samples_job_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_samples
    ADD CONSTRAINT legacy_samples_job_id_key UNIQUE (job_id);


--
-- Name: legacy_samples legacy_samples_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_samples
    ADD CONSTRAINT legacy_samples_legacy_id_key UNIQUE (legacy_id);


--
-- Name: legacy_samples legacy_samples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_samples
    ADD CONSTRAINT legacy_samples_pkey PRIMARY KEY (id);


--
-- Name: legacy_sequences legacy_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sequences
    ADD CONSTRAINT legacy_sequences_pkey PRIMARY KEY (id);


--
-- Name: nuvs_blast nuvs_blast_analysis_id_sequence_index_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuvs_blast
    ADD CONSTRAINT nuvs_blast_analysis_id_sequence_index_key UNIQUE (analysis_id, sequence_index);


--
-- Name: nuvs_blast nuvs_blast_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuvs_blast
    ADD CONSTRAINT nuvs_blast_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: revisions revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revisions
    ADD CONSTRAINT revisions_pkey PRIMARY KEY (id);


--
-- Name: revisions revisions_revision_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revisions
    ADD CONSTRAINT revisions_revision_key UNIQUE (revision);


--
-- Name: sample_reads sample_reads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_reads
    ADD CONSTRAINT sample_reads_pkey PRIMARY KEY (id);


--
-- Name: sample_reads sample_reads_sample_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_reads
    ADD CONSTRAINT sample_reads_sample_id_name_key UNIQUE (sample_id, name);


--
-- Name: sample_reads sample_reads_sample_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_reads
    ADD CONSTRAINT sample_reads_sample_name_key UNIQUE (sample, name);


--
-- Name: sample_uploads sample_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_uploads
    ADD CONSTRAINT sample_uploads_pkey PRIMARY KEY (id);


--
-- Name: sample_uploads sample_uploads_upload_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_uploads
    ADD CONSTRAINT sample_uploads_upload_id_key UNIQUE (upload_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_id_key UNIQUE (session_id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: subtraction_files subtraction_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtraction_files
    ADD CONSTRAINT subtraction_files_pkey PRIMARY KEY (id);


--
-- Name: subtraction_files subtraction_files_subtraction_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtraction_files
    ADD CONSTRAINT subtraction_files_subtraction_id_name_key UNIQUE (subtraction_id, name);


--
-- Name: subtractions subtractions_job_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtractions
    ADD CONSTRAINT subtractions_job_id_key UNIQUE (job_id);


--
-- Name: subtractions subtractions_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtractions
    ADD CONSTRAINT subtractions_legacy_id_key UNIQUE (legacy_id);


--
-- Name: subtractions subtractions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtractions
    ADD CONSTRAINT subtractions_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: uploads uploads_name_on_disk_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_name_on_disk_key UNIQUE (name_on_disk);


--
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (id);


--
-- Name: analysis_files uq_analysis_files_storage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_files
    ADD CONSTRAINT uq_analysis_files_storage_key UNIQUE (storage_key);


--
-- Name: index_files uq_index_files_storage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.index_files
    ADD CONSTRAINT uq_index_files_storage_key UNIQUE (storage_key);


--
-- Name: indexes uq_indexes_otus_json_storage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT uq_indexes_otus_json_storage_key UNIQUE (otus_json_storage_key);


--
-- Name: indexes uq_indexes_reference_id_version; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT uq_indexes_reference_id_version UNIQUE (reference_id, version);


--
-- Name: sample_reads uq_sample_reads_storage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_reads
    ADD CONSTRAINT uq_sample_reads_storage_key UNIQUE (storage_key);


--
-- Name: subtraction_files uq_subtraction_files_storage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtraction_files
    ADD CONSTRAINT uq_subtraction_files_storage_key UNIQUE (storage_key);


--
-- Name: uploads uq_uploads_storage_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uq_uploads_storage_key UNIQUE (storage_key);


--
-- Name: user_groups user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (group_id, user_id);


--
-- Name: users users_legacy_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_legacy_id_key UNIQUE (legacy_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_api_keys_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_keys_user_id ON public.api_keys USING btree (user_id);


--
-- Name: idx_sessions_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_expires_at ON public.sessions USING btree (expires_at);


--
-- Name: idx_sessions_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_sessions_session_id ON public.sessions USING btree (session_id);


--
-- Name: idx_sessions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_type ON public.sessions USING btree (session_type);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);


--
-- Name: idx_tasks_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tasks_active ON public.tasks USING btree (acquired_at) WHERE ((complete = false) AND (error IS NULL));


--
-- Name: idx_tasks_unacquired; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tasks_unacquired ON public.tasks USING btree (acquired_at) WHERE (acquired_at IS NULL);


--
-- Name: instance_messages_one_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX instance_messages_one_active ON public.instance_messages USING btree (active) WHERE (active = true);


--
-- Name: ix_analyses_sample; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_analyses_sample ON public.analyses USING btree (sample);


--
-- Name: ix_analyses_sample_id_workflow; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_analyses_sample_id_workflow ON public.analyses USING btree (sample_id, workflow);


--
-- Name: ix_analysis_subtractions_subtraction_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_analysis_subtractions_subtraction_id ON public.analysis_subtractions USING btree (subtraction_id);


--
-- Name: ix_caches_last_accessed_at_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_caches_last_accessed_at_id ON public.caches USING btree (last_accessed_at, id);


--
-- Name: ix_jobs_state_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_jobs_state_created_at ON public.jobs USING btree (state, created_at);


--
-- Name: ix_jobs_user_id_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_jobs_user_id_state ON public.jobs USING btree (user_id, state);


--
-- Name: ix_jobs_workflow_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_jobs_workflow_state ON public.jobs USING btree (workflow, state);


--
-- Name: ix_legacy_history_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_history_index ON public.legacy_history USING btree (index);


--
-- Name: ix_legacy_history_index_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_history_index_id ON public.legacy_history USING btree (index_id);


--
-- Name: ix_legacy_history_otu_otu_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_history_otu_otu_version ON public.legacy_history USING btree (otu, otu_version DESC);


--
-- Name: ix_legacy_history_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_history_reference ON public.legacy_history USING btree (reference);


--
-- Name: ix_legacy_history_reference_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_history_reference_id ON public.legacy_history USING btree (reference_id);


--
-- Name: ix_legacy_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_history_user_id ON public.legacy_history USING btree (user_id);


--
-- Name: ix_legacy_otus_reference_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_otus_reference_id ON public.legacy_otus USING btree (reference_id);


--
-- Name: ix_legacy_samples_all_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_samples_all_read ON public.legacy_samples USING btree (all_read) WHERE (all_read = true);


--
-- Name: ix_legacy_samples_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_samples_group_id ON public.legacy_samples USING btree (group_id);


--
-- Name: ix_legacy_samples_group_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_samples_group_read ON public.legacy_samples USING btree (group_read) WHERE (group_read = true);


--
-- Name: ix_legacy_samples_user_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_samples_user_id_created_at ON public.legacy_samples USING btree (user_id, created_at DESC);


--
-- Name: ix_legacy_sequences_otu_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_sequences_otu_id ON public.legacy_sequences USING btree (otu_id);


--
-- Name: ix_legacy_sequences_otu_id_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_legacy_sequences_otu_id_position ON public.legacy_sequences USING btree (otu_id, "position");


--
-- Name: legacy_otus_name_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX legacy_otus_name_lower ON public.legacy_otus USING btree (lower((name)::text), id);


--
-- Name: primary_group_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX primary_group_unique ON public.user_groups USING btree ("primary", user_id) WHERE false;


--
-- Name: users_handle_lower_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_handle_lower_unique ON public.users USING btree (lower((handle)::text));


--
-- Name: instance_messages instance_messages_sync_user_id; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER instance_messages_sync_user_id BEFORE INSERT OR UPDATE OF "user" ON public.instance_messages FOR EACH ROW EXECUTE FUNCTION public.sync_instance_messages_user_id();


--
-- Name: analyses analyses_index_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_index_id_fkey FOREIGN KEY (index_id) REFERENCES public.indexes(id);


--
-- Name: analyses analyses_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: analyses analyses_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.legacy_references(id);


--
-- Name: analyses analyses_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.legacy_samples(id);


--
-- Name: analyses analyses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: analysis_files analysis_files_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_files
    ADD CONSTRAINT analysis_files_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON DELETE CASCADE;


--
-- Name: analysis_subtractions analysis_subtractions_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_subtractions
    ADD CONSTRAINT analysis_subtractions_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON DELETE CASCADE;


--
-- Name: analysis_subtractions analysis_subtractions_subtraction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_subtractions
    ADD CONSTRAINT analysis_subtractions_subtraction_id_fkey FOREIGN KEY (subtraction_id) REFERENCES public.subtractions(id);


--
-- Name: api_keys api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: index_files index_files_index_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.index_files
    ADD CONSTRAINT index_files_index_id_fkey FOREIGN KEY (index_id) REFERENCES public.indexes(id) ON DELETE CASCADE;


--
-- Name: indexes indexes_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT indexes_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: indexes indexes_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT indexes_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.legacy_references(id);


--
-- Name: indexes indexes_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT indexes_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: indexes indexes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indexes
    ADD CONSTRAINT indexes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: instance_messages instance_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instance_messages
    ADD CONSTRAINT instance_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: job_analyses job_analyses_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_analyses
    ADD CONSTRAINT job_analyses_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: job_indexes job_indexes_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_indexes
    ADD CONSTRAINT job_indexes_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: jobs jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: legacy_history_diff legacy_history_diff_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history_diff
    ADD CONSTRAINT legacy_history_diff_history_id_fkey FOREIGN KEY (history_id) REFERENCES public.legacy_history(id);


--
-- Name: legacy_history legacy_history_index_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history
    ADD CONSTRAINT legacy_history_index_id_fkey FOREIGN KEY (index_id) REFERENCES public.indexes(id);


--
-- Name: legacy_history legacy_history_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history
    ADD CONSTRAINT legacy_history_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.legacy_references(id);


--
-- Name: legacy_history legacy_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_history
    ADD CONSTRAINT legacy_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: legacy_hmm_status legacy_hmm_status_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_hmm_status
    ADD CONSTRAINT legacy_hmm_status_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: legacy_otus legacy_otus_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_otus
    ADD CONSTRAINT legacy_otus_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.legacy_references(id);


--
-- Name: legacy_reference_groups legacy_reference_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_reference_groups
    ADD CONSTRAINT legacy_reference_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: legacy_reference_groups legacy_reference_groups_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_reference_groups
    ADD CONSTRAINT legacy_reference_groups_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.legacy_references(id);


--
-- Name: legacy_reference_users legacy_reference_users_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_reference_users
    ADD CONSTRAINT legacy_reference_users_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.legacy_references(id);


--
-- Name: legacy_reference_users legacy_reference_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_reference_users
    ADD CONSTRAINT legacy_reference_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: legacy_references legacy_references_cloned_from_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_references
    ADD CONSTRAINT legacy_references_cloned_from_id_fkey FOREIGN KEY (cloned_from_id) REFERENCES public.legacy_references(id);


--
-- Name: legacy_references legacy_references_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_references
    ADD CONSTRAINT legacy_references_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: legacy_references legacy_references_upload_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_references
    ADD CONSTRAINT legacy_references_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES public.uploads(id);


--
-- Name: legacy_references legacy_references_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_references
    ADD CONSTRAINT legacy_references_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: legacy_sample_labels legacy_sample_labels_label_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sample_labels
    ADD CONSTRAINT legacy_sample_labels_label_id_fkey FOREIGN KEY (label_id) REFERENCES public.labels(id);


--
-- Name: legacy_sample_labels legacy_sample_labels_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sample_labels
    ADD CONSTRAINT legacy_sample_labels_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.legacy_samples(id) ON DELETE CASCADE;


--
-- Name: legacy_sample_subtractions legacy_sample_subtractions_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sample_subtractions
    ADD CONSTRAINT legacy_sample_subtractions_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.legacy_samples(id) ON DELETE CASCADE;


--
-- Name: legacy_sample_subtractions legacy_sample_subtractions_subtraction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sample_subtractions
    ADD CONSTRAINT legacy_sample_subtractions_subtraction_id_fkey FOREIGN KEY (subtraction_id) REFERENCES public.subtractions(id);


--
-- Name: legacy_samples legacy_samples_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_samples
    ADD CONSTRAINT legacy_samples_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: legacy_samples legacy_samples_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_samples
    ADD CONSTRAINT legacy_samples_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: legacy_samples legacy_samples_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_samples
    ADD CONSTRAINT legacy_samples_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: legacy_sequences legacy_sequences_otu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_sequences
    ADD CONSTRAINT legacy_sequences_otu_id_fkey FOREIGN KEY (otu_id) REFERENCES public.legacy_otus(id) ON DELETE CASCADE;


--
-- Name: nuvs_blast nuvs_blast_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuvs_blast
    ADD CONSTRAINT nuvs_blast_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON DELETE CASCADE;


--
-- Name: nuvs_blast nuvs_blast_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuvs_blast
    ADD CONSTRAINT nuvs_blast_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: sample_reads sample_reads_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_reads
    ADD CONSTRAINT sample_reads_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.legacy_samples(id);


--
-- Name: sample_reads sample_reads_upload_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_reads
    ADD CONSTRAINT sample_reads_upload_fkey FOREIGN KEY (upload) REFERENCES public.uploads(id);


--
-- Name: sample_uploads sample_uploads_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_uploads
    ADD CONSTRAINT sample_uploads_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.legacy_samples(id);


--
-- Name: sample_uploads sample_uploads_upload_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_uploads
    ADD CONSTRAINT sample_uploads_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES public.uploads(id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subtraction_files subtraction_files_subtraction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtraction_files
    ADD CONSTRAINT subtraction_files_subtraction_id_fkey FOREIGN KEY (subtraction_id) REFERENCES public.subtractions(id);


--
-- Name: subtractions subtractions_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtractions
    ADD CONSTRAINT subtractions_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: subtractions subtractions_upload_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtractions
    ADD CONSTRAINT subtractions_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES public.uploads(id);


--
-- Name: subtractions subtractions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtractions
    ADD CONSTRAINT subtractions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: uploads uploads_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_groups user_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict OszgcW4caSwEXFNGFprmSfWDX0bS2cKuc6OpVgSgGHI7Wb2FBVmQvOoR7yfdtI0

