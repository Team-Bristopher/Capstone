using System;
using System.Net;
using System.Security.Claims;
using capstone_api.DataAccessLayer;
using capstone_api.IncomingMessages;
using capstone_api.Models.DatabaseEntities;

namespace capstone_api.BusinessLogic
{
    /// <summary>
    /// Contains business logic for editing users.
    /// </summary>
    public interface IUsersBusinessLogic
	{
		/// <summary>
		/// Edits a user.
		/// </summary>
		/// <param name="message">The information to edit user by.</param>
		public void EditUser(EditUserMessage message);
	}

	/// <inheritdoc />
	public class UsersBusinessLogic : IUsersBusinessLogic
	{
        private readonly ILogger<UsersBusinessLogic> _logger;
        private IHttpContextAccessor _httpContext;
        private readonly IAuthDataAccess _authDataAccess;
		private readonly IUsersDataAccess _usersDataAccess;

        public UsersBusinessLogic(
			ILogger<UsersBusinessLogic> logger,
			IHttpContextAccessor httpContext,
			IAuthDataAccess authDataAccess,
			IUsersDataAccess usersDataAccess)
		{
			_logger = logger;
			_httpContext = httpContext;
			_authDataAccess = authDataAccess;
			_usersDataAccess = usersDataAccess;
		}

		/// <inheritdoc />
		public void EditUser(EditUserMessage message)
		{
			// Getting the user ID claim of the requester.
			Claim? userIDClaim = _httpContext.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "ID");

            // If the user claim is not found, or otherwise it doesn't exist.
            if (userIDClaim == null)
            {
                _logger.LogError($"Unable to find the user ID claim for request");

                throw new HttpResponseException((int)HttpStatusCode.Unauthorized);
            }

            // Getting the requesting user.
            User? matchedUser = _authDataAccess.GetUserByID(Guid.Parse(userIDClaim.Value));

            // If the user doesn't exist.
            if (matchedUser == null)
            {
                _logger.LogError($"Authenticated user with claim doesn't exist in database, user ID is [{userIDClaim.Value}]");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

			// Editing the user.
			_usersDataAccess.EditUser(matchedUser.ID, message);
        }
	}
}

