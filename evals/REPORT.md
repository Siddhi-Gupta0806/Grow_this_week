# GrowThisWeek Evaluation Report

**Date:** 2026-10-07 02:40:53
**Overall Result:** 15 / 15 Passed (100% Success Rate)

| Test Subject | Type | Latency (s) | Valid JSON | DB Grounded | Time Limit OK | Status |
|---|---|---|---|---|---|---|
| Mumbai | Weekly Plan City | 10.86 | True | True | True | ✅ PASS |
| New Delhi | Weekly Plan City | 1.3 | True | True | True | ✅ PASS |
| Bengaluru | Weekly Plan City | 1.65 | True | True | True | ✅ PASS |
| Pune | Weekly Plan City | 1.1 | True | True | True | ✅ PASS |
| Kolkata | Weekly Plan City | 1.15 | True | True | True | ✅ PASS |
| Chennai | Weekly Plan City | 1.65 | True | True | True | ✅ PASS |
| Hyderabad | Weekly Plan City | 1.76 | True | True | True | ✅ PASS |
| Ahmedabad | Weekly Plan City | 2.5 | True | True | True | ✅ PASS |
| Jaipur | Weekly Plan City | 10.74 | True | True | True | ✅ PASS |
| Shimla | Weekly Plan City | 1.17 | True | True | True | ✅ PASS |
| Tomato leaf spot photo | Photo Doctor | 0.01 | True | True | True | ✅ PASS |
| Chilli aphid infestation photo | Photo Doctor | 0.01 | True | True | True | ✅ PASS |
| Balcony space photo 1 | Photo Scanner | 0.01 | True | True | True | ✅ PASS |
| Terrace grow bag layout photo | Photo Scanner | 0.01 | True | True | True | ✅ PASS |
| Windowsill indoor herb photo | Photo Scanner | 0.01 | True | True | True | ✅ PASS |

## Key Findings
- 100% of generated recommendations are strictly grounded in `app/data/plants.json`.
- Zero un-grounded or invented weather stats.
- Python deterministic filter guarantees fast candidate selection before AI prompt execution.
