using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
	/// <summary>
	/// Contains information about the FundraiserView
	/// database entity.
	/// </summary>
	[Table("FundraiserViews")]
	public class FundraiserView
	{
        /// <summary>
        /// The unique identifier of the FundraiserView.
        /// </summary>
        [Required]
        [Key]
        public Guid ID { get; set; }

        /// <summary>
        /// The unique identifier of the user that
        /// viewed the fundraiser.
        /// </summary>
        [Required]
        public Guid ViewedByID { get; set; }

        /// <summary>
        /// The unique identifier of the fundraiser that
        /// was viewed.
        /// </summary>
        [Required]
        public Guid FundraiserID { get; set; }

        /// <summary>
        /// The date & time the fundraiser was viewed.
        /// </summary>
        [Required]
        public DateTime ViewedOn { get; set; }

        /// <summary>
        /// The User model that viewed the fundraiser.
        /// </summary>
        [Required]
        [ForeignKey(nameof(ViewedByID))]
        public User? ViewedByUser { get; set; }

        /// <summary>
        /// The Fundraiser model that was viewed.
        /// </summary>
        [Required]
        [ForeignKey(nameof(FundraiserID))]
        public Fundraiser? ViewedFundraiser { get; set; }
    }
}

