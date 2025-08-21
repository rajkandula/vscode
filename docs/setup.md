# Development Setup

Install the following tools before working with this repository:

- **Node.js 22.17.0** – specified in `.nvmrc` and required for building.
- **npm** – used to manage Node.js dependencies (bundled with Node.js).
- **Python 3** – required for native build scripts.
- **C/C++ build tools**
  - Linux: `gcc`, `g++`, `make`, and related packages (e.g. `build-essential`).
  - macOS: Xcode Command Line Tools.
  - Windows: Visual Studio Build Tools with the C++ workload.

With the prerequisites installed, install dependencies and start a development build:

```bash
npm install
npm run watch
npm run start   # desktop
npm run web     # browser
```

## Environment Variables

Copy `.env.example` to `.env` and set your local values:

```bash
cp .env.example .env
```

Never commit real API keys or secrets. Load variables from this file with a library such as [`dotenv`](https://www.npmjs.com/package/dotenv) or your build tooling.

## Manual Test

1. Open the chat view from the Activity Bar.
2. Ask **"Summarize open file"**.
3. Confirm the assistant returns a summary of the active file.
4. If you encounter issues, please file an issue with logs and reproduction steps.

