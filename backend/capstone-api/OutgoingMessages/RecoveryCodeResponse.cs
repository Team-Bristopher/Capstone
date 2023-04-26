using System.ComponentModel.DataAnnotations;

namespace capstone_api.OutgoingMessages
{
	/// <summary>
	/// Contains information about recovery
	/// code response.
	/// </summary>
	public class RecoveryCodeResponse
	{
		[Required]
		public string RecoveryCodeAuthenticationCode { get; set; }
	}
}

