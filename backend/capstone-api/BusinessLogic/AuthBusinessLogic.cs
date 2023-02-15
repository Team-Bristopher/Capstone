using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using capstone_api.DataAccessLayer;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
using capstone_api.Models.DatabaseEntities;
using capstone_api.Models.OutgoingMessages;
using Microsoft.IdentityModel.Tokens;

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
		/// Gets the current logged in user.
		/// </summary>
		/// <returns>A message containing the logged in user.</returns>
		public MyUserMessage GetMyUser();
    }

	/// <inheritdoc />
	public class AuthBusinessLogic : IAuthBusinessLogic
	{
		private readonly ILogger<AuthBusinessLogic> _logger;
		private IHttpContextAccessor _httpContext;
		private readonly IAuthDataAccess _authDataAccess;
        private readonly IConfiguration _config;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="logger">The logging service.</param>
        public AuthBusinessLogic(
			ILogger<AuthBusinessLogic> logger,
			IHttpContextAccessor httpContext,
			IAuthDataAccess authDataAccess,
			IConfiguration configuration)
		{
			_logger = logger;
			_httpContext = httpContext;
			_authDataAccess = authDataAccess;
			_config = configuration;
		}

		/// <inheritdoc />
        public string LoginUser(LoginUserMessage message)
		{
			_logger.LogInformation($"User with email [{message.Email}] is logging in");

			// Checking if the user exists.
			User? matchedUser = _authDataAccess.GetUserByEmail(message.Email);

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
			User? user = _authDataAccess.GetUserByEmail(message.EmailAddress);

			// If the user already exists, return error.
			if (user != null)
			{
				_logger.LogError($"User attempting to register with email [{message.EmailAddress}] already exists.");

				throw new HttpResponseException((int) HttpStatusCode.Conflict);
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
			};
        }
    }
}

