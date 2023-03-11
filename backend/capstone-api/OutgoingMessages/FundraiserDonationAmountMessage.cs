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
		/// The total amount that has been donated
		/// to a particular fundraiser.
		/// </summary>
		public double TotalAmount { get; set; }

		/// <summary>
		/// The last 10 most recent donations for this fundraiser.
		/// </summary>
		public List<FundraiserDonationMessage> RecentDonations { get; set; } = new List<FundraiserDonationMessage>();
	}
}

