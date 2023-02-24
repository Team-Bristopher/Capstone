using System;
using System.Net;
using capstone_api.DataAccessLayer;
using capstone_api.Models.DatabaseEntities;
using capstone_api.OutgoingMessages;

namespace capstone_api.BusinessLogic
{
    /// <summary>
    /// Contains business logic for fundraisers.
    /// </summary>
    public interface IFundraiserBusinessLogic
	{
        /// <summary>
        /// Gets the amount donated so far to a fundraiser.
        /// </summary>
        /// <param name="fundraiserID">The unique identifier of the fundraiser.</param>
        /// <returns>The amount donated.</returns>
        public FundraiserDonationAmountMessage GetDonatedAmount(Guid fundraiserID);
	}

	/// <inheritdoc />
	public class FundraiserBusinessLogic : IFundraiserBusinessLogic
	{
		private readonly ILogger<FundraiserBusinessLogic> _logger;
		private readonly IFundraiserDataAccess _fundraiserDataAccess;

		/// <summary>
		/// Constructor.
		/// </summary>
		public FundraiserBusinessLogic(
			IFundraiserDataAccess fundraiserDataAccess,
			ILogger<FundraiserBusinessLogic> logger)
		{
			_fundraiserDataAccess = fundraiserDataAccess;
			_logger = logger;
		}

		/// <inheritdoc />
        public FundraiserDonationAmountMessage GetDonatedAmount(Guid fundraiserID)
		{
			// Ensuring the fundraiser exists based upon the ID.
			Fundraiser? fundraiser = _fundraiserDataAccess.GetFundraiser(fundraiserID);

			// If the fundraiser doesn't exist.
			if (fundraiser == null)
			{
				_logger.LogError($"Fundraiser is not found while fetching fundraiser with ID [{fundraiserID}]");

				throw new HttpResponseException((int)HttpStatusCode.NotFound);
			}

			// Grabbing the total amount of money donated to a fundraiser.
			double amount = _fundraiserDataAccess.GetDonatedAmount(fundraiserID);

			return new FundraiserDonationAmountMessage
			{
				Amount = amount,
			};
		}
    }
}

