using System;
using System.ComponentModel.DataAnnotations;
using capstone_api.Models.Constants;

namespace capstone_api.Models.OutgoingMessages
{
	/// <summary>
	/// Contains information that is sent
	/// when the client is requesting their
	/// account information.
	/// </summary>
	public class MyUserMessage
	{
		/// <summary>
		/// The unique identifier of the user.
		/// </summary>
		[Required]
		public Guid ID { get; set; }

		/// <summary>
		/// The first name.
		/// </summary>
		[Required]
		public string FirstName { get; set; }

        /// <summary>
        /// The last name.
        /// </summary>
        [Required]
        public string LastName { get; set; }

		/// <summary>
		/// The email address.
		/// </summary>
		[Required]
		public string Email { get; set; }

		/// <summary>
		/// The profile picture URL.
		/// </summary>
		public string ProfilePictureURL { get; set; }

		/// <summary>
		/// The role of the user.
		/// </summary>
		[Required]
		public UserRoles Role { get; set; }
    }
}

