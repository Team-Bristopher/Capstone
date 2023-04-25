using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using capstone_api.DataAccessLayer;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
using capstone_api.Models.DatabaseEntities;
using capstone_api.Models.OutgoingMessages;
using capstone_api.OutgoingMessages;
using Microsoft.IdentityModel.Tokens;
using capstone_api.Helpers;
using Google.Apis.Gmail.v1.Data;

namespace capstone_api.BusinessLogic
{
	/// <summary>
	/// Contains business logic for authenticating users.
	/// </summary>
	public interface IAuthBusinessLogic
	{
		/// <summary>
		/// Registers a user.
		/// </summary>
		/// <param name="message">The information about the user.</param>
		/// <returns>An instance of <see cref="Task"/></returns>
		public Task RegisterUser(RegisterUserMessage message);

		/// <summary>
		/// Generates the access token that the user will use for a continous login.
		/// </summary>
		/// <returns>The </returns>
		public string GenerateAuthAccessToken(User user);

		/// <summary>
		/// Logins a user.
		/// </summary>
		/// <param name="message">The information about the user.</param>
		/// <returns>The access token if the operation was successful.</returns>
		public string LoginUser(LoginUserMessage message);

		/// <summary>
		/// Gets a user by ID.
		/// </summary>
		/// <param name="userID">The ID of the user.</param>
		/// <returns>The user if found, null otherwise.</returns>
		public User? GetUserByID(Guid userID);

		/// <summary>
		/// Gets the current logged in user.
		/// </summary>
		/// <returns>A message containing the logged in user.</returns>
		public MyUserMessage GetMyUser();

		/// <summary>
		/// Gets the anonymous user account.
		/// </summary>
		/// <returns>The anonymous user account.</returns>
		public User GetAnonymousUser();

		/// <summary>
		/// Sends the email that allows the user to recover their account.
		/// </summary>
		public void SendAccountRecoveryEmail(string emailAddress);

        /// <summary>
        /// Verifies that the recovery code entered by the user is correct.
        /// </summary>
        /// <param name="emailAddress">The user's email address to reover the account for..</param>
        /// <param name="recoveryCode">The recovery code the user entered.</param>
		/// <returns>The recovery code authentication code.</returns>
        public RecoveryCodeResponse VerifyRecoveryCode(string emailAddress, string recoveryCode);

        /// <summary>
        /// Resets the password given the recovery code authorization reference.
        /// </summary>
		/// <param name="resetPasswordMessage">The message containing the new password to set.</param>
        /// <param name="emailAddress">The email address of the user to reset password for.</param>
        /// <param name="authCode">The authentication code related to the recovery code.</param>
        public void ResetPassword(ResetPasswordMessage resetPasswordMessage, string emailAddress, string authCode);
    }

	/// <inheritdoc />
	public class AuthBusinessLogic : IAuthBusinessLogic
	{
		private readonly ILogger<AuthBusinessLogic> _logger;
		private IHttpContextAccessor _httpContext;
		private readonly IAuthDataAccess _authDataAccess;
		private readonly IConfiguration _config;
		private readonly IUsersDataAccess _usersDataAccess;

		/// <summary>
		/// Constructor.
		/// </summary>
		/// <param name="logger">The logging service.</param>
		public AuthBusinessLogic(
			ILogger<AuthBusinessLogic> logger,
			IHttpContextAccessor httpContext,
			IAuthDataAccess authDataAccess,
			IConfiguration configuration,
			IUsersDataAccess usersDataAccess)
		{
			_logger = logger;
			_httpContext = httpContext;
			_authDataAccess = authDataAccess;
			_config = configuration;
			_usersDataAccess = usersDataAccess;
		}

		/// <inheritdoc />
		public string LoginUser(LoginUserMessage message)
		{
			_logger.LogInformation($"User with email [{message.Email}] is logging in");

			// Checking if the user exists.
			User? matchedUser = _usersDataAccess.GetUserByEmail(message.Email);

			// If the user doesn't exist.
			if (matchedUser == null)
			{
				_logger.LogError($"Login request with email [{message.Email}] is not a registered user");

				throw new HttpResponseException((int)HttpStatusCode.BadRequest);
			}

			string storedHashedPassword = matchedUser.Password;

			// If the password we have stored in the database
			// doesn't equal the password we recieved from the client.
			if (!BCrypt.Net.BCrypt.Verify(message.Password, storedHashedPassword))
			{
				_logger.LogError($"Login request failed for user with email [{matchedUser.EmailAddress}]");

				throw new HttpResponseException((int)HttpStatusCode.Unauthorized);
			}

			return GenerateAuthAccessToken(matchedUser);
		}

		/// <inheritdoc />
		public string GenerateAuthAccessToken(User user)
		{
			// Creating the signing context.
			SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
			SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			// Getting the role of a user, either an Admin or a User role.
			UserRoles? userRole = _authDataAccess.GetUserRole(user.ID);

			// Edgecase: If user is not found during role lookup.
			if (userRole == null)
			{
				_logger.LogError($"User not found during login request for user with email [{user.EmailAddress}]");

				throw new HttpResponseException((int)HttpStatusCode.BadRequest);
			}

			// Defining the claims that will be encrypted
			// in the JWT.
			Claim[] claims = new[]
			{
				new Claim("ID", user.ID.ToString()),
				new Claim("Role", userRole.Value.ToString()),
				new Claim("FirstName", user.FirstName),
				new Claim("LastName", user.LastName),
			};

			// Creating the JWT using the
			// system library.
			JwtSecurityToken jtwToken = new JwtSecurityToken(
				_config["Jwt:Issuer"]!,
				_config["Jwt:Audience"]!,
				claims,
				expires: DateTime.UtcNow.AddHours(12),
				signingCredentials: credentials);

			// Returning the string representation of the access token.
			return new JwtSecurityTokenHandler().WriteToken(jtwToken);
		}

		/// <inheritdoc />
		public async Task RegisterUser(RegisterUserMessage message)
		{
			// Checking if the user already exists.
			User? user = _usersDataAccess.GetUserByEmail(message.EmailAddress);

			// If the user already exists, return error.
			if (user != null)
			{
				_logger.LogError($"User attempting to register with email [{message.EmailAddress}] already exists.");

				throw new HttpResponseException((int)HttpStatusCode.Conflict);
			}

			// Hashing user password.
			message.Password = BCrypt.Net.BCrypt.HashPassword(message.Password);

			// Register user.
			await _authDataAccess.RegisterUser(message);

			_logger.LogInformation($"User with email [{message.EmailAddress}] successfully registered.");
		}

		/// <inheritdoc />
		public MyUserMessage GetMyUser()
		{
			Claim? userIDClaim = _httpContext.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "ID");

			// If the user claim is not found, or otherwise it doesn't exist.
			if (userIDClaim == null)
			{
				_logger.LogError($"Unable to find the user ID claim for request");

				throw new HttpResponseException((int)HttpStatusCode.Unauthorized);
			}

			// Getting the ID of the user from the claim.
			Guid userID = Guid.Parse(userIDClaim.Value);

			// Getting the user by ID.
			User? matchedUser = _authDataAccess.GetUserByID(userID);

			// If the user doesn't exist.
			if (matchedUser == null)
			{
				_logger.LogError($"Authenticated user with claim doesn't exist in database, user ID is [{userID}]");

				throw new HttpResponseException((int)HttpStatusCode.Forbidden);
			}

			// Getting the role of a user, either an Admin or a User role.
			UserRoles? userRole = _authDataAccess.GetUserRole(matchedUser.ID);

			return new MyUserMessage
			{
				Email = matchedUser.EmailAddress,
				FirstName = matchedUser.FirstName,
				LastName = matchedUser.LastName,
				ID = matchedUser.ID,
				Role = userRole!.Value,
				ProfilePictureURL = matchedUser.ProfilePictureURL,
			};
		}

		/// <inheritdoc />
		public User? GetUserByID(Guid userID)
		{
			return _authDataAccess.GetUserByID(userID);
		}

		/// <inheritdoc />
		public User GetAnonymousUser()
		{
			return _authDataAccess.GetUserByID(Guid.Empty)!;
		}

		/// <inheritdoc />
		public void SendAccountRecoveryEmail(string emailAddress)
		{
			if (string.IsNullOrWhiteSpace(emailAddress))
			{
				_logger.LogError("Cannot process recovery request due to bad data");

				throw new HttpResponseException((int)HttpStatusCode.BadRequest);
			}

			// Getting user by email.
			User? matchedUser = _usersDataAccess.GetUserByEmail(emailAddress);

			// If the user doesn't exist.
			if (matchedUser == null)
			{
				_logger.LogError($"User not found by email $[{emailAddress}] while recovering account");

				throw new HttpResponseException((int)HttpStatusCode.Forbidden);
			}

			// Getting the service account username and password.
			string username = _config["GmailSMTP:Username"];
			string password = _config["GmailSMTP:Password"];

			// Configuring TLS.
			System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

			// Sending the recovery code email.
			SmtpClient client = new SmtpClient("smtp.gmail.com")
			{
				Port = 587,
				Credentials = new NetworkCredential(username, password),
				EnableSsl = true,
				DeliveryMethod = SmtpDeliveryMethod.Network
			};

			// Creating the recovery code record,
			// and returning the reference to it.
			RecoveryCodes recoveryAuthCode = _authDataAccess.CreateRecoveryCode(matchedUser);

			// Creating the message.
			MailMessage message = new MailMessage()
			{
				From = new MailAddress(username),
				Subject = "Account Recovery Code",
				Body = Helpers.Helpers.GetRecoveryCodeEmailHTML(recoveryAuthCode.Code.ToString()),
				IsBodyHtml = true,
			};

			// Adding recipient.
			message.To.Add(matchedUser.EmailAddress);

			// Sending email.
			client.Send(message);
		}

		/// <inheritdoc />
		public RecoveryCodeResponse VerifyRecoveryCode(string emailAddress, string recoveryCode)
		{
			if (string.IsNullOrWhiteSpace(emailAddress) || string.IsNullOrWhiteSpace(recoveryCode))
            {
                _logger.LogError("Cannot process recovery request due to bad data");

                throw new HttpResponseException((int)HttpStatusCode.BadRequest);
            }

            // Getting user by email.
            User? matchedUser = _usersDataAccess.GetUserByEmail(emailAddress);

            // If the user doesn't exist.
            if (matchedUser == null)
            {
                _logger.LogError($"User not found by email $[{emailAddress}] while recovering account");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

			RecoveryCodes? matchedRecoveryCode = _authDataAccess.GetRecoveryCode(recoveryCode);

			if (matchedRecoveryCode == null)
            {
                _logger.LogError($"User with email $[{emailAddress}] does not have a valid recovery code");

                throw new HttpResponseException((int)HttpStatusCode.BadRequest);
            }

			User? matchedUserByCode = _usersDataAccess.GetUserByID(matchedRecoveryCode.RequestedFor);

			// Ensuring the recovery code has a user attached to it.
			if (matchedRecoveryCode == null)
			{
                _logger.LogError($"User did not provide a valid recovery code");

                throw new HttpResponseException((int)HttpStatusCode.BadRequest);
            }

			// Ensuring the recovery code is meant for this person.
			if (!matchedUserByCode.EmailAddress.Equals(emailAddress))
			{
                _logger.LogError($"User with email $[{emailAddress}] used a recovery code for another email");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

			// Ensuring the recovery code is not expired.
			if (matchedRecoveryCode.ExpiresAt < DateTime.UtcNow)
			{
                _logger.LogError($"User with email $[{emailAddress}] used an expired recovery code");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

			// Ensuring the recovery code hasn't been used.
			if (matchedRecoveryCode.IsComplete)
			{
                _logger.LogError($"User with email $[{emailAddress}] an already used code");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

			return new RecoveryCodeResponse
			{
				RecoveryCodeAuthenticationCode = matchedRecoveryCode.RecoveryAuthenticationCode,
            };
        }

		/// <inheritdoc />
        public void ResetPassword(ResetPasswordMessage resetPasswordMessage, string emailAddress, string authCode)
		{
            if (string.IsNullOrWhiteSpace(emailAddress))
            {
                _logger.LogError("Cannot process recovery request due to bad data");

                throw new HttpResponseException((int)HttpStatusCode.BadRequest);
            }

            // Getting user by email.
            User? matchedUser = _usersDataAccess.GetUserByEmail(emailAddress);

            // If the user doesn't exist.
            if (matchedUser == null)
            {
                _logger.LogError($"User not found by email $[{emailAddress}] while resetting password");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

			// Getting the recovery code by auth code.
            RecoveryCodes? matchedRecoveryCode = _authDataAccess.GetRecoveryCodeByAuthCode(authCode);

			// If the code is not existing.
            if (matchedRecoveryCode == null)
            {
                _logger.LogError($"User with email $[{emailAddress}] does not have a valid recovery code");

                throw new HttpResponseException((int)HttpStatusCode.BadRequest);
            }

            User? matchedUserByCode = _usersDataAccess.GetUserByID(matchedRecoveryCode.RequestedFor);

            // Ensuring the recovery code is meant for this person.
            if (!matchedUserByCode.EmailAddress.Equals(emailAddress))
            {
                _logger.LogError($"User with email $[{emailAddress}] used a recovery code for another email");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            // Ensuring the recovery code is not expired.
            if (matchedRecoveryCode.ExpiresAt < DateTime.UtcNow)
            {
                _logger.LogError($"User with email $[{emailAddress}] used an expired recovery code");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            // Ensuring the recovery code hasn't been used.
            if (matchedRecoveryCode.IsComplete)
            {
                _logger.LogError($"User with email $[{emailAddress}] an already used code");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            // Hashing new password.
			string hashedPassword = BCrypt.Net.BCrypt.HashPassword(resetPasswordMessage.NewPassword);

			// Resetting the password.
			_authDataAccess.UseRecoveryCode(matchedRecoveryCode, matchedUser.EmailAddress, hashedPassword);
        }
    }
}

