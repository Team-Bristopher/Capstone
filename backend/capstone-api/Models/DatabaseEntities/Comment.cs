using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
    /// <summary>
    /// Contains information about the Comments
    /// database entity.
    /// </summary>
    [Table("Comments")]
    public class Comment
	{
        /// <summary>
        /// The unique identifier of the Comment.
        /// </summary>
        [Required]
        [Key]
        public Guid ID { get; set; }

        /// <summary>
        /// The unique identifier of the donater tied to this
        /// Comment.
        /// </summary>
        [Required]
        public Guid UserID { get; set; }

        /// <summary>
        /// The unique identifier of the Fundraiser tied to this
        /// Comment.
        /// </summary>
        [Required]
        public Guid FundraiserID { get; set; }

        /// <summary>
        /// The Fundraiser model tied to this
        /// Comment.
        /// </summary>
        [Required]
        [ForeignKey(nameof(FundraiserID))]
        public Fundraiser? Fundraiser { get; set; }

        /// <summary>
        /// The User model tied to this
        /// Comment.
        /// </summary>
        [Required]
        [ForeignKey(nameof(UserID))]
        public User? User { get; set; }

        /// <summary>
        /// The comment text tied to this Comment.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(512)]
        public string CommentText { get; set; } = string.Empty;
    }
}

