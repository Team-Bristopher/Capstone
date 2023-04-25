using System;
using System.Net;
using System.Security.Claims;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
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
        /// Edits a fundraiser.
        /// </summary>
        /// <param name="fundraiserID">The ID of the fundraiser to edit.</param>
        /// <param name="message">The information by which to edit the fundraiser by.</param>
        public void EditFundraiser(Guid fundraiserID, EditFundraiserMessage message);

        /// <summary>
        /// Gets the fundraiser feed.
        /// </summary>
        /// <param name="page">The current page, used for pagination.</param>
        /// <param name="fundraiserTitle">Optional. The filter term for the fundraiser title.</param>
        /// <param name="fundraiserCategory">Optional. The filter term for the fundraiser category.</param>
        /// <returns>The list of fundraisers.</returns>
        public IEnumerable<FundraiserMessage> GetFundraisers(int page, string? fundraiserTitle, int? fundraiserCategory);

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

        /// <summary>
        /// Uploads image to S3 and relates it to the fundraiser.
        /// </summary>
        /// <param name="fundraiserID">The ID of the fundraiser.</param>
        /// <param name="formFile">The image file.</param>
        public Task UploadImagesToFundraiser(Guid fundraiserID, IFormFile formFile);

        /// <summary>
        /// Removes the list of images that are being replaced
        /// during a fundraiser edit.
        /// </summary>
        /// <param name="fundraiserID">The ID of the fundraiser.</param>
        public void RemoveFundraiserImages(Guid fundraiserID);
    }

    /// <inheritdoc />
    public class FundraiserBusinessLogic : IFundraiserBusinessLogic
    {
        private readonly ILogger<FundraiserBusinessLogic> _logger;
        private readonly IFundraiserDataAccess _fundraiserDataAccess;
        private IHttpContextAccessor _httpContext;
        private IAuthBusinessLogic _authBusinessLogic;
        private readonly IConfiguration _config;

        /// <summary>
        /// Constructor.
        /// </summary>
        public FundraiserBusinessLogic(
            IFundraiserDataAccess fundraiserDataAccess,
            ILogger<FundraiserBusinessLogic> logger,
            IHttpContextAccessor httpContextAccessor,
            IAuthBusinessLogic authBusinessLogic,
            IConfiguration configuration)
        {
            _fundraiserDataAccess = fundraiserDataAccess;
            _logger = logger;
            _httpContext = httpContextAccessor;
            _authBusinessLogic = authBusinessLogic;
            _config = configuration;
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

            // Creating the fundraiser.
            Guid fundraiserID = _fundraiserDataAccess.CreateFundraiser(message, userID);

            return new CreateFundraiserResponseMessage
            {
                FundraiserID = fundraiserID,
            };
        }

        /// <inheritdoc />
        public void EditFundraiser(Guid fundraiserID, EditFundraiserMessage message)
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

            // Ensuring the fundraiser exists based upon the ID.
            Fundraiser? fundraiser = _fundraiserDataAccess.GetFundraiser(fundraiserID);

            // If the fundraiser doesn't exist.
            if (fundraiser == null)
            {
                _logger.LogError($"Fundraiser is not found while fetching fundraiser with ID [{fundraiserID}]");

                throw new HttpResponseException((int)HttpStatusCode.NotFound);
            }

            // Ensuring the user is able to edit this fundraiser.
            if (!fundraiser.CreatedByUserID.Equals(matchedUser.ID))
            {
                _logger.LogError($"User [{matchedUser.ID}] tried to edit fundraiser [{fundraiserID}] without permissions.");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            _fundraiserDataAccess.EditFundraiser(fundraiserID, message);
        }

        /// <inheritdoc />
        public IEnumerable<FundraiserMessage> GetFundraisers(int page, string? fundraiserTitle, int? fundraiserCategory)
        {
            // Grabbing the fundraiser page.
            List<Fundraiser> fundraisers = _fundraiserDataAccess.GetFundraisers(page, fundraiserTitle, fundraiserCategory);

            // For every fundraiser found,
            // return as a message object.
            return fundraisers.Select(a => new FundraiserMessage
            {
                ID = a.ID,
                Title = a.Title,
                Description = a.Description,
                Views = _fundraiserDataAccess.GetFundraiserViews(a.ID),
                ImageURLs = _fundraiserDataAccess.GetFundraiserImages(a.ID).Select(image => image.FundraiserImageURL).ToList(),
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

            // Getting the donation count for this fundraiser.
            long donationCount = _fundraiserDataAccess.GetFundraiserDonationCount(fundraiser.ID);

            // Getting fundraiser images.
            List<string> imageURLs = _fundraiserDataAccess.GetFundraiserImages(fundraiser.ID).Select(image => image.FundraiserImageURL).ToList();

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
                DonationCount = donationCount,
                ImageURLs = imageURLs,
                Author = new UserMessage
                {
                    FirstName = fundraiser.CreatedByUser.FirstName,
                    LastName = fundraiser.CreatedByUser.LastName,
                    ProfilePictureURL = fundraiser.CreatedByUser.ProfilePictureURL,
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
            }

            // Ensuring that anonymous donations
            // are posted correctly with or without
            // users being logged in.
            if (message.IsAnonymous || userIDClaim == null)
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

        /// <inheritdoc />
        public async Task UploadImagesToFundraiser(Guid fundraiserID, IFormFile file)
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

            // Getting the fundraiser by ID if exists.
            Fundraiser? matchedFundraiser = _fundraiserDataAccess.GetFundraiser(fundraiserID);

            // If the fundraiser doesn't exist.
            if (matchedFundraiser == null)
            {
                _logger.LogError($"Authenticated user is attempting to upload images for a fundraiser that doesn't exist, user ID is [{userID}]");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            // Setting up memory stream.
            await using MemoryStream memoryStream = new MemoryStream();

            // Copying image data to memory.
            await file.CopyToAsync(memoryStream);

            // Grabbing S3 bucket name from configuration.
            string bucketName = _config["AWS:FundraiserImagesBucketName"];

            // Authenticating the API to write to bucket.
            BasicAWSCredentials awsCreds = new BasicAWSCredentials(_config["AWS:AccessKey"], _config["AWS:SecretKey"]);

            // Setting up the S3 client.
            IAmazonS3 client = new AmazonS3Client(awsCreds, Amazon.RegionEndpoint.USWest2);

            TransferUtility transferUtility = new TransferUtility(client);

            string imageName = $"FundraiserImage-{matchedUser.EmailAddress}-{Guid.NewGuid()}.png";

            // Setting up the transfer utility request.
            TransferUtilityUploadRequest request = new TransferUtilityUploadRequest()
            {
                BucketName = bucketName,
                Key = imageName,
                InputStream = memoryStream,
                CannedACL = S3CannedACL.PublicRead, // This is critical for users viewing images.
            };

            try
            {
                // Uploading to S3.
                await transferUtility.UploadAsync(request);

                // Getting the pre-defined fundraiser picture URL.
                string fundraiserPictureURL = $"https://{bucketName}.s3.amazonaws.com/{imageName}";

                // Saving image references to our DB.
                _fundraiserDataAccess.SaveFundraiserImageURL(fundraiserID, fundraiserPictureURL);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                throw new HttpResponseException((int)HttpStatusCode.InternalServerError);
            }
        }

        /// <inheritdoc />
        public void RemoveFundraiserImages(Guid fundraiserID)
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

            // Getting the fundraiser by ID if exists.
            Fundraiser? matchedFundraiser = _fundraiserDataAccess.GetFundraiser(fundraiserID);

            // If the fundraiser doesn't exist.
            if (matchedFundraiser == null)
            {
                _logger.LogError($"Authenticated user is attempting to delete images for a fundraiser that doesn't exist, user ID is [{userID}]");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            // If the user requesting is not the owner of the fundraiser.
            if (!matchedFundraiser.CreatedByUserID.Equals(userID))
            {
                _logger.LogError($"Authenticated user is attempting to delete images for a fundraiser they do not own, user ID is [{userID}]");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            _fundraiserDataAccess.RemoveFundraiserImages(fundraiserID);
        }
    }
}

