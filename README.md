\# ThreatLens — Unified IoC Investigation Platform



\*\*From isolated indicators to connected threat evidence.\*\*



ThreatLens is a cybersecurity investigation platform designed to help analysts collect, enrich, correlate, and investigate Indicators of Compromise (IoCs) through a unified workflow. By bringing threat intelligence and behavioral evidence together, the platform aims to make security investigations more structured, explainable, and easier to document.



Rather than treating every suspicious indicator as an isolated event, ThreatLens is designed to connect indicators with their surrounding context and help analysts understand why an indicator may deserve further investigation.



> \*\*Project status:\*\* Academic cybersecurity prototype. Advanced capabilities described as planned are not considered implemented until verified in the source code.



\---



\## Table of Contents



\- \[The Problem](#the-problem)

\- \[Our Approach](#our-approach)

\- \[System Architecture](#system-architecture)

\- \[Investigation Pipeline](#investigation-pipeline)

\- \[Core Capabilities](#core-capabilities)

\- \[Technology Stack](#technology-stack)

\- \[Project Structure](#project-structure)

\- \[Getting Started](#getting-started)

\- \[Investigation Workflow](#investigation-workflow)

\- \[Implementation Status](#implementation-status)

\- \[Evaluation](#evaluation)

\- \[Security and Limitations](#security-and-limitations)

\- \[Future Work](#future-work)

\- \[Project Goal](#project-goal)

\- \[Built With](#built-with)

\- \[Team](#team)



\---



\## The Problem



Modern cybersecurity investigations often require analysts to examine indicators from multiple sources, interpret suspicious behavior, and manually connect related evidence.



An IP address, domain, file hash, or authentication event may appear harmless when examined independently. Its significance can change when additional information reveals suspicious connection patterns, repeated login attempts, unusual ports, malicious infrastructure relationships, or known threat intelligence.



When these sources are investigated separately, analysts may face:



\- \*\*Fragmented intelligence:\*\* Relevant information is distributed across different sources and tools.

\- \*\*Limited context:\*\* An indicator alone may not explain the behavior associated with it.

\- \*\*Manual correlation:\*\* Connecting related indicators and events can require significant investigative effort.

\- \*\*Inconsistent risk assessment:\*\* Analysts may lack a unified view of the evidence supporting a risk judgment.

\- \*\*Investigation overhead:\*\* Organizing evidence, timelines, cases, and reports can make analysis more time-consuming.



ThreatLens explores a unified approach to organizing this investigative process.



\## Our Approach



ThreatLens is designed around one central principle:



\*\*An indicator becomes more useful when it is examined in context.\*\*



The platform brings together several stages of investigation:



1\. \*\*Collect\*\* indicators and relevant security telemetry.

2\. \*\*Enrich\*\* indicators with contextual threat intelligence.

3\. \*\*Analyze\*\* behavioral signals and relationships between infrastructure elements.

4\. \*\*Assess\*\* potential risk using evidence from multiple analytical sources.

5\. \*\*Contextualize\*\* findings using explainable summaries and the MITRE ATT\&CK framework.

6\. \*\*Document\*\* investigations through evidence timelines, cases, and reports.



The objective is to support an analyst's investigation, not to replace human judgment or treat every suspicious indicator as confirmed malicious activity.



\## System Architecture



The following architecture illustrates the proposed end-to-end ThreatLens investigation pipeline, from threat data collection to the analyst investigation workspace.



```mermaid

flowchart TD

&#x20;   A\["01 · Threat Data Sources<br/><br/>Honeypot Telemetry<br/>External Threat Intelligence APIs<br/>Analyst-Submitted IoCs"]



&#x20;   B\["02 · IoC Normalization \& Enrichment<br/><br/>Normalize Indicators<br/>Gather Contextual Intelligence<br/>Associate Supporting Evidence"]



&#x20;   C\["03 · Multi-Layer Analysis"]



&#x20;   C1\["Behavioral Analysis<br/><br/>Connection Patterns<br/>Ports \& Authentication Attempts<br/>Commands \& Activity"]



&#x20;   C2\["Infrastructure Relationship Analysis<br/><br/>ASN Relationships<br/>Passive DNS<br/>Hosting Patterns"]



&#x20;   D\["04 · Risk Assessment \& Contextualization<br/><br/>Risk Score Fusion Engine<br/>LLM-Assisted Explanations<br/>MITRE ATT\&CK Mapping<br/><br/>Planned Capabilities"]



&#x20;   E\["05 · Analyst Investigation Workspace<br/><br/>IoC Investigation<br/>Evidence Timeline<br/>Case Management<br/>Investigation Reports"]



&#x20;   A --> B

&#x20;   B --> C

&#x20;   C --> C1

&#x20;   C --> C2

&#x20;   C1 --> D

&#x20;   C2 --> D

&#x20;   D --> E



&#x20;   classDef source fill:#172554,stroke:#60A5FA,color:#FFFFFF,stroke-width:2px

&#x20;   classDef process fill:#164E63,stroke:#22D3EE,color:#FFFFFF,stroke-width:2px

&#x20;   classDef analysis fill:#3B0764,stroke:#C084FC,color:#FFFFFF,stroke-width:2px

&#x20;   classDef planned fill:#78350F,stroke:#FBBF24,color:#FFFFFF,stroke-width:2px

&#x20;   classDef output fill:#14532D,stroke:#4ADE80,color:#FFFFFF,stroke-width:2px



&#x20;   class A source

&#x20;   class B process

&#x20;   class C,C1,C2 analysis

&#x20;   class D planned

&#x20;   class E output

```



\*Architecture note: This diagram represents the proposed system design. Risk score fusion, LLM-assisted contextualization, and MITRE ATT\&CK mapping are planned capabilities, not confirmed completed implementations.\*



\### Architecture at a glance



| Layer | Responsibility |

|---|---|

| Threat data sources | Provide IoCs, honeypot events, and external intelligence. |

| Normalization and enrichment | Standardize indicators and gather relevant contextual information. |

| Behavioral analysis | Examine activity patterns and suspicious events. |

| Infrastructure analysis | Explore relationships between indicators and infrastructure attributes. |

| Risk assessment | Combine analytical evidence into a unified assessment. |

| Contextualization | Explain findings and associate relevant MITRE ATT\&CK techniques. |

| Investigation workspace | Present findings, evidence, cases, timelines, and reports. |



\## Investigation Pipeline



\### 1. Threat Data Collection



ThreatLens is designed to bring together indicators from honeypot telemetry, external threat intelligence sources, and analyst-submitted inputs.



The objective is to create a common starting point for investigating different types of potentially suspicious activity.



\### 2. IoC Normalization and Enrichment



An indicator should be examined alongside relevant contextual information. Depending on the available data sources, enrichment may include infrastructure details, related indicators, and external intelligence.



This stage provides additional evidence for subsequent analysis.



\### 3. Multi-Layer Analysis



ThreatLens proposes two complementary analytical paths.



\*\*Behavioral analysis\*\*



Focuses on observable activity rather than relying only on an indicator's identity. Potential signals include connection patterns, authentication attempts, destination ports, and commands observed in telemetry.



\*\*Infrastructure relationship analysis\*\*



Examines relationships between indicators and infrastructure attributes such as autonomous system numbers (ASNs), passive DNS observations, and hosting patterns.



A graph-based approach using a graph neural network (GNN) is planned to explore relationships that may not be obvious from individual indicators.



\### 4. Risk Assessment and Contextualization



The proposed risk score fusion engine will combine evidence from different analytical stages into a unified risk assessment.



LLM-assisted contextualization and MITRE ATT\&CK mapping are planned to help translate analytical findings into explanations that are easier for analysts to interpret.



These capabilities must be implemented and evaluated before any claims about their accuracy or effectiveness can be made.



\### 5. Analyst Investigation and Reporting



The investigation workspace is intended to help analysts inspect indicators, review supporting evidence, organize cases, examine event timelines, and prepare investigation reports.



The aim is to keep investigative context accessible instead of leaving conclusions disconnected from the evidence behind them.



\## Core Capabilities



The project is organized around the following capability areas. Availability depends on the current implementation.



\- \*\*Unified IoC investigation:\*\* A common workflow for examining indicators.

\- \*\*Threat intelligence enrichment:\*\* Additional context from supported intelligence sources.

\- \*\*Honeypot telemetry integration:\*\* Security events that can support behavioral investigation.

\- \*\*Behavioral analysis:\*\* Examination of suspicious activity patterns.

\- \*\*Infrastructure relationship analysis:\*\* Exploration of relationships between indicators and infrastructure.

\- \*\*Risk assessment:\*\* A planned mechanism for combining evidence from multiple analysis stages.

\- \*\*AI-assisted contextualization:\*\* A planned capability for producing investigation-oriented explanations.

\- \*\*MITRE ATT\&CK mapping:\*\* A planned capability for associating findings with relevant adversary tactics and techniques.

\- \*\*Case and timeline management:\*\* Organization of investigative evidence and events.

\- \*\*Reporting:\*\* Presentation of investigation findings in a structured format.



These descriptions identify the project's intended functionality and should not be interpreted as confirmation that every capability is currently operational.



\## Technology Stack



The current repository structure indicates the following technologies.



\### Frontend



\- React

\- TypeScript

\- Vite

\- Tailwind CSS

\- Lucide React

\- Motion



\### Backend



\- Node.js

\- Express.js

\- TypeScript



\### Security and Intelligence



\- Honeypot telemetry and threat intelligence workflows

\- MITRE ATT\&CK framework as a planned contextualization component

\- AI-assisted analysis as a planned capability



\### Development Tools



\- npm for dependency management

\- Git and GitHub for version control

\- Visual Studio Code or another compatible code editor



The exact integrations and their implementation status should be verified against the current source code and environment configuration.



\## Project Structure



The following is a simplified overview of the current repository structure.



```text

ThreatLens/

├── public/              # Static assets

├── src/                 # Frontend source code

├── server.ts            # Server entry point

├── index.html           # Application HTML entry point

├── package.json         # Dependencies and npm scripts

├── package-lock.json    # Dependency lockfile

├── tsconfig.json        # TypeScript configuration

├── vite.config.ts       # Vite configuration

├── .env.example         # Example environment configuration

├── .gitignore           # Git exclusions

└── README.md            # Project documentation

```



File locations and responsibilities may change as the project evolves.



\## Getting Started



\### Prerequisites



Install the following:



\- Node.js compatible with the project's dependencies

\- npm

\- Git (optional, for cloning and version control)



\### 1. Clone the repository



```bash

git clone https://github.com/joshsworkspace18-glitch/Threatlens.git

cd Threatlens

```



\### 2. Install dependencies



```bash

npm install

```



\### 3. Configure environment variables



Create a local environment file from the example configuration if the application requires one.



\*\*Windows Command Prompt:\*\*



```cmd

copy .env.example .env

```



\*\*macOS/Linux or compatible shells:\*\*



```bash

cp .env.example .env

```



Open `.env` and configure the required variables according to the application's configuration and the services you intend to use. Do not commit real API keys, credentials, or secrets.



\### 4. Start the application



```bash

npm run dev

```



In the current development setup, the server reports:



```text

http://localhost:3000

```



Open the reported local address in your browser. If the application starts on a different port, use the address printed in the terminal.



\### 5. Troubleshooting



\- If dependencies are missing, run `npm install`.

\- If the port is already in use, stop the conflicting process or configure an available port according to the project setup.

\- If an integration fails, check the required environment variables and service configuration.

\- If the application fails to start, inspect the terminal output for the specific error.



The commands above describe the current development setup; they do not guarantee that every external intelligence or AI integration is configured.



\## Investigation Workflow



A typical intended investigation follows this sequence:



1\. Open the ThreatLens application.

2\. Select or submit an indicator for investigation, where supported.

3\. Review the available indicator details and enrichment results.

4\. Examine related behavioral observations and infrastructure evidence, where available.

5\. Review the risk assessment and contextual explanation when those modules are implemented.

6\. Organize relevant evidence into a case or timeline.

7\. Prepare a report summarizing the investigation.



The workflow should be updated as the application's actual screens and implemented features are finalized.



\## Implementation Status



ThreatLens is being developed incrementally. The following distinction prevents proposed architecture from being mistaken for completed functionality.



| Component | Status |

|---|---|

| React and TypeScript application structure | Present in the current repository |

| Node.js/Express server entry point | Present in the current repository |

| Local development startup | Verified in the current development setup |

| IoC collection and enrichment | Verify the available integrations in the source code |

| Honeypot telemetry processing | Verify the current implementation |

| Behavioral analysis | Verify the current implementation |

| GNN-based infrastructure analysis | Planned |

| Risk score fusion engine | Planned |

| LLM-assisted contextualization | Planned |

| MITRE ATT\&CK mapping | Planned |

| Evidence timelines, case management, and reports | Verify the current implementation |



Update this table whenever a component is implemented and tested. A module should be marked complete only when its behavior has been verified.



\## Evaluation



The project should be evaluated using reproducible tests that examine both the technical workflow and the quality of the resulting evidence.



Possible evaluation areas include:



\- \*\*Indicator processing:\*\* Whether supported indicators are accepted and processed correctly.

\- \*\*Enrichment reliability:\*\* Whether available contextual data is retrieved and represented correctly.

\- \*\*Behavioral analysis:\*\* Whether defined test scenarios produce the expected observations.

\- \*\*Relationship analysis:\*\* Whether known test relationships can be identified when graph analysis is available.

\- \*\*Risk assessment:\*\* Whether the assessment follows the documented scoring logic once implemented.

\- \*\*Evidence traceability:\*\* Whether displayed conclusions can be linked to their supporting evidence.

\- \*\*Application reliability:\*\* Whether the main workflow behaves correctly under normal and invalid inputs.



\### Results



\*Evaluation results will be added after testing.\*



Record the test dataset, test cases, expected behavior, observed behavior, and measured results. If simulated data is used, identify it explicitly. Do not claim detection accuracy, performance improvements, or real-world effectiveness without supporting measurements.



\## Security and Limitations



\- ThreatLens is an academic prototype and is not a replacement for a production security operations platform.

\- The availability and quality of external intelligence depend on the configured data sources and their responses.

\- Simulated telemetry, if used, may not represent the complexity of real-world attacks.

\- Relationships between indicators do not automatically prove that the indicators share a malicious origin.

\- Risk assessments should be interpreted alongside the underlying evidence.

\- Planned AI and graph-analysis components may not yet be operational.

\- LLM-generated explanations, when implemented, may be incomplete or incorrect and require analyst verification.

\- The platform should not be assumed to provide real-time monitoring unless the relevant integrations and processing are implemented and tested.

\- No claim of production readiness or guaranteed threat detection is made.



\## Future Work



Potential development directions include:



\- Integrating additional threat intelligence sources.

\- Improving normalization and correlation of heterogeneous IoCs.

\- Implementing graph-based infrastructure relationship analysis using a GNN.

\- Developing a risk score fusion engine with documented scoring logic.

\- Integrating LLM-assisted contextual explanations with evidence traceability.

\- Adding MITRE ATT\&CK technique mapping and supporting evidence.

\- Improving investigation timelines, case workflows, and report generation.

\- Building a repeatable evaluation dataset and measuring performance against defined test cases.

\- Strengthening input validation, access control, secret management, and deployment security.



\## Project Goal



ThreatLens aims to make cybersecurity investigations more contextual and evidence-driven by connecting indicators, behavioral observations, and infrastructure relationships in one analyst-oriented workflow.



The long-term vision is simple: move from investigating isolated indicators to understanding the evidence that connects them.\*\*



\## Built With



\- \[React](https://react.dev/)

\- \[TypeScript](https://www.typescriptlang.org/)

\- \[Vite](https://vite.dev/)

\- \[Node.js](https://nodejs.org/)

\- \[Express](https://expressjs.com/)

\- \[MITRE ATT\&CK](https://attack.mitre.org/)



\## Team



Add team members, contributions, and academic affiliation here.\*



\## Disclaimer



ThreatLens is developed for academic and educational purposes. It is intended to support security investigation and analysis, not to guarantee threat detection or replace professional security judgment.

