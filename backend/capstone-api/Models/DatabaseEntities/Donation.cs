using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
    /// <summary>
    /// Contains information about the Donations
    /// database entity.
    /// </summary>
    [Table("Donations")]
    public class Donation
	{
		/// <summary>
		/// The unique identifier of the Donation.
		/// </summary>
		[Required]
        [Key]
        public Guid ID { get; set; }

        /// <summary>
        /// The unique identifier of the donater tied to this
        /// Donation.
        /// </summary>
        [Required]
        public Guid UserID { get; set; }

        /// <summary>
        /// The unique identifier of the fundraiser tied to this
        /// Donation.
        /// </summary>
        [Required]
        public Guid FundraiserID { get; set; }

        /// <summary>
        /// The Fundraiser model tied to this
        /// Donation.
        /// </summary>
        [Required]
        [ForeignKey(nameof(FundraiserID))]
        public Fundraiser? Fundraiser { get; set; }

        /// <summary>
        /// The User model tied to this
        /// Donation.
        /// </summary>
        [Required]
        [ForeignKey(nameof(UserID))]
        public User? DonatedBy { get; set; }

        /// <summary>
        /// The amount that was donated.
        /// </summary>
        [Required]
        public double Amount { get; set; }

        /// <summary>
        /// Optional. The message that is sent along
        /// with the donation.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(256)]
        public string Message { get; set; } = string.Empty;
    }
}

