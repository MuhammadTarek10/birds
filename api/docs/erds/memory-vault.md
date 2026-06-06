# Memory Vault ERD

This schema has been split into feature-oriented files to make it easier to evolve each area independently.

## Feature Files

- [01-auth-and-users](./memory-vault/01-auth-and-users.md)
- [02-pods-and-membership](./memory-vault/02-pods-and-membership.md)
- [03-memories-core](./memory-vault/03-memories-core.md)
- [04-media-and-attachments](./memory-vault/04-media-and-attachments.md)
- [05-engagement-and-taxonomy](./memory-vault/05-engagement-and-taxonomy.md)

## Split Rationale

- Auth and user identity are grouped together because they change with login, profile, and account lifecycle work.
- Pods and membership capture tenancy and access boundaries.
- Memories core stays separate because it is the center of the product and depends on both users and pods.
- Media attachments are isolated because upload/storage concerns usually evolve independently from memory metadata.
- Comments and tags are grouped as engagement and organization features layered on top of memories.
