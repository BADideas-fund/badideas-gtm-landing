<!-- estate-rules:begin · managed by tech_hub desks/security-audit; edit the source, not this -->
## BADideas estate rules

**Before you finish any change that touches Supabase** (a table, policy, view, function, grant or
migration), **or this service's secrets, deploy, cron, environment, auth or dependencies, check it
against the estate build requirements:**
https://github.com/BADideas-fund/tech-hub/blob/main/desks/security-audit/REQUIREMENTS.md
(in the working folder: `../tech_hub/desks/security-audit/REQUIREMENTS.md`). They are kept in
tech_hub, once, and this block is maintained from there. **Do not copy the rules into this repository,
and do not edit this block here**: the next run overwrites it.

**Overriding a rule.** If a rule is wrong for this change, or blocks you for no good reason, you may
go ahead. In the same session:
1. Add a line under `## Estate overrides` in this repository's `RULES.md` (create the heading if it
   is missing): `BR-NN · what you did instead · why · YYYY-MM-DD · your first name`.
2. Send Roberts (Slack `U058C6AKGLV`) the rule, what you did and your reasoning. Show the person the
   message before it is sent.

The monthly security audit reads every override. Roberts either changes the rule or asks for the
change to be brought in line.
<!-- estate-rules:end -->
