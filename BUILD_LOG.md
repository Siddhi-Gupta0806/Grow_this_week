# GrowThisWeek — Build Log & Engineering Diary

## Overview
**Project Name:** GrowThisWeek  
**Challenge:** Hacktoberfest Open-Source AI Challenge on DEV  
**Core Model:** Gemma 4 (`gemma-4-26b-a4b-it` primary, `gemma-4-31b-it` fallback) via Gemini API  
**Developer:** Senior Full-Stack Engineer & Product Designer  
**Date:** October 7, 2026  

---

## 1. Concept & Problem Definition
**Problem:** Urban gardeners and home growers often struggle with crop selection because generic gardening guides fail to consider real-time local weather windows. Planting a temperature-sensitive crop (e.g. cauliflower or cabbage) during a sudden 32°C heat streak results in bolting and crop failure. Heavy rain weeks rot root systems if unmanaged.

**Solution:** Build **GrowThisWeek**, a weather-reactive botanical AI planner grounded in live 7-day Open-Meteo forecasts. To ensure 100% factual reliability and prevent AI hallucinations (invented plant names or fake weather stats), we implemented a **2-Stage Grounding Engine**:
1. **Stage 1 (Deterministic Python Filter):** Filters candidate plants BEFORE calling the AI model based on strict temperature bounds, rainfall thresholds, container compatibility, and user garden history.
2. **Stage 2 (Gemma 4 AI Reasoning):** Gemma 4 receives the weather summary and pre-filtered candidate list, outputting actionable planting steps ("how"), botanical explanations ("why"), daily protection warnings, and avoidance lists in strict JSON format.

---

## 2. Architecture & Tech Stack Decisions
- **Backend:** Python + FastAPI + Pydantic v2 + SQLite repository layer.
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Framer Motion. Modern botanical journal design system with dark mode and glassmorphism.
- **AI Models:** Gemma 4 through the `google-genai` Python SDK (v2.3.0+). Primary: `gemma-4-26b-a4b-it`, Fallback: `gemma-4-31b-it`. 40-second execution timeout.
- **Weather Grounding:** Open-Meteo API (free geocoding and 7-day forecast with daily min/max temp, precipitation, wind, UV).
- **Long-Term Memory:** Backboard API with local SQLite fallback for memory persistence.
- **Voice TTS:** ElevenLabs Text-to-Speech with local disk hash caching to optimize API usage.
- **Observability:** Sentry error tracking + hidden `/under-the-hood` telemetry dashboard recording call latencies, token counts, and model fallback occurrences.

---

## 3. Step-by-Step Implementation Chronology

### Step 1: Plant Database Creation (`app/data/plants.json`)
- Built a comprehensive plant database containing **205 plants** spanning vegetables, herbs, flowers, fruits, and microgreens.
- Included localized names in **Hindi** and **Marathi** (e.g., Tomato -> Tamatar / Tamata, Okra -> Bhindi / Bhendi).
- Enriched each entry with `temp_min`, `temp_max`, `rain_tolerance`, `sun_needs`, `water_need`, `start_method`, `days_to_harvest`, `container_friendly`, `companions`, and `bad_neighbours`.

### Step 2: Deterministic Grounding Engine (`app/services/grounding.py`)
- Implemented `filter_candidate_plants()` in plain Python.
- Evaluated `avg_temp = (avg_max + avg_min) / 2`.
- Checked `heavy_rain_week = total_rain_mm > 40.0`.
- Enforced strict condition: `temp_min <= avg_temp <= temp_max AND (heavy_rain_ok OR not heavy_rain_week)`.
- Removed plants already present in active user garden.

### Step 3: Gemma 4 AI Integration (`app/services/gemma_service.py`)
- Integrated `google-genai` Python package using `types.GenerateContentConfig(temperature=0.3, max_output_tokens=1200)`.
- Implemented 40-second timeout with `asyncio.wait_for`.
- Configured automatic single-retry fallback to `gemma-4-31b-it` if primary times out or fails.
- Validated Pydantic schema responses and checked candidate name containment. If validation fails, retried once with a stricter reminder prompt, then fell back to local deterministic fallback generator.

### Step 4: Vision & Voice Features (`doctor.py`, `scanner.py`, `voice_service.py`)
- Implemented **Plant Doctor** photo analysis using Gemma 4 vision to identify diseases, confidence %, leaf symptoms, and organic low-cost treatment steps.
- Implemented **Space Scanner** photo analysis to estimate sunlight hours and container capacity for balconies/yards.
- Built **VoiceService** wrapping ElevenLabs TTS with MD5 disk caching (`audio_cache/<hash>.mp3`).

### Step 5: Frontend Bento-Grid Dashboard
- Created a modern botanical journal design aesthetic with forest green (`#1b4332`), sage (`#52b788`), warm cream (`#fdfbf7`), and sunrise orange (`#e76f51`).
- Built animated 7-day weather cards, recommendation cards with "Why this plant?" exact numbers explainer modal, My Garden tracker, Plant Doctor, Space Scanner, Ask Gemma chat with prompt chips, Harvest Journal, and Under The Hood telemetry dashboard.

---

## 4. What Failed & How We Fixed It
1. **Challenge:** Initial powershell invocation pathing on Windows during task execution.
   - **Fix:** Switched to direct standard command execution and `write_to_file` automatic directory creation.
2. **Challenge:** AI model returning Markdown formatting (````json ... ````) wrapped inside responses.
   - **Fix:** Built `_clean_and_parse_json` sanitizer to strip markdown backticks before JSON parsing.
3. **Challenge:** Candidate name halluncination risk in edge cases.
   - **Fix:** Added `_validate_weekly_plan` validation enforcing that 100% of recommended plants match candidate names from `app/data/plants.json`.

---

## 5. Key Learnings & Takeaways
- **Grounding First is Critical:** Combining deterministic Python filtering *before* LLM generation completely eliminates hallucinations and guarantees climate accuracy.
- **Resilience through Fallbacks:** Wrapping Backboard, ElevenLabs, and Gemma API calls in graceful local fallbacks ensures the application never crashes, even without API keys or internet access.
