using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
    /// <summary>
    /// Contains information about the Fundraiser
    /// database entity.
    /// </summary>
    [Table("Fundraisers")]
    public class Fundraiser
	{
		/// <summary>
		/// The unique identifier of the Fundraiser.
		/// </summary>
		[Required]
        [Key]
		public Guid ID { get; set; }

        /// <summary>
        /// The type of the Fundraiser.
        /// </summary>
        [Required]
        public FundraiserType? Type { get; set; }

		/// <summary>
		/// The title of the Fundraiser.
		/// </summary>
		[Required]
		[MinLength(3)]
        [MaxLength(128)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The description of the Fundraiser.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(2048)]
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// The amount of views of the Fundraiser.
        /// </summary>
        [Required]
        public long Views { get; set; }

        /// <summary>
        /// The USD target of the Fundraiser.
        /// </summary>
        [Required]
        public double Target { get; set; }

		/// <summary>
		/// The date and time the Fundraiser was created.
		/// </summary>
		[Required]
		public DateTime CreatedOn { get; set; }

		/// <summary>
		/// The date and time the Fundraiser was last modified.
		/// </summary>
		[Required]
		public DateTime ModifiedOn { get; set; }

        /// <summary>
        /// The date and time the Fundraiser will expire.
        /// </summary>
        [Required]
        public DateTime EndDate { get; set; }

        /// <summary>
        /// The unique identifier of the user that created
        /// this Fundraiser.
        /// </summary>
        [Required]
        public Guid CreatedByUserID { get; set; }

        /// <summary>
        /// The User model that created this Fundraiser.
        /// </summary>
        [Required]
        [ForeignKey(nameof(CreatedByUserID))]
        public User? CreatedByUser { get; set; }

        /// <summary>
        /// The Comments tied to this Fundraiser.
        /// </summary>
        [Required]
        public List<Comment> Comments { get; set; } = new List<Comment>();

        /// <summary>
        /// The Donatins tied to this Fundraiser.
        /// </summary>
        [Required]
        public List<Donation> Donations { get; set; } = new List<Donation>();

        /// <summary>
        /// The FundraiserAdmins tied to this Fundraiser.
        /// </summary>
        [Required]
        public List<FundraiserAdmin> Admins { get; set; } = new List<FundraiserAdmin>();
    }
}

