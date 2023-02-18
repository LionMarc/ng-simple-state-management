using System.Text.RegularExpressions;

namespace Dotnet.Tools;

public static class RegexTools
{
    public static RegexValidationResult Validate(string pattern)
    {
        try
        {
            var regex = new Regex(pattern);
            return new RegexValidationResult { IsValid = true };
        }
        catch (Exception ex)
        {
            return new RegexValidationResult { IsValid = false, Error = ex.Message };
        }
    }

    public static bool IsMatch(string pattern, string expression)
    {
        try
        {
            return new Regex(pattern).IsMatch(expression);
        }
        catch
        {
            return false;
        }
    }
}
