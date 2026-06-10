--
-- PostgreSQL database dump
--

\restrict NmezJTqrfMmeflrcG9sVj6Qua52SEMChbXwkgbkeTmu2WOV4nRDl6TsLk9dNmqT

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

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

CREATE SCHEMA public;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Alert; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Alert" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "dateTime" text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: BidDocument; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BidDocument" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "bidId" text NOT NULL,
    "docType" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "lastUpdated" text,
    "actionUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Deadline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Deadline" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    date text NOT NULL,
    description text,
    "bidId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Favorite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Favorite" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "bidId" text NOT NULL,
    objeto_compra text NOT NULL,
    municipio_nome text,
    valor_total_estimado double precision,
    situacao_nome text,
    ramo_mei text,
    modalidade_nome text,
    data_publicacao_pncp text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Proposal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Proposal" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    organization text NOT NULL,
    date text NOT NULL,
    status text DEFAULT 'em_andamento'::text NOT NULL,
    "bidId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "senhaHash" text
);


--
-- Name: UserDocument; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserDocument" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    "mimeType" text NOT NULL,
    "uploadDate" text NOT NULL,
    status text DEFAULT 'pendente'::text NOT NULL,
    size integer,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: Alert; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Alert" (id, "userId", type, title, description, "dateTime", "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: BidDocument; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BidDocument" (id, "userId", "bidId", "docType", title, description, status, "lastUpdated", "actionUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Deadline; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Deadline" (id, "userId", title, date, description, "bidId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Favorite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Favorite" (id, "userId", "bidId", objeto_compra, municipio_nome, valor_total_estimado, situacao_nome, ramo_mei, modalidade_nome, data_publicacao_pncp, "createdAt") FROM stdin;
\.


--
-- Data for Name: Proposal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Proposal" (id, "userId", name, organization, date, status, "bidId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, email, "createdAt", "senhaHash") FROM stdin;
\.


--
-- Data for Name: UserDocument; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserDocument" (id, "userId", name, "mimeType", "uploadDate", status, size, content, "createdAt") FROM stdin;
\.


--
-- Name: Alert Alert_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_pkey" PRIMARY KEY (id);


--
-- Name: BidDocument BidDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BidDocument"
    ADD CONSTRAINT "BidDocument_pkey" PRIMARY KEY (id);


--
-- Name: Deadline Deadline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Deadline"
    ADD CONSTRAINT "Deadline_pkey" PRIMARY KEY (id);


--
-- Name: Favorite Favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY (id);


--
-- Name: Proposal Proposal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Proposal"
    ADD CONSTRAINT "Proposal_pkey" PRIMARY KEY (id);


--
-- Name: UserDocument UserDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserDocument"
    ADD CONSTRAINT "UserDocument_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: BidDocument_userId_bidId_docType_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BidDocument_userId_bidId_docType_key" ON public."BidDocument" USING btree ("userId", "bidId", "docType");


--
-- Name: Favorite_userId_bidId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Favorite_userId_bidId_key" ON public."Favorite" USING btree ("userId", "bidId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Alert Alert_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BidDocument BidDocument_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BidDocument"
    ADD CONSTRAINT "BidDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Deadline Deadline_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Deadline"
    ADD CONSTRAINT "Deadline_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Favorite Favorite_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Proposal Proposal_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Proposal"
    ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserDocument UserDocument_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserDocument"
    ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict NmezJTqrfMmeflrcG9sVj6Qua52SEMChbXwkgbkeTmu2WOV4nRDl6TsLk9dNmqT

