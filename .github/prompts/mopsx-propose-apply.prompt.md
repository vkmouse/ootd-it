---
description: Run propose then apply in a single session, with interactive confirmation between phases
---

This command combines `/opsx:propose` and `/opsx:apply` into one session.
All behavior is delegated to those two prompts — this file only defines how they connect.

---

## Step 1 — Run Propose

Follow all rules and behavior defined in `opsx-propose.prompt.md` exactly.

During proposal:
- If anything is unclear, ask the user interactively before proceeding (as defined in that prompt)

## Step 2 — Ask Before Applying

When all artifacts are created, **do not automatically start the apply phase.**

Use the **AskUserQuestion tool** to ask:
> "Proposal is ready. Would you like to continue and run apply to start implementation?"

- **Yes** → proceed to Step 3
- **No / not now** → end the session gracefully

## Step 3 — Run Apply

Follow all rules and behavior defined in `opsx-apply.prompt.md` exactly.