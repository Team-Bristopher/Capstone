using System;

namespace capstone_api.OutgoingMessages
{
	/// <summary>
	/// Contains information about a newly created fundraiser.
	/// </summary>
	public class CreateFundraiserResponseMessage
	{
		/// <summary>
		/// The ID of the newly created fundraiser.
		/// </summary>
		public Guid FundraiserID { get; set; }
	}
}

