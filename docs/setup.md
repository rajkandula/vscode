# Development Setup

Install the following tools before working with this repository:

- **Node.js 22.17.0** – specified in `.nvmrc` and required for building.
- **Yarn** – used to manage Node.js dependencies.
- **Python 3** – required for native build scripts.
- **C/C++ build tools**
  - Linux: `gcc`, `g++`, `make`, and related packages (e.g. `build-essential`).
  - macOS: Xcode Command Line Tools.
  - Windows: Visual Studio Build Tools with the C++ workload.

With the prerequisites installed, install dependencies and start a development build:

```bash
yarn
yarn watch
yarn web
```
