using System;
using System.Net;
using System.Security.Claims;
using capstone_api.DataAccessLayer;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
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
        /// <param name="sortOption">The sort option of the donations.</param>
        /// <returns>The amount donated.</returns>
        public FundraiserDonationAmountMessage GetFundraiserDonations(DonationTimeSort sortOption, Guid fundraiserID);

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

        /// <summary>
        /// Gets the donations feed.
        /// </summary>
        /// <param name="page">The current page, used for pagination.</param>
        /// <param name="fundraiserID">The ID of the fundraiser.</param>
        /// <param name="onlyComments">Indicates whether or not to only include donations with comments.</param>
        /// <returns>The list of donations.</returns>
        public IEnumerable<FundraiserDonationMessage> GetAllDonations(Guid fundraiserID, int page, bool onlyComments);

        /// <summary>
        /// Gets the fundraiser information by fundraiser ID.
        /// </summary>
        /// <param name="fundraiserID">The ID of the fundraiser to get.</param>
        /// <returns>The fundraiser message.</returns>
        public FundraiserMessage GetFundraiserDetail(Guid fundraiserID);

        /// <summary>
        /// Submits a view for a fundraiser.
        /// </summary>
        /// <param name="fundraiserID">The ID of the fundraiser to submit a view for.</param>
        public void AddFundraiserView(Guid fundraiserID);

        /// <summary>
        /// Donates to a fundraiser.
        /// </summary>
        /// <param name="message">Information about the donation.</param>
        public void DonateToFundraiser(DonateToFundraiserMessage message);
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
        public FundraiserDonationAmountMessage GetFundraiserDonations(DonationTimeSort sortOption, Guid fundraiserID)
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

            // Grabbing the most recent donations to this fundraiser.
            List<Donation> recentDonations = _fundraiserDataAccess.GetRecentDonations(sortOption, fundraiserID);

            return new FundraiserDonationAmountMessage
            {
                TotalAmount = amount,
                RecentDonations = recentDonations.Select(a => new FundraiserDonationMessage()
                {
                    FirstName = a.DonatedBy!.FirstName,
                    LastName = a.DonatedBy!.LastName,
                    IndividualAmount = a.Amount,
                    DonatedAt = a.DonatedOn,
                }).ToList()
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
            // Grabbing the fundraiser page.
            List<Fundraiser> fundraisers = _fundraiserDataAccess.GetFundraisers(page);

            // For every fundraiser found,
            // return as a message object.
            return fundraisers.Select(a => new FundraiserMessage
            {
                ID = a.ID,
                Title = a.Title,
                Description = a.Description,
                Views = _fundraiserDataAccess.GetFundraiserViews(a.ID),
                CreatedOn = a.CreatedOn,
                ModifiedOn = a.ModifiedOn,
                CreatedBy = a.CreatedByUserID,
                Type = (int)a.Type.Type,
                Target = a.Target,
                EndDate = a.EndDate,
            });
        }

        /// <inheritdoc />
        public FundraiserMessage GetFundraiserDetail(Guid fundraiserID)
        {
            // Getting the fundraiser information by ID.
            Fundraiser? fundraiser = _fundraiserDataAccess.GetFundraiser(fundraiserID);

            // If the fundraiser lookup by ID wasn't found.
            if (fundraiser == null)
            {
                _logger.LogError($"Fundraiser detail request failed due to fundraiser not found, fundraiser ID [{fundraiserID}]");

                throw new HttpResponseException((int)HttpStatusCode.NotFound);
            }

            // Getting the comment count for this fundraiser.
            long commentCount = _fundraiserDataAccess.GetFundraiserCommentCount(fundraiser.ID);

            // Returning the fundraiser message object.
            return new FundraiserMessage
            {
                ID = fundraiser.ID,
                Title = fundraiser.Title,
                Description = fundraiser.Description,
                Views = _fundraiserDataAccess.GetFundraiserViews(fundraiser.ID),
                CreatedOn = fundraiser.CreatedOn,
                ModifiedOn = fundraiser.ModifiedOn,
                CreatedBy = fundraiser.CreatedByUserID,
                Type = (int)fundraiser.Type.Type,
                Target = fundraiser.Target,
                EndDate = fundraiser.EndDate,
                CommentCount = commentCount,
                Author = new UserMessage
                {
                    FirstName = fundraiser.CreatedByUser.FirstName,
                    LastName = fundraiser.CreatedByUser.LastName,
                },
            };
        }

        /// <inheritdoc />
        public IEnumerable<FundraiserDonationMessage> GetAllDonations(Guid fundraiserID, int page, bool onlyComments)
        {
            // Getting the fundraiser information by ID.
            Fundraiser? fundraiser = _fundraiserDataAccess.GetFundraiser(fundraiserID);

            // If the fundraiser lookup by ID wasn't found.
            if (fundraiser == null)
            {
                _logger.LogError($"Get all donations request failed due to fundraiser not found, fundraiser ID [{fundraiserID}]");

                throw new HttpResponseException((int)HttpStatusCode.NotFound);
            }

            // Getting the current page of donations.
            List<Donation> currentDonationPage = _fundraiserDataAccess.GetAllDonations(fundraiserID, page, onlyComments);

            return currentDonationPage.Select(a => new FundraiserDonationMessage
            {
                FirstName = a.DonatedBy!.FirstName,
                LastName = a.DonatedBy!.LastName,
                IndividualAmount = a.Amount,
                DonatedAt = a.DonatedOn,
                Message = a.Message,
            });
        }

        /// <inheritdoc />
        public void AddFundraiserView(Guid fundraiserID)
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

            // Getting the fundraiser by the supplied fundraiser ID.
            Fundraiser? matchedFundraiser = _fundraiserDataAccess.GetFundraiser(fundraiserID);

            if (matchedFundraiser == null)
            {
                _logger.LogError($"Fundraiser view submit failed due to fundraiser not found, fundraiser ID [{fundraiserID}]");

                throw new HttpResponseException((int)HttpStatusCode.NotFound);
            }

            _fundraiserDataAccess.AddFundraiserView(fundraiserID, matchedUser.ID);
        }

        /// <inheritdoc />
        public void DonateToFundraiser(DonateToFundraiserMessage message)
        {
            Claim? userIDClaim = _httpContext.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "ID");

            User? matchedUser = null;

            // If the user claim is not found, or otherwise it doesn't exist.
            if (userIDClaim != null)
            {
                // Getting the ID of the user from the claim.
                Guid userID = Guid.Parse(userIDClaim.Value);

                // Getting the user by ID.
                matchedUser = _authBusinessLogic.GetUserByID(userID);

                // If the user doesn't exist.
                if (matchedUser == null)
                {
                    _logger.LogError($"Authenticated user with claim doesn't exist in database, user ID is [{userID}]");

                    throw new HttpResponseException((int)HttpStatusCode.Forbidden);
                }
            } else
            {
                matchedUser = _authBusinessLogic.GetAnonymousUser();
            }

            // Ensuring the fundraiser exists.
            Fundraiser? matchedFundraiser = _fundraiserDataAccess.GetFundraiser(message.FundraiserID);

            // If the fundraiser does not exist in our
            // database.
            if (matchedFundraiser == null)
            {
                _logger.LogError($"Unable to donate to fundraiser [{message.FundraiserID}] due to fundraiser not existing.");

                throw new HttpResponseException((int)HttpStatusCode.NotFound);
            }

            _fundraiserDataAccess.DonateToFundraiser(matchedFundraiser, message.Message, matchedUser, message.Amount);
        }
    }
}

