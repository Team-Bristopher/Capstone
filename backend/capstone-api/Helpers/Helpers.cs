using System;

namespace capstone_api.Helpers
{
	/// <summary>
	/// Global helpers class for functions that we might
	/// need across the entire API domain.
	/// </summary>
	public static class Helpers
	{
		/// <summary>
		/// Verifies that a string passed in is not null
		/// or empty.
		/// </summary>
		/// <param name="_string">The string to verify.</param>
		/// <param name="variableName">The developer-given name of the variable.</param>
		/// <exception cref="Exception">Will be thrown if the variable is null or empty.</exception>
		public static void VerifyIsNotNull(string _string, string variableName)
		{
			if (String.IsNullOrWhiteSpace(_string))
			{
				throw new Exception($"{variableName} cannot be null or empty.");
			}
		}
	}
}

