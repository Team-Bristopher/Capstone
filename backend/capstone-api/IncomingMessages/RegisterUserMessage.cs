using System;
using System.ComponentModel.DataAnnotations;

namespace capstone_api.IncomingMessages
{
    /// <summary>
    /// Contains the information a new user
    /// will be sending to register.
    /// </summary>
    public class RegisterUserMessage
	{
        /// <summary>
        /// The first name of the user.
        /// </summary>
        [Required]
		[MinLength(3)]
		[MaxLength(15)]
		public string FirstName { get; set; }

        /// <summary>
        /// The last name of the user.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(15)]
        public string LastName { get; set; }

        /// <summary>
        /// The email address of the user.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(75)]
        public string EmailAddress { get; set; }

        /// <summary>
        /// The password of the user.
        /// </summary>
        [Required]
        [MinLength(5)]
        [MaxLength(50)]
        public string Password { get; set; }
    }
}

