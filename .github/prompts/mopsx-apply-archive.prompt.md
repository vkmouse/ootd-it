---
description: Run apply then archive in a single session, with interactive confirmation between phases
---

This command combines `/opsx:apply` and `/opsx:archive` into one session.
All behavior is delegated to those two prompts — this file only defines how they connect.

---

## Step 1 — Run Apply

Follow all rules and behavior defined in `opsx-apply.prompt.md` exactly.

During apply:
- If anything is unclear, ask the user interactively before proceeding (as defined in that prompt)

## Step 2 — Ask Before Archiving

When apply is complete, **do not automatically start the archive phase.**

Use the **AskUserQuestion tool** to ask:
> "Apply is done. Would you like to continue and run archive to archive this change?"

- **Yes** → proceed to Step 3
- **No / not now** → end the session gracefully

## Step 3 — Run Archive

Follow all rules and behavior defined in `opsx-archive.prompt.md` exactly.
Use everything completed during apply as context when running the archive process.