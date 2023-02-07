using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone_api.Models.DatabaseEntities
{
	/// <summary>
	/// Contains information about the GlobalAdmin
	/// database entity.
	/// </summary>
	[Table("GlobalAdmins")]
	public class GlobalAdmin
	{
		/// <summary>
		/// The unique identifier of the user that is
		/// a GlobalAdmin.
		/// </summary>
		[Required]
		[Key]
		public Guid UserID { get; set; }

        /// <summary>
        /// The User model tied to this
        /// GlobalAdmin.
        /// </summary>
        [Required]
        [ForeignKey(nameof(UserID))]
        public User? User { get; set; }
    }
}

