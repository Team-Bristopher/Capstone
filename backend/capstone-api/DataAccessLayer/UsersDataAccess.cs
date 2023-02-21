using System;
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

        public void EditUser(Guid userID, EditUserMessage message)
		{
			User user = _databaseContext.Users
				.Where(a => a.ID.Equals(userID))
				.First();

			user.FirstName = message.FirstName;
			user.LastName = message.LastName;

			_databaseContext.SaveChanges();
		}
    }
}

