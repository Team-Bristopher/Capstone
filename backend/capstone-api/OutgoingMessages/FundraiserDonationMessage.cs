namespace capstone_api.OutgoingMessages
{
	/// <summary>
	/// Conatins information about fundriaser donations.
	/// </summary>
	public class FundraiserDonationMessage
	{
		/// <summary>
		/// First name of the user donating.
		/// </summary>
		public string FirstName { get; set; }

		/// <summary>
		/// Last name of the user donating.
		/// </summary>
		public string LastName { get; set; }

		/// <summary>
		/// The amount donated by the user.
		/// </summary>
		public double IndividualAmount { get; set; }

		/// <summary>
		/// The time & date the donation was made.
		/// </summary>
		public DateTime DonatedAt { get; set; }

		/// <summary>
		/// Nullable. The optional message along with the donation.
		/// </summary>
		public string Message { get; set; } = string.Empty;
	}
}

