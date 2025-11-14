# Epic-Tech-Context Workflow - Conversion Complete

**Date:** 2025-11-13
**Status:** ✅ Complete
**Priority:** P1

---

## Summary

Converted epic-tech-context workflow - Generates comprehensive epic-level technical specifications with NFRs, acceptance criteria, and traceability mapping.

**Source:** `src/modules/bmm/workflows/4-implementation/epic-tech-context/`
**Target:** `claude-code-plugin/src/commands/phase-4/epic-tech-context.md`
**Lines:** ~780 lines
**Approach:** Manual conversion

**Key Features:**
- Delegates to bmad-architect for tech spec creation
- JIT (Just-In-Time) workflow - run for each epic as needed
- Selective epic loading (efficiency optimization)
- Supports whole and sharded documents
- Updates sprint status (backlog → contexted)
- Comprehensive NFRs (performance, security, reliability, observability)
- Traceability mapping (AC → Spec → Components → Tests)
- 3 comprehensive examples (SaaS, Healthcare, Mobile)

**Philosophy:** JIT specification, selective loading, grounded in source docs, comprehensive NFRs, test-driven design.

**P1 Workflow:** High priority - needed after architecture for epic-level technical planning.
