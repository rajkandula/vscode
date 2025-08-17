# Bundled Extensions

The repository bundles curated extensions under the `extensions/` folder. Each extension declares its dependencies and configuration to ensure consistent builds.

## `vscode.curated-sample`

- **Purpose**: Demonstrates how an in-house curated extension can be bundled and configured.
- **Dependencies**: Requires the built-in `vscode.git` extension.
- **Configuration**:
  - `curatedSample.enable` &ndash; boolean, enables Curated Sample features (default: `true`).

### Scaffolding new integrations

For new in-house integrations, scaffold extensions using the Yeoman generator:

```sh
npm install -g yo generator-code
yo code
```
