using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;

namespace Dotnet.Tools.Wasm;

public partial class regexToolsApi
{
    [JSExport]
    public static string validatePattern(string pattern)
    {
        return JsonSerializer.Serialize(RegexTools.Validate(pattern), typeof(RegexValidationResult), DotnetToolsSerializationContext.Default);
    }

    [JSExport]
    public static bool isMatch(string pattern, string expression)
    {
        return RegexTools.IsMatch(pattern, expression);
    }
}
