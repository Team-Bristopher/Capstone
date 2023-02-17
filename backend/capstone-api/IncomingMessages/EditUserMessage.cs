using System;
using System.ComponentModel.DataAnnotations;

namespace capstone_api.IncomingMessages
{
	/// <summary>
	/// Contains information that
	/// updates a user information.
	/// </summary>
	public class EditUserMessage
	{
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
    }
}

