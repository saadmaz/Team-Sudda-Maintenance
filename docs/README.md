# Documentation

<!-- nav -->

<sub><a href="../README.md">← Back to the project README</a></sub>

Every STTPS repository uses the same documentation layout. Start with the core documents, then the decision records and runbooks.

## Core

| Document                             | Covers                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)   | How requests are routed and answered, and what each response looks like     |
| [CONFIGURATION.md](CONFIGURATION.md) | Host lists, bindings, configuration files and where each value lives        |
| [DEPLOYMENT.md](DEPLOYMENT.md)       | Hosting, the delivery pipeline, first-time setup and post-deployment checks |
| [CONTENT.md](CONTENT.md)             | How to update the maintenance page's copy, colours, logo and favicon        |

## Decisions and operations

| Document                        | Covers                          |
| ------------------------------- | ------------------------------- |
| [adr/](adr/README.md)           | Architecture decision records   |
| [runbooks/](runbooks/README.md) | Release and rollback procedures |

## Conventions

- Top-level documents use `UPPER-KEBAB-CASE.md`; documents inside folders use `lower-kebab-case.md`.
- Update the relevant document in the same pull request as the change it describes.
- Record significant technical decisions as ADRs rather than editing older documents.
