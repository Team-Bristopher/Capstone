using System;
using capstone_api.BusinessLogic;
using capstone_api.OutgoingMessages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace capstone_api.Controllers
{
	/// <summary>
	/// Contains endpoint for fundraiser operations.
	/// </summary>
	[Route("api/fundraiser")]
	[ApiController]
	public class FundraiserController : ControllerBase
	{
		private readonly IFundraiserBusinessLogic _fundraiserBusinessLogic;

		/// <summary>
		/// Constructor.
		/// </summary>
		public FundraiserController(
			IFundraiserBusinessLogic fundraiserBusinessLogic)
		{
			_fundraiserBusinessLogic = fundraiserBusinessLogic;
		}

		[HttpGet("donation-amount")]
		[AllowAnonymous]
		public IActionResult GetDonationAmount(
			[FromQuery] Guid fundraiserID)
		{
			FundraiserDonationAmountMessage message = _fundraiserBusinessLogic.GetDonatedAmount(fundraiserID);

			return Ok(message);
		}
	}
}

