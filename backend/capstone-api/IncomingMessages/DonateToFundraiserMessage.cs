using System.ComponentModel.DataAnnotations;

namespace capstone_api.IncomingMessages
{
	/// <summary>
	/// Contains information about donating to a fundraiser.
	/// </summary>
	public class DonateToFundraiserMessage
	{
        /// <summary>
        /// The ID of the fundraiser to donate to.
        /// </summary>
        [Required]
        public Guid FundraiserID { get; set; }

		/// <summary>
		/// The amount to be donated.
		/// </summary>
		[Required]
		public double Amount { get; set; }

        /// <summary>
        /// Nullable, default is an empty GUID, which is the anonymouse user.
        /// The user ID of the donating user, if the user is logged in.        
        /// </summary>
        public Guid UserID { get; set; } = Guid.Empty;

		/// <summary>
		/// Nullable, default is false.
		/// </summary>
		public bool IsSavingPaymentInformation { get; set; } = false;

		/// <summary>
		/// The first name of the card.
		/// </summary>
		[Required]
		[MinLength(3)]
		public string FirstName { get; set; }

        /// <summary>
        /// The last name of the card.
        /// </summary>
        [Required]
        [MinLength(3)]
        public string LastName { get; set; }

        /// <summary>
        /// The debit/credit card number that is being used.
        /// </summary>
        [Required]
        [MinLength(16)]
		[MaxLength(16)]
        public string CardNumber { get; set; }

        /// <summary>
        /// The expiration date of the card.
        /// </summary>
        [Required]
        [MinLength(5)]
        [MaxLength(5)]
        public string ExpirationDate { get; set; }

        /// <summary>
        /// The security code of the card.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(3)]
        public string SecurityCode { get; set; }
	}
}

