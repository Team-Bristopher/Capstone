using System;

namespace capstone_api.OutgoingMessages
{
	/// <summary>
	/// Contains information about how much
	/// has been donated to a certain fundraiser.
	/// </summary>
	public class FundraiserDonationAmountMessage
	{
		/// <summary>
		/// The amount that has been donated to a particular
		/// fundraiser.
		/// </summary>
		public double Amount { get; set; }
	}
}

