description: Run explore then propose in a single session, with interactive confirmation between phases
This command combines /opsx:explore and /opsx:propose into one session.
All behavior is delegated to those two prompts — this file only defines how they connect.

Step 1 — Run Explore
Follow all rules and behavior defined in opsx-explore.prompt.md exactly.
During exploration:

If anything is unclear, ask the user interactively before proceeding (as defined in that prompt)

Step 2 — Ask Before Proposing
When exploration is complete, do not automatically start the propose phase.
Use the AskUserQuestion tool to ask:

"Exploration is done. Would you like to continue and run propose to create the full change artifacts?"


Yes → proceed to Step 3
No / not now → end the session gracefully

Step 3 — Run Propose
Follow all rules and behavior defined in opsx-propose.prompt.md exactly.
Use everything learned during exploration as context when creating artifacts.