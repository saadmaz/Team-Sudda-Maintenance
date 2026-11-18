<a id="top"></a>

<div align="center">

<img src=".github/assets/security.svg" alt="Team Sudda: Security Policy" width="100%">

<br/>

<p><strong>We take the security of the teamsudda.lk maintenance fallback and the people who use it seriously. Thank you for helping keep them safe.</strong></p>

<a href="README.md"><img alt="README" src="https://img.shields.io/badge/README-374151?style=for-the-badge&labelColor=111827"></a>
<a href="CONTRIBUTING.md"><img alt="Contributing" src="https://img.shields.io/badge/Contributing-374151?style=for-the-badge&labelColor=111827"></a>
<a href="CODE_OF_CONDUCT.md"><img alt="Code of Conduct" src="https://img.shields.io/badge/Code%20of%20Conduct-374151?style=for-the-badge&labelColor=111827"></a>
<a href="SECURITY.md"><img alt="Security" src="https://img.shields.io/badge/Security-ffd000?style=for-the-badge&labelColor=111827"></a>
<a href="CHANGELOG.md"><img alt="Changelog" src="https://img.shields.io/badge/Changelog-374151?style=for-the-badge&labelColor=111827"></a>
<a href="LICENSE.md"><img alt="License" src="https://img.shields.io/badge/License-374151?style=for-the-badge&labelColor=111827"></a>

</div>

---

> [!CAUTION]
> Never report a security problem in a public issue, pull request or discussion. Report it privately as described below.

## Reporting a vulnerability

|              |                                                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Email**    | [hello@teamsudda.lk](mailto:hello@teamsudda.lk?subject=Security%20report) with the subject line `Security report` or GitHub's [private vulnerability reporting](https://github.com/saadmaz/Team-Sudda-Maintenance/security/advisories/new) |
| **Include**  | What the issue is and its impact · the affected URL, screen, endpoint or file · steps to reproduce or a proof of concept · any suggested fix                                                                                               |
| **Language** | English                                                                                                                                                                                                                                    |

<p align="right"><a href="#top">Back to top ↑</a></p>

## What happens next

```mermaid
flowchart LR
  A["Report received"] --> B["Acknowledged<br/>within 3 business days"]
  B --> C["Assessed<br/>within 7 business days"]
  C --> D["Fixed or mitigated<br/>by severity"]
  D --> E["Reporter told<br/>and credited if wished"]
```

| Stage              | Target                                                     |
| ------------------ | ---------------------------------------------------------- |
| Acknowledgement    | Within **3 business days**                                 |
| Initial assessment | Within **7 business days**                                 |
| Fix or mitigation  | Based on severity; critical issues are handled immediately |

We keep you informed throughout and tell you when the issue is resolved.

<p align="right"><a href="#top">Back to top ↑</a></p>

## Supported versions

| Version                                          | Supported |
| ------------------------------------------------ | :-------: |
| Latest release on `main`, deployed to production |    Yes    |
| Older releases                                   |    No     |

<p align="right"><a href="#top">Back to top ↑</a></p>

## Scope

<table>
<tr>
<th width="50%">In scope</th>
<th width="50%">Out of scope</th>
</tr>
<tr>
<td valign="top">
<ul>
<li>teamsudda.lk and its subdomains</li>
<li>the maintenance page and every response this Worker sends</li>
<li>the source code in this repository</li>
</ul>
</td>
<td valign="top">
<ul>
<li>denial-of-service and volumetric attacks</li>
<li>social engineering of Team Sudda staff or customers</li>
<li>automated scanner findings without a demonstrated impact</li>
<li>third-party services such as Cloudflare, Firebase or the hosting provider (report those to the provider)</li>
</ul>
</td>
</tr>
</table>

<p align="right"><a href="#top">Back to top ↑</a></p>

## Handling secrets

> [!IMPORTANT]
> Credentials, API keys and service-account files are never committed to this repository. They live in the hosting provider's secret store or in GitHub Environments. If you find a secret in the code or its history, report it as a vulnerability.

<p align="right"><a href="#top">Back to top ↑</a></p>

## Safe harbour

> [!NOTE]
> We will not pursue action against anyone who reports a vulnerability in good faith, avoids privacy violations and service disruption, does not access or modify other people's data, and gives us reasonable time to fix the issue before disclosing it.
