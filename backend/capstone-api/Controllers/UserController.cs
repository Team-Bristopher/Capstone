using System;
using capstone_api.BusinessLogic;
using capstone_api.IncomingMessages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace capstone_api.Controllers
{
    /// <summary>
    /// Contains endpoint for user operations.
    /// </summary>
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUsersBusinessLogic _usersBusinessLogic;

        /// <summary>
        /// Constructor.
        /// </summary>
        public UserController(
            IUsersBusinessLogic usersBusinessLogic)
        {
            _usersBusinessLogic = usersBusinessLogic;
        }

        /// <summary>
        /// Edits a user.
        /// </summary>
        /// <param name="message">The information about editing a user.</param>
        /// <returns>
        /// Status "Ok" if the operation was successful.
        /// Status "Unauthorized" if the user attempts to edit another
        /// user's profile.
        /// Status "Forbidden" if the user doesn't exist.
        /// </returns>
        [HttpPost("edit")]
        [Authorize(Policy = "RegisteredUser")]
        public IActionResult EditUser(
            [FromBody] EditUserMessage message)
        {
            _usersBusinessLogic.EditUser(message);

            return Ok();
        }

        [HttpPost("image-upload")]
        [Authorize(Policy = "RegisteredUser")]
        public async Task<IActionResult> UploadImage(
            [FromForm] IFormFile file)
        {
            await _usersBusinessLogic.UploadProfileImage(file);

            return Ok();
        }
    }
}

