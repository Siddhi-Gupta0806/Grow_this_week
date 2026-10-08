# DEV Post Outline: Building GrowThisWeek for the Hacktoberfest AI Challenge

## Suggested Title Options:
1. *How I Built GrowThisWeek: A Grounded AI Garden Planner Powered by Gemma 4 & Real 7-Day Weather*
2. *Stop Hallucinating Plants: Grounding Gemma 4 AI with Open-Meteo Climate Forecasts*

---

## 1. Introduction & The Problem
- **The Story:** Why urban gardening is hard—weather swings, sudden heatwaves, and rotted roots.
- **The Vision:** An AI planner that tells you what to plant *this exact week* based on real 7-day climate data, not generic advice.

## 2. Why Open-Source AI (Gemma 4)?
- Why open-source model governance matters for botanical research.
- Utilizing `gemma-4-26b-a4b-it` (primary) and `gemma-4-31b-it` (fallback) via the official `google-genai` SDK.
- Multimodal capabilities: text planning + vision disease diagnosis & space scanning.

## 3. Grounding Engine Architecture
- **The Golden Rule:** Never let an LLM guess weather stats or invent non-existent plant names.
- **Stage 1:** Deterministic Python filtering over `app/data/plants.json` (205+ crops).
- **Stage 2:** Gemma 4 structured JSON generation with strict Pydantic schema validation.
- Embed Mermaid system architecture diagram.

## 4. Tech Stack Breakdown
- **Backend:** Python + FastAPI + Pydantic v2 + SQLite repository pattern.
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Framer Motion.
- **Integrations:** Open-Meteo (Weather), Backboard (Long-term Memory), ElevenLabs (Voice TTS), Sentry (Monitoring).

## 5. What Failed & How We Fixed It
- Handling LLM JSON output quirks & strict candidate validation.
- Implementing 40-second call timeouts and seamless model fallbacks.
- Local offline fallbacks for keys and network drops.

## 6. Key Features Showcase
- 7-Day Weather Dashboard & Weather-Reactive Background UI.
- "Why This Plant?" Exact Climate Math Explainer Modal.
- Plant Doctor Vision Diagnosis & Space Scanner.
- Water Saver Calculator & "What If" Climate Simulator.
- Under-The-Hood Observability Telemetry Page.

## 7. Results & Evaluation Suite
- Benchmarking over 10 test cities and 5 photo scenarios in `evals/run_evals.py`.
- 100% database grounding and zero hallucinated weather numbers.

## 8. Links & How to Try
- GitHub Repository Link
- Live Render Demo URL
- License (MIT)
