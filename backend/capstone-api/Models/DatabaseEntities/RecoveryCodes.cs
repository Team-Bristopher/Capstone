using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
	/// <summary>
	/// Contains information about the RecoveryCodes
	/// database entity.
	/// </summary>
	[Table("RecoveryCodes")]
	public class RecoveryCodes
	{
        /// <summary>
        /// The unique identifier of the RecoveryCode.
        /// </summary>
        [Required]
        [Key]
        public Guid ID { get; set; }

        /// <summary>
        /// The 6 digit recovery code
        /// the user needs to recover their password.
        /// </summary>
        [Required]
        public int Code { get; set; }

        /// <summary>
        /// The authentication code that
        /// the users send after they successfully
        /// enter the recovery code.
        /// </summary>
        [Required]
        public string RecoveryAuthenticationCode { get; set; }

        /// <summary>
        /// The date & time the RecoveryCode was requested.
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Indicates whether the user has sucessfully recovered
        /// their account.
        /// </summary>
        [Required]
        public bool IsComplete { get; set; }

        /// <summary>
        /// The date & time the recovery code expires.
        /// </summary>
        [Required]
        public DateTime ExpiresAt { get; set; }

        /// <summary>
        /// The unique identifier of the user that
        /// requested the account recovery code.
        /// </summary>
        [Required]
        public Guid RequestedFor { get; set; }

        /// <summary>
        /// The user model that requested
        /// the account recovery.
        /// </summary>
        [Required]
        [ForeignKey(nameof(RequestedFor))]
        public User? RequestedForUser { get; set; } 
    }
}

