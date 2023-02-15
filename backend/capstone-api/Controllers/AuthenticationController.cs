using System;
using capstone_api.BusinessLogic;
using capstone_api.IncomingMessages;
using capstone_api.Models.OutgoingMessages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace capstone_api.Controllers
{
	/// <summary>
	/// Contains endpoints for authentication.
	/// </summary>
	[Route("api/auth")]
	[ApiController]
	public class AuthenticationController : ControllerBase
	{
		private readonly IAuthBusinessLogic _authBusinessLogic;

		public AuthenticationController(
			IAuthBusinessLogic authBusinessLogic)
		{
			_authBusinessLogic = authBusinessLogic;
		}

		/// <summary>
		/// Registers a user.
		/// </summary>
		/// <param name="message">The information of the user to register.</param>
		/// <returns>
		///	Status "Ok" if the operation was successful.
		///	Status "Internal Server Error" if an error occurs.
		/// Status "Conflict" if the user already exists.
		/// </returns>
		[HttpPost("register")]
		[AllowAnonymous]
		public async Task<IActionResult> RegisterUser(
			[FromBody] RegisterUserMessage message)
		{
			await _authBusinessLogic.RegisterUser(message);

			return Ok();
		}

		/// <summary>
		/// Logins a user.
		/// </summary>
		/// <param name="message">The information of the user to login.</param>
		/// <returns>
		///	Status "Ok" if the operation wass successful.
		///	Status "Unauthorized" if the password login attempt was wrong.
		/// Status "BadRequest" if the user does not exist.
		/// </returns>
		[HttpPost("login")]
		[AllowAnonymous]
		public IActionResult LoginUser(
			[FromBody] LoginUserMessage message)
		{
			string accessToken = _authBusinessLogic.LoginUser(message);

			return Ok(accessToken);
		}

		/// <summary>
		/// Gets the user model of the logged in user.
		/// </summary>
		/// <returns>
		///	Status "Ok" if the operation was successful.
		///	Status "Unauthorized" if no ID claim was found.
		///	Status "Forbidden" if the ID claim existed, but user didn't exist in database.
		/// </returns>
		[HttpGet("me")]
		[Authorize(Policy = "RegisteredUser")]
		public IActionResult GetMyAccount()
		{
			MyUserMessage message = _authBusinessLogic.GetMyUser();

			return Ok(message);
		}
	}
}

