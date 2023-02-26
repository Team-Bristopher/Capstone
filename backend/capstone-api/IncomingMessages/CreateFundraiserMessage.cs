using System;
using System.ComponentModel.DataAnnotations;

namespace capstone_api.IncomingMessages
{
	/// <summary>
	/// Contains information used to create a Fundraiser.
	/// </summary>
	public class CreateFundraiserMessage
	{
		/// <summary>
		/// The title of the fundraiser.
		/// </summary>
		[Required]
		[MinLength(3)]
		[MaxLength(256)]
		public string Title { get; set; }

		/// <summary>
		/// The description of the fundraiser.
		/// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(5026)]
        public string Description { get; set; }

		/// <summary>
		/// The goal amount of the fundraiser.
		/// </summary>
		[Required]
		public double Goal { get; set; }

		/// <summary>
		/// The date of expiration of the fundraiser.
		/// </summary>
		[Required]
		public DateTime ExpirationDate { get; set; }

		/// <summary>
		/// The category of the fundraiser.
		/// </summary>
		[Required]
		public FundraiserTypes Category { get; set; }
    }
}

