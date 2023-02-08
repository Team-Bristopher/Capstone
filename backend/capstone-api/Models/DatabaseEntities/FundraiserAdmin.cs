using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
    /// <summary>
    /// Contains information about the FundraiserAdmin
    /// database entity.
    /// </summary>
    [Table("FundraiserAdmins")]
    public class FundraiserAdmin
	{
        /// <summary>
        /// The unique identifier of the donater tied to this
        /// FundraiserAdmin.
        /// </summary>
        [Required]
        public Guid UserID { get; set; }

        /// <summary>
        /// The unique identifier of the fundraiser tied to this
        /// FundraiserAdmin.
        /// </summary>
        [Required]
        public Guid FundraiserID { get; set; }

        /// <summary>
        /// The Fundraiser model tied to this
        /// FundraiserAdmin.
        /// </summary>
        [Required]
        [ForeignKey(nameof(FundraiserID))]
        public Fundraiser? Fundraiser { get; set; }

        /// <summary>
        /// The User model tied to this
        /// FundraiserAdmin.
        /// </summary>
        [Required]
        [ForeignKey(nameof(UserID))]
        public User? User { get; set; }
    }
}

