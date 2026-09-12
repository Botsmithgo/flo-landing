## 2026-09-12 | Contact delivery | Activation is not delivery

**Problem:** An email form service can accept a setup request without delivering customer messages.
**Root Cause:** FormSubmit requires inbox activation and returns `success` as a string; treating the string "false" as truthy would falsely report success.
**Solution:** Accept only boolean true or string "true" with a successful HTTP status. Keep the email-draft fallback active until the receiving inbox is verified.
**Prevention:** Verify activation and inbox receipt separately; never mark a mailto draft or activation email as a delivered contact message.
**Tags:** #forms #email #verification
