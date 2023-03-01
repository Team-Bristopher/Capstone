using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
    /// <summary>
    /// Contains information about the User
    /// database entity.
    /// </summary>
    [Table("Users")]
    public class User
	{
        /// <summary>
        /// The unique identifier of the User.
        /// </summary>
        [Required]
        [Key]
        public Guid ID { get; set; }

        /// <summary>
        /// The first name of the User.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(24)]
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// The last name of the User.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(24)]
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// The email address of the User.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(48)]
        public string EmailAddress { get; set; } = string.Empty;

        /// <summary>
        /// The hashed password of the User.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(512)]
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// The comments this User has commented.
        /// </summary>
        [Required]
        public List<Comment> Comments { get; set; } = new List<Comment>();

        /// <summary>
        /// The donations this User has donated.
        /// </summary>
        [Required]
        public List<Donation> Donations { get; set; } = new List<Donation>();

        /// <summary>
        /// The fundraisers this User has created.
        /// </summary>
        [Required]
        public List<Fundraiser> CreatedFundraisers { get; set; } = new List<Fundraiser>();

        /// <summary>
        /// The fundraisers this User has viewed.
        /// </summary>
        [Required]
        public List<FundraiserView> ViewedFundraisers { get; set; } = new List<FundraiserView>();
    }
}

