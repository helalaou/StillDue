# Research source integration

The field taxonomy is independent of any source. Add a field/subfield in `src/domain/taxonomy.ts`; introduce a provider that produces the `Conference` type to populate it. Personal research entries always accept manual metadata.

The CCF adapter downloads the repository archive, reads only bounded YAML conference entries, validates their shape, and normalizes explicit times. It supports AoE, fixed UTC offsets, and Pacific Time with daylight-saving rules. An invalid date becomes unannounced. Multiple rounds remain distinct.

Stable source IDs combine provider, conference edition, and timeline position. A date edit retains its identity. A source that reorders timeline entries can change what a position means; users must review the linked record before accepting changes. This is a known limit of the upstream schema.

The cache retains the last successfully imported data if a refresh fails. Each visible entry has a check timestamp. A timestamp records retrieval, not independent verification of the official CFP. Community coverage can be incomplete, particularly for workshops and non-CS fields.

Duplicate imports are detected by source ID. Importing is a private copy, not automatic subscription replacement. Later source changes are reviewed explicitly. When accepting an earlier official date, a personal target that would now fall after it is cleared.

Retain attribution and the upstream MIT license when redistributing the source dataset. Do not seed the repository with a user’s unpublished research plans.
