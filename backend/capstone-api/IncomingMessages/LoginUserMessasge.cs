using System;
using System.ComponentModel.DataAnnotations;

namespace capstone_api.IncomingMessages
{
	/// <summary>
	/// Contains the information a returning
	/// user will be using to login.
	/// </summary>
	public class LoginUserMessage
	{
        /// <summary>
        /// The email address of the user.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(75)]
        public string Email { get; set; }

        /// <summary>
        /// The hashed password of the user.
        /// </summary>
        [Required]
        [MinLength(5)]
        [MaxLength(50)]
        public string Password { get; set; }
    }
}

