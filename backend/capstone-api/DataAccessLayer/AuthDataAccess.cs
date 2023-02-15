using System;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
using capstone_api.Models.DatabaseEntities;

namespace capstone_api.DataAccessLayer
{
	/// <summary>
	/// Contains data access logic for authenticating users.
	/// </summary>
	public interface IAuthDataAccess
	{
        /// <summary>
        /// Registers a user.
        /// </summary>
        /// <param name="message">The information about the user.</param>
        /// <returns>An instance of <see cref="Task"/></returns>
        public Task RegisterUser(RegisterUserMessage message);

		/// <summary>
		/// Gets a user by email.
		/// </summary>
		/// <param name="email">The email address.</param>
		/// <returns>The user, or null if the user doesn't exist.</returns>
		public User? GetUserByEmail(string email);

		/// <summary>
		/// Gets the user by ID.
		/// </summary>
		/// <param name="ID">The ID of the user.</param>
		/// <returns>The user, or null if the user doesn't exist.</returns>
		public User? GetUserByID(Guid ID);

        /// <summary>
        /// Gets the role for a user.
        /// </summary>
        /// <param name="userID">The unique identifier of the user.</param>
        /// <returns>The role of the user if the user is found, otherwise null.</returns>
        public UserRoles? GetUserRole(Guid userID);
    }

	/// <inheritdoc />
	public class AuthDataAccess : IAuthDataAccess
	{
		private readonly DatabaseContext _databaseContext;

		/// <summary>
		/// Constructor.
		/// </summary>
		public AuthDataAccess(DatabaseContext databaseContext)
		{
			_databaseContext = databaseContext;
		}

		/// <inheritdoc />
		public async Task RegisterUser(RegisterUserMessage user)
		{
			User newUser = new User()
			{
				ID = new Guid(),
				FirstName = user.FirstName,
				LastName = user.LastName,
				EmailAddress = user.EmailAddress,
				Password = user.Password,
			};

			_databaseContext.Users.Add(newUser);

			await _databaseContext.SaveChangesAsync();
		}
		
		/// <inheritdoc />
		public UserRoles? GetUserRole(Guid userID)
		{
			GlobalAdmin? globalAdmin = _databaseContext.GlobalAdmins
				.Where(a => a.UserID.Equals(userID))
				.FirstOrDefault();

			if (globalAdmin != null)
			{
				return UserRoles.ADMIN;
			}

			User? user = _databaseContext.Users
				.Where(a => a.ID.Equals(userID))
				.FirstOrDefault();

			if (user != null)
			{
				return UserRoles.USER;
			}

			return null;
		}

		/// <inheritdoc />
		public User? GetUserByEmail(string email)
		{
			return _databaseContext.Users
				.Where(a => a.EmailAddress.Equals(email))
				.FirstOrDefault();
		}

		public User? GetUserByID(Guid ID)
		{
			return _databaseContext.Users
				.Where(a => a.ID.Equals(ID))
				.FirstOrDefault();
		}
    }
}

