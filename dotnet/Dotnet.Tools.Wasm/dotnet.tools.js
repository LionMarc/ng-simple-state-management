// Set up the .NET WebAssembly runtime
import { dotnet } from './dotnet.js'

// Get exported methods from the .NET assembly
const { getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .create();

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

if (!window.dotnet) {
    window.dotnet = {};
}

window.dotnet.tools = exports.Dotnet.Tools.Wasm;
