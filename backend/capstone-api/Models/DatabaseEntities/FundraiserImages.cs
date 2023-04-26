using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
	/// <summary>
	/// Contains information about the FundraiserImages
	/// database entity.
	/// </summary>
	public class FundraiserImages
	{
        /// <summary>
        /// The unique identifier of the FundraiserImage.
        /// </summary>
        [Required]
        [Key]
        public Guid ID { get; set; }

        /// <summary>
        /// The URL of the fundraiser image.
        /// </summary>
        [Required]
        [MinLength(3)]
        public string FundraiserImageURL { get; set; }

        /// <summary>
        /// The unique identifier of the Fundraiser this
        /// FundraiserImage is tied to.
        /// </summary>
        [Required]
        public Guid FundraiserID { get; set; }

        /// <summary>
        /// The DateTime the image was uploaded at.
        /// </summary>
        [Required]
        public DateTime UploadedAt { get; set; }

        /// <summary>
        /// The Fundraiser entity tied to this/these FundraiserImage(s).
        /// </summary>
        [Required]
        [ForeignKey(nameof(FundraiserID))]
        public Fundraiser Fundraiser { get; set; }
    }
}

