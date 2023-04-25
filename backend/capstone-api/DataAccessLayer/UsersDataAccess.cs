using System;
using Bogus;
using capstone_api.IncomingMessages;
using capstone_api.Models.DatabaseEntities;

namespace capstone_api.DataAccessLayer
{
	/// <summary>
	/// The data access layer for users
	/// operations.
	/// </summary>
	public interface IUsersDataAccess
	{
        /// <summary>
        /// Edits a user.
        /// </summary>
		/// <param name="userID">The unique identifier of the user.</param>
        /// <param name="message">The information to edit user by.</param>
        public void EditUser(Guid userID, EditUserMessage message);

		/// <summary>
		/// Adds the user's profile picture to save in the databse.
		/// </summary>
		/// <param name="userID">The ID of the user to update the profile picture of.</param>
		/// <param name="newProfilePictureURL">The URL of the profile picture in AWS S3.</param>
		public Task EditUserProfilePicture(Guid userID, string newProfilePictureURL);

        /// <summary>
        /// Gets a user by their email address, otherwise returns null.
        /// </summary>
        /// <param name="emailAddress">The email address.</param>
        /// <returns>User if lookup was successful, otherwise null.</returns>
        public User? GetUserByEmail(string emailAddress);

		/// <summary>
		/// Gets the user by unique identifier.
		/// </summary>
		/// <param name="userID">The unique identifier.</param>
		/// <returns>The user if found, otherwise null.</returns>
		public User? GetUserByID(Guid userID);
    }

	public class UsersDataAccess : IUsersDataAccess
	{
		private readonly DatabaseContext _databaseContext;

		/// <summary>
		/// Constructor.
		/// </summary>
		/// <param name="databaseContext">The database context.</param>
		public UsersDataAccess(
			DatabaseContext databaseContext)
		{
			_databaseContext = databaseContext;
		}

		/// <inheritdoc />
        public void EditUser(Guid userID, EditUserMessage message)
		{
			User user = _databaseContext.Users
				.Where(a => a.ID.Equals(userID))
				.First();

			user.FirstName = message.FirstName;
			user.LastName = message.LastName;

			_databaseContext.SaveChanges();
		}

		public async Task EditUserProfilePicture(Guid userID, string newProfilePictureURL)
		{
            User user = _databaseContext.Users
                .Where(a => a.ID.Equals(userID))
                .First();

			user.ProfilePictureURL = newProfilePictureURL;

            await _databaseContext.SaveChangesAsync();
		}

		/// <inheritdoc />
        public User? GetUserByEmail(string emailAddress)
		{
            return _databaseContext.Users
                .Where(a => a.EmailAddress.Equals(emailAddress))
                .FirstOrDefault();
		}

		/// <inheritdoc />
        public User? GetUserByID(Guid userID)
		{
			return _databaseContext.Users
				.Where(a => a.ID.Equals(userID))
				.FirstOrDefault();
		}
    }
}

