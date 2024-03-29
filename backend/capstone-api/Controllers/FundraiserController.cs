﻿using System;
using capstone_api.BusinessLogic;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
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
			[FromQuery] Guid fundraiserID,
			[FromQuery] int timeSortOption)
		{
			FundraiserDonationAmountMessage message = _fundraiserBusinessLogic.GetFundraiserDonations((DonationTimeSort)timeSortOption, fundraiserID);

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

		[HttpPost("image-upload")]
		[Authorize(Policy = "RegisteredUser")]
		public async Task<IActionResult> UploadFundraiserImages(
			[FromQuery] Guid fundraiserID,
			[FromForm] IFormFile file)
		{
			await _fundraiserBusinessLogic.UploadImagesToFundraiser(fundraiserID, file);

			return Ok();
		}

		[HttpGet]
		[AllowAnonymous]
		public IActionResult GetFundraisers(
			[FromQuery] int page,
			[FromQuery] string? fundraiserTitle,
			[FromQuery] int? category)
		{
			IEnumerable<FundraiserMessage> fundraisers = _fundraiserBusinessLogic.GetFundraisers(page, fundraiserTitle, category);

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

		[HttpPost("donate")]
		[AllowAnonymous]
		public IActionResult DonateToFundraiser(
			DonateToFundraiserMessage message)
		{
			_fundraiserBusinessLogic.DonateToFundraiser(message);

			return Ok();
		}

		[HttpGet("donations")]
		[AllowAnonymous]
		public IActionResult GetAllDonations(
			[FromQuery] Guid fundraiserID,
			[FromQuery] int page,
			[FromQuery] bool? onlyComments = false)
		{
			IEnumerable<FundraiserDonationMessage> donationMessages = _fundraiserBusinessLogic.GetAllDonations(fundraiserID, page, onlyComments ?? false);

			return Ok(donationMessages);
		}

		[HttpPost("edit")]
        [Authorize(Policy = "RegisteredUser")]
		public IActionResult EditFundraiser(
			[FromQuery] Guid fundraiserID,
			[FromBody] EditFundraiserMessage message)
		{
			_fundraiserBusinessLogic.EditFundraiser(fundraiserID, message);

			return Ok();
		}

		[HttpDelete("remove-images")]
        [Authorize(Policy = "RegisteredUser")]
		public IActionResult RemoveFundraiserImages(
			[FromQuery] Guid fundraiserID)
		{
			_fundraiserBusinessLogic.RemoveFundraiserImages(fundraiserID);

			return Ok();
		}
    }
}

