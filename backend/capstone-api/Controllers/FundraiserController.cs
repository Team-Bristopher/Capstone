using System;
using capstone_api.BusinessLogic;
using capstone_api.IncomingMessages;
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

		[HttpPost("create")]
        [Authorize(Policy = "RegisteredUser")]
		public IActionResult CreateFundraiser(
			[FromBody] CreateFundraiserMessage message)
		{
            CreateFundraiserResponseMessage response = _fundraiserBusinessLogic.CreateFundraiser(message);

			return Ok(response);
		}

		[HttpGet]
		[AllowAnonymous]
		public IActionResult GetFundraisers(
			[FromQuery] int page)
		{
			IEnumerable<FundraiserMessage> fundraisers = _fundraiserBusinessLogic.GetFundraisers(page);

			return Ok(fundraisers);
		}
    }
}

