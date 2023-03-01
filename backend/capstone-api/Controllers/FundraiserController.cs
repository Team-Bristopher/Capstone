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

		/// <summary>
		/// Gets the total amount donated to a fundraiser, by fundraiser ID.
		/// </summary>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
		/// <returns>
		///	Status "NotFound" if the fundraiser wasn't found by lookup.
		/// Status "Ok" if the operation finished successfully.
		/// </returns>
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

		[HttpGet("detail")]
		[AllowAnonymous]
		public IActionResult GetFundraiserDetail(
			[FromQuery] Guid fundraiserID)
		{
			FundraiserMessage message = _fundraiserBusinessLogic.GetFundraiserDetail(fundraiserID);

			return Ok(message);
		}

		[HttpPost("view")]
        [Authorize(Policy = "RegisteredUser")]
		public IActionResult AddFundraiserView(
			[FromQuery] Guid fundraiserID)
		{
			_fundraiserBusinessLogic.AddFundraiserView(fundraiserID);

			return Ok();
		}
    }
}

