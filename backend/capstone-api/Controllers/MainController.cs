using System;
using Microsoft.AspNetCore.Mvc;
using capstone_api.Models.OutgoingMessages;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace capstone_api.Controllers
{
	/// <summary>
	/// Contains endpoints for healthcheck and
	/// other mundane data.
	/// </summary>]
	[Route("api/main")]
	[ApiController]
	public class MainController : ControllerBase
	{
		public MainController()
		{
		}

        /// <summary>
        /// Indicates that the API is online to the consumer. 
        /// </summary>
        /// <returns>Status "Operational" if the API is online.</returns>
        [HttpGet("healthcheck")]
		[Authorize(Policy = "RegisteredUser")]
		public IActionResult GetHealthcheck()
		{
            return Ok(new HealthcheckMessage("Operational"));
		}
	}
}

