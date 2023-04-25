using System;
using Bogus;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
using capstone_api.Models.DatabaseEntities;
using Microsoft.EntityFrameworkCore;

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

        /// <summary>
        /// Creates the recovery code to recover a user's account.
        /// </summary>
        /// <param name="user">The user to create the recovery code for.</param>
        /// <returns>The recovery code object.</returns>
        public RecoveryCodes CreateRecoveryCode(User user);

		/// <summary>
		/// Gets the recovery code model by recovery code number that is sent to user's
		/// email. 
		/// </summary>
		/// <param name="recoveryCode">The recovery code the users have from email.</param>
		/// <returns>The recovery code found or null otherwise.</returns>
		public RecoveryCodes? GetRecoveryCode(string recoveryCode);

		/// <summary>
		/// Gets the recovery code by authentication code which is a step 
		/// the user enters the recovery code from their email.
		/// </summary>
		/// <param name="authCode">The recovery authentication code.</param>
		/// <returns>The recovery code record, or null if otherwise it is not found.</returns>
		public RecoveryCodes? GetRecoveryCodeByAuthCode(string authCode);

		/// <summary>
		/// Uses the recovery code and reset's the users password to add a new one.
		/// </summary>
		/// <param name="recoveryCode">The recovery code to use.</param>
		/// <param name="emailAddress">The user's email address.</param>
		/// <param name="newPassword">The new password.</param>
		public void UseRecoveryCode(RecoveryCodes recoveryCode, string emailAddress, string newPassword);
    }

	/// <inheritdoc />
	public class AuthDataAccess : IAuthDataAccess
	{
		private readonly DatabaseContext _databaseContext;
		private readonly Faker _faker;

        /// <summary>
        /// Constructor.
        /// </summary>
        public AuthDataAccess(DatabaseContext databaseContext)
		{
			_databaseContext = databaseContext;

			_faker = new Faker();
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

		public User? GetUserByID(Guid ID)
		{
			return _databaseContext.Users
				.Where(a => a.ID.Equals(ID))
				.FirstOrDefault();
		}

        /// <inheritdoc />
        public RecoveryCodes CreateRecoveryCode(User user)
        {
            RecoveryCodes recoveryCode = new RecoveryCodes()
            {
                ID = Guid.NewGuid(),
                Code = int.Parse(_faker.Random.String(6, '\u0031', '\u0039')), // Numbers 1-9.
                RecoveryAuthenticationCode = _faker.Random.String(50, '\u0041', '\u0051'), // Uppercase English letters.
                CreatedAt = DateTime.UtcNow,
                IsComplete = false,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                RequestedFor = user.ID,
            };

            _databaseContext.RecoveryCodes.Add(recoveryCode);

            _databaseContext.SaveChanges();

			return recoveryCode;
        }

		/// <inheritdoc />
        public RecoveryCodes? GetRecoveryCode(string recoveryCode)
		{
			return _databaseContext.RecoveryCodes
				.Where(a => a.Code.ToString().Equals(recoveryCode))
				.FirstOrDefault();
		}

		/// <inheritdoc />
        public RecoveryCodes? GetRecoveryCodeByAuthCode(string authCode)
		{
            return _databaseContext.RecoveryCodes
                .Where(a => a.RecoveryAuthenticationCode.Equals(authCode))
                .FirstOrDefault();
        }

        /// <inheritdoc />
        public void UseRecoveryCode(RecoveryCodes recoveryCode, string emailAddress, string newPassword)
		{
			recoveryCode.IsComplete = true;

			User matchedUser = _databaseContext.Users
				.Where(a => a.EmailAddress.Equals(emailAddress))
				.First();

			matchedUser.Password = newPassword;

			_databaseContext.SaveChanges();
		}
    }
}

