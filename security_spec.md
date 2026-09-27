# Security Specification & Test-Driven Defense

## 1. Data Invariants
- **Identity Isolation**: All user data, career profiles, conversations, and saved jobs are partitioned under `/users/{userId}` where `userId` strictly equals `request.auth.uid`.
- **Catch-All Default Deny**: Any unmatched document path rejects read and write unconditionally (`allow read, write: if false`).
- **No Blanket Queries**: Listing or fetching documents must explicitly verify ownership against the path variable `{userId}` matching `request.auth.uid`.
- **String Length Enforcements**: All string fields are constrained with `.size() <= MAX` to block resource exhaustion and wallet denial attacks.
- **Timestamp Integrity**: Document mutations require monotonic or server-aligned timestamps.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Read**: Attempting to read `/users/user_abc` without `request.auth`.
2. **Cross-User Snooping**: Authenticated user `user_123` attempting to read `/users/user_456/profile/career`.
3. **Cross-User Career Tampering**: `user_123` attempting to write into `/users/user_456/profile/career`.
4. **Forged Owner Write**: Writing a document where incoming `userId` != `request.auth.uid`.
5. **Path Traversal / ID Injection**: Attempting to write a document ID with 500 malicious characters or special shell symbols (`../junk`).
6. **Ghost Field Poisoning**: Attempting to inject an arbitrary admin field `isAdmin: true` into a profile update.
7. **Cross-User Conversation Poisoning**: User `user_123` attempting to create `/users/user_456/conversations/conv_999`.
8. **Unbounded String Attack**: Sending a 500KB string payload into `fullName` or `title`.
9. **Role Escalation Attack**: Attempting to update `authProvider` to an unauthorized backend value.
10. **Conversation Hijacking**: Attempting to update `userId` of an existing conversation document.
11. **Saved Job Stealing**: Attempting to delete another user's saved job document at `/users/user_456/saved_jobs/job_1`.
12. **Blanket Collection Scrape**: Attempting an unrestricted collection query across all users' conversations without specifying the user's partition.

## 3. Test Runner Implementation
`firestore.rules.test.ts` outlines assertion checks confirming that operations violating any of the 12 invariants are strictly rejected with `PERMISSION_DENIED`.
