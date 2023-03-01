using System;

namespace capstone_api.OutgoingMessages
{
	/// <summary>
	/// Contains information about a user.
	/// </summary>
	public class UserMessage
	{
		/// <summary>
		/// The first name of the user.
		/// </summary>
		public string FirstName { get; set; }

		/// <summary>
		/// The last name of the user.
		/// </summary>
		public string LastName { get; set; }
	}
}

