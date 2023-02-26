using System;
using System.Net;
using System.Security.Claims;
using capstone_api.DataAccessLayer;
using capstone_api.IncomingMessages;
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

		/// <summary>
		/// Creates a fundraiser.
		/// </summary>
		/// <param name="message">The information by which to create the fundraiser.</param>
		/// <returns>The message about a newly created fundraiser.</returns>
		public CreateFundraiserResponseMessage CreateFundraiser(CreateFundraiserMessage message);

        /// <summary>
        /// Gets the fundraiser feed.
        /// </summary>
        /// <param name="page">The current page, used for pagination.</param>
        /// <returns>The list of fundraisers.</returns>
        public IEnumerable<FundraiserMessage> GetFundraisers(int page);
    }

    /// <inheritdoc />
    public class FundraiserBusinessLogic : IFundraiserBusinessLogic
	{
		private readonly ILogger<FundraiserBusinessLogic> _logger;
		private readonly IFundraiserDataAccess _fundraiserDataAccess;
        private IHttpContextAccessor _httpContext;
		private IAuthBusinessLogic _authBusinessLogic;

        /// <summary>
        /// Constructor.
        /// </summary>
        public FundraiserBusinessLogic(
			IFundraiserDataAccess fundraiserDataAccess,
			ILogger<FundraiserBusinessLogic> logger,
			IHttpContextAccessor httpContextAccessor,
			IAuthBusinessLogic authBusinessLogic)
		{
			_fundraiserDataAccess = fundraiserDataAccess;
			_logger = logger;
			_httpContext = httpContextAccessor;
			_authBusinessLogic = authBusinessLogic;
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

		/// <inheritdoc />
		public CreateFundraiserResponseMessage CreateFundraiser(CreateFundraiserMessage message)
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
            User? matchedUser = _authBusinessLogic.GetUserByID(userID);

            // If the user doesn't exist.
            if (matchedUser == null)
            {
                _logger.LogError($"Authenticated user with claim doesn't exist in database, user ID is [{userID}]");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            Guid fundraiserID = _fundraiserDataAccess.CreateFundraiser(message, userID);

			return new CreateFundraiserResponseMessage
			{
				FundraiserID = fundraiserID,
			};
        }

        /// <inheritdoc />
        public IEnumerable<FundraiserMessage> GetFundraisers(int page)
        {
            List<Fundraiser> fundraisers = _fundraiserDataAccess.GetFundraisers(page);

            return fundraisers.Select(a => new FundraiserMessage
            {
                ID = a.ID,
                Title = a.Title,
                Description = a.Description,
                Views = a.Views,
                CreatedOn = a.CreatedOn,
                ModifiedOn = a.ModifiedOn,
                CreatedBy = a.CreatedByUserID,
                Type = (int)a.Type.Type,
                Target = a.Target,
                EndDate = a.EndDate,
            });
        }
    }
}

