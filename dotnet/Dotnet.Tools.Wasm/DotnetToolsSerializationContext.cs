using System.Text.Json.Serialization;

namespace Dotnet.Tools.Wasm;

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(RegexValidationResult))]
public partial class DotnetToolsSerializationContext : JsonSerializerContext
{
}
