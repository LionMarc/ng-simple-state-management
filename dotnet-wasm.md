# Running C# code using wasm

First try with the regex editor: allow checking the regex from C# instead of javascript code.
(see [here](https://learn.microsoft.com/en-us/aspnet/core/client-side/dotnet-interop?view=aspnetcore-7.0)).

- Creation of a .NET 7 library to contain the C# code
- Installation of workload
    ```
    dotnet workload install wasm-tools
    ```
- Publishing project
    ```
    dotnet publish dotnet/Dotnet.Tools.Wasm/Dotnet.Tools.Wasm.csproj --configuration Release
    rm -rf src/assets/dotnet
    mkdir -p src/assets/dotnet/dotnet-tools
    cp -r dotnet/Dotnet.Tools.Wasm/bin/Release/net7.0/browser-wasm/AppBundle/* src/assets/dotnet/dotnet-tools
    ```
- Update *src/index.html*
    ```
    <script type="module" src="./assets/dotnet/dotnet-tools/dotnet.tools.js"></script>
    ```