import "dotenv/config";
import mongoose from "mongoose";
import Note from "./models/Note.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/class12_notes";

const chapters = [
  {
    title: "Database Management Systems (DBMS)",
    slug: "dbms",
    summary:
      "Learn how data is modeled, stored, queried, and kept consistent—core ideas every Class 12 CS student should carry into projects and higher study.",
    order: 1,
    category: "Data",
    tags: ["SQL", "normalization", "RDBMS", "transactions"],
    readMinutes: 12,
    sections: [
      {
        heading: "Why databases matter",
        body: `Applications generate facts: enrollments, scores, inventory. Files work for tiny demos, but shared updates, integrity rules, and fast lookup need a **DBMS**—software that organizes storage and exposes a structured interface (often SQL).

A **relational database** stores rows in tables linked by keys. The DBMS enforces types, relationships, and can recover after crashes when configured with logging.`,
        highlights: [
          "DBMS: software layer between applications and physical storage",
          "Relational model: tables, primary keys, foreign keys",
        ],
      },
      {
        heading: "ER modeling → relational tables",
        body: `Start with entities (nouns) and relationships (verbs). Attributes become columns; uniqueness constraints become keys.

Mapping tips:
- 1:M relationship: place the foreign key on the "many" side.
- M:N relationship: introduce a junction table with composite keys.`,
        highlights: ["Entity: a thing with independent existence", "Relationship: association among entities"],
      },
      {
        heading: "Normalization (intuition)",
        body: `Normalization reduces redundancy and update anomalies. Typical targets for Class 12:

- **1NF**: atomic columns; repeating groups split out.
- **2NF**: no partial dependency on part of a composite key.
- **3NF**: no transitive dependency (non-key column depending on another non-key column).

You do not need to memorize every edge case—understand *why* duplicate facts cause bugs when one copy updates and another does not.`,
        highlights: [
          "1NF: atomic values",
          "3NF: every non-key attribute depends only on the key",
        ],
      },
      {
        heading: "SQL building blocks",
        body: `**DDL** shapes schema (\`CREATE TABLE\`, constraints). **DML** changes or reads rows (\`INSERT\`, \`UPDATE\`, \`DELETE\`, \`SELECT\`).

Joins combine tables on keys. Indexes speed lookups but cost space and write time—use on heavily filtered columns.`,
        highlights: ["PRIMARY KEY", "FOREIGN KEY", "JOIN"],
      },
      {
        heading: "Transactions & ACID",
        body: `A **transaction** bundles operations that should succeed or fail together.

**ACID**:
- **Atomicity**: all-or-nothing
- **Consistency**: rules/triggers remain valid
- **Isolation**: concurrent transactions do not read dirty partial work (depending on isolation level)
- **Durability**: committed data survives restart

For boards, be ready to explain *why* banking transfers need atomicity.`,
        highlights: ["ACID: Atomicity, Consistency, Isolation, Durability"],
      },
    ],
  },
  {
    title: "Computer Networks",
    slug: "networking",
    summary:
      "Protocols, addresses, and how packets move across LANs and the Internet—explained as a compact mental model.",
    order: 2,
    category: "Systems",
    tags: ["TCP/IP", "DNS", "HTTP", "topology"],
    readMinutes: 11,
    sections: [
      {
        heading: "LAN, WAN, and the Internet",
        body: `A **LAN** connects devices nearby (school lab, office). A **WAN** spans cities or countries. The **Internet** is a network of networks with standardized protocols so heterogeneous devices interoperate.`,
        highlights: ["Internet = interconnected networks using shared protocols"],
      },
      {
        heading: "Layered models",
        body: `**OSI** (7 layers) is a teaching reference; **TCP/IP** (layers like link, internet, transport, application) is what most real systems implement.

Payloads are wrapped in headers at each step (**encapsulation**). Each layer solves one problem: addressing, routing, reliability, or application semantics.`,
        highlights: ["Encapsulation: headers added per layer"],
      },
      {
        heading: "IP addressing & DNS",
        body: `**IPv4** uses 32-bit addresses (dotted decimal). **IPv6** expands the space.

Humans prefer names; **DNS** maps hostnames to IP addresses hierarchically. The browser first resolves DNS, then opens a transport connection to the service port.`,
        highlights: ["DNS resolves names to IP addresses"],
      },
      {
        heading: "TCP vs UDP",
        body: `**TCP**: connection-oriented, ordered delivery, retransmissions—used by web (HTTP/S), email, file transfer when correctness matters.

**UDP**: lightweight datagrams—used where latency beats perfect delivery (live audio/video, some games) or tiny request/response patterns.`,
        highlights: ["TCP: reliable, ordered stream", "UDP: fast, best-effort"],
      },
      {
        heading: "Application staples",
        body: `**HTTP** requests resources on the web; **HTTPS** adds TLS encryption. **FTP** moves files. **SMTP** sends mail; **POP/IMAP** retrieves it.

Understand **client-server**: many clients talk to centralized services that scale resources.`,
        highlights: ["HTTPS = HTTP + TLS encryption"],
      },
    ],
  },
  {
    title: "Web Technology",
    slug: "web-technology",
    summary:
      "How browsers, servers, and markup work together—from static pages to dynamic APIs students can experiment with.",
    order: 3,
    category: "Applied",
    tags: ["HTML", "CSS", "JS", "HTTP"],
    readMinutes: 10,
    sections: [
      {
        heading: "The request/response cycle",
        body: `You type a URL. The browser resolves DNS, opens a TCP connection (often port 443 for HTTPS), sends an **HTTP request** (method, path, headers, optional body). The server returns a **response** (status, headers, body—HTML, JSON, etc.).

Static sites serve files as-is; dynamic sites generate HTML or JSON from templates/databases/APIs.`,
        highlights: ["HTTP status codes: 2xx success, 4xx client, 5xx server"],
      },
      {
        heading: "HTML: structure & meaning",
        body: `HTML describes structure semantically: headings, lists, forms, landmarks. Accessibility improves when you pick tags for meaning, not only appearance.

Forms collect user input. Important attributes: \`action\`, \`method\`, \`name\`, validation attributes like \`required\`.`,
        highlights: ["Semantic HTML improves accessibility and SEO"],
      },
      {
        heading: "CSS: presentation",
        body: `Selectors target elements; rules set layout and style. The **box model** (content, padding, border, margin) explains spacing.

Modern layout uses **Flexbox** and **Grid**. Prefer relative units (rem, %) for responsive pages; use media queries for breakpoints.`,
        highlights: ["Box model: content + padding + border + margin"],
      },
      {
        heading: "JavaScript on the client",
        body: `JS reacts to events, validates input, fetches JSON from APIs, updates the DOM. **DOM** APIs map the HTML tree so scripts can change text, attributes, and structure.

Separation of concerns: keep structure (HTML), style (CSS), behavior (JS) clear—even if frameworks later blur lines for productivity.`,
        highlights: ["DOM: in-memory representation of the page"],
      },
      {
        heading: "From pages to APIs",
        body: `Many modern apps use **REST-ish JSON APIs**: resources at URLs, verbs for intent, JSON bodies. **JSON** is text-friendly for browsers, mobile, and servers.

You will often pair a frontend (React/Vite) with an API (Express) like this learning platform demonstrates.`,
        highlights: ["JSON: lightweight data interchange format"],
      },
    ],
  },
  {
    title: "C Programming Essentials",
    slug: "c-programming",
    summary:
      "Memory-close thinking: types, control flow, pointers, arrays, and functions—skills that transfer to systems and embedded work.",
    order: 4,
    category: "Programming",
    tags: ["pointers", "arrays", "functions", "structs"],
    readMinutes: 11,
    sections: [
      {
        heading: "Compilation pipeline (mental model)",
        body: `Source (\`.c\`) is preprocessed (\`#include\`, macros), compiled to object code, then **linked** with libraries into an executable. Errors appear at each stage—learn to read compiler messages; they usually point near the root cause.`,
        highlights: ["Linker resolves symbols across object files"],
      },
      {
        heading: "Types, operators, control flow",
        body: `C is statically typed but does not hold your hand: implicit conversions happen. Know \`int\`, \`float\`, \`double\`, \`char\`, and **modulo quirks** with negatives.

Control flow: \`if/else\`, \`switch\`, loops (\`for\`, \`while\`, \`do-while\`). Prefer clarity over clever one-liners on exams.`,
        highlights: ["Every expression has a type; watch promotions"],
      },
      {
        heading: "Functions & scope",
        body: `Functions enable decomposition. Prototypes declare interfaces; definitions implement. **Scope** limits identifier visibility; **lifetime** ties to storage duration (automatic vs static).

Pass by value copies; to modify caller data, pass a pointer.`,
        highlights: ["Pass by value vs address (pointer)"],
      },
      {
        heading: "Arrays, strings, pointers",
        body: `Array names often decay to pointers to the first element. **Pointer arithmetic** moves by element size—powerful and easy to misuse.

C strings are **NUL-terminated** \`char\` arrays. Standard library helpers (\`strlen\`, \`strcpy\`, etc.) assume valid termination—buffer overflows are historical bug farms.`,
        highlights: ["Pointer: stores address of another object"],
      },
      {
        heading: "Structures & files",
        body: `**struct** groups related fields; **typedef** can shorten names. Prefer small functions that operate on structs cleanly.

**FILE\*** I/O (\`fopen\`, \`fscanf\`, \`fprintf\`, \`fclose\`) reads/writes persistent data. Always check return values.`,
        highlights: ["struct: composite user-defined type"],
      },
    ],
  },
  {
    title: "Object-Oriented Programming",
    slug: "oop",
    summary:
      "Encapsulation, inheritance, polymorphism, abstraction—how to model problems as collaborating objects.",
    order: 5,
    category: "Programming",
    tags: ["classes", "inheritance", "polymorphism", "UML"],
    readMinutes: 10,
    sections: [
      {
        heading: "The four pillars (exam framing)",
        body: `**Encapsulation**: bundle data + methods; expose a small, stable interface. **Abstraction**: hide irrelevant detail, show essentials.

**Inheritance**: reuse and extend behavior in a hierarchy. **Polymorphism**: one interface, many behaviors—often via overriding or interfaces.`,
        highlights: ["Encapsulation protects invariants"],
      },
      {
        heading: "Classes & objects",
        body: `A **class** is a blueprint; an **object** is a concrete instance. Constructors establish valid starting states; destructors (where present) release resources.

Fields can be instance-level (per object) or class-level (shared metadata/constants depending on language).`,
        highlights: ["Object: state + behavior"],
      },
      {
        heading: "Relationships",
        body: `**IS-A** → inheritance (a Student *is a* Person). **HAS-A** → composition (a Car *has an* Engine).

Prefer **composition over inheritance** when behavior varies widely—inheritance can become rigid.`,
        highlights: ["Composition: build complex objects from parts"],
      },
      {
        heading: "Polymorphism in practice",
        body: `A superclass reference can point at subclass objects; calling an overridden method resolves at runtime in languages with **dynamic dispatch**.

Design patterns (Observer, Strategy, Factory) leverage polymorphism—names are optional for Class 12, the *idea* is not.`,
        highlights: ["Overriding: subclass replaces superclass method"],
      },
      {
        heading: "Mini design checklist",
        body: `Before coding: identify nouns → candidate classes; verbs → methods; constraints → validation. Draw a simple **UML** class diagram when problems feel tangled.

Tests and refactors become easier when each class owns one clear responsibility.`,
        highlights: ["UML class diagram: classes, fields, associations"],
      },
    ],
  },
  {
    title: "Software Process Models",
    slug: "software-process-models",
    summary:
      "How teams plan, build, test, and ship software—waterfall vs iterative vs agile, tied to risk and feedback.",
    order: 6,
    category: "Engineering",
    tags: ["SDLC", "Agile", "waterfall", "testing"],
    readMinutes: 9,
    sections: [
      {
        heading: "SDLC overview",
        body: `The **Software Development Life Cycle** spans requirements, design, implementation, testing, deployment, maintenance—not always strictly sequential.

Pick a process that fits uncertainty: stable specs favor plan-driven approaches; evolving products favor iterative feedback.`,
        highlights: ["SDLC: end-to-end software journey"],
      },
      {
        heading: "Waterfall",
        body: `Phases cascade: finish requirements before design, design before code, etc. Easy to document and audit; risky when users discover late that the spec was wrong.

Useful when failures are costly and change is rare (some regulated domains).`,
        highlights: ["Waterfall: sequential, document-heavy"],
      },
      {
        heading: "Incremental & iterative",
        body: `Build thin slices that work end-to-end, then expand. Early versions validate assumptions and reduce big-bang integration risk.

**Prototyping** clarifies fuzzy UIs or algorithms before full build-out.`,
        highlights: ["Iterative: repeated refine cycles"],
      },
      {
        heading: "Agile mindset",
        body: `**Agile** values working software, collaboration, responding to change. Frameworks like **Scrum** time-box work in sprints with inspect-and-adapt loops.

Ceremonies/backlogs matter less than principles: frequent delivery, test feedback, stakeholder involvement.`,
        highlights: ["Agile: short cycles, continuous feedback"],
      },
      {
        heading: "QA vocabulary",
        body: `**Verification**: are we building the product right? **Validation**: are we building the right product?

Testing layers: unit (small pieces), integration (components together), system (whole), acceptance (user goals). Automate what repeats.`,
        highlights: ["Validation vs verification"],
      },
    ],
  },
  {
    title: "Emerging & Recent Technology",
    slug: "emerging-technology",
    summary:
      "Contemporary threads students should recognize—cloud, AI-assisted tools, privacy, and sustainable computing—without hype.",
    order: 7,
    category: "Trends",
    tags: ["cloud", "AI ethics", "security", "green computing"],
    readMinutes: 8,
    sections: [
      {
        heading: "Cloud & edge computing",
        body: `**Cloud** delivers compute/storage over networks with elastic scaling. **SaaS** gives apps; **IaaS** gives VMs; **PaaS** abstracts runtimes.

**Edge** moves processing closer to sensors/users to cut latency—think CDN nodes, on-device inference.`,
        highlights: ["Elasticity: scale resources with demand"],
      },
      {
        heading: "Data & intelligent systems",
        body: `Machine learning finds patterns in data; it is not magic—quality data, clear objectives, and evaluation metrics decide usefulness.

**Generative AI** tools assist writing and code, but outputs need human review; factual errors and bias persist.`,
        highlights: ["Train/test thinking: avoid learning the exam by heart"],
      },
      {
        heading: "Security & privacy",
        body: `Threat models ask: who might attack, how, and what breaks? Basics: least privilege, encryption in transit (TLS) and at rest, patching, MFA.

**Privacy** aligns with consent and data minimization—collect only what you need, explain retention.`,
        highlights: ["Defense in depth: multiple independent controls"],
      },
      {
        heading: "Accessibility & inclusion",
        body: `Software should be usable with keyboards, screen readers, and adequate contrast. Inclusive design benefits everyone—not only labeled "disabled" users.`,
        highlights: ["A11y: accessibility is a quality attribute"],
      },
      {
        heading: "Responsible computing",
        body: `Energy use and ewaste matter. Efficient algorithms, turning off idle GPUs, and longer hardware lifecycles reduce footprint.

As future builders, balance features with maintenance cost—simple, observable systems age better.`,
        highlights: ["Green computing: efficiency across hardware/software lifecycle"],
      },
    ],
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  await Note.deleteMany({});
  await Note.insertMany(chapters);
  console.log(`Seeded ${chapters.length} chapters`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
