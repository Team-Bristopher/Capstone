using System;
using System.Net;
using System.Security.Claims;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using capstone_api.DataAccessLayer;
using capstone_api.IncomingMessages;
using capstone_api.Models.DatabaseEntities;

namespace capstone_api.BusinessLogic
{
    /// <summary>
    /// Contains business logic for editing users.
    /// </summary>
    public interface IUsersBusinessLogic
	{
		/// <summary>
		/// Edits a user.
		/// </summary>
		/// <param name="message">The information to edit user by.</param>
		public void EditUser(EditUserMessage message);

		/// <summary>
		/// Uploads an image that a user provides
		/// as the profile image of the user.
		/// </summary>
		/// <param name="imageFile">The image file.</param>
		public Task UploadProfileImage(IFormFile imageFile);
    }

    /// <inheritdoc />
    public class UsersBusinessLogic : IUsersBusinessLogic
	{
        private readonly ILogger<UsersBusinessLogic> _logger;
        private IHttpContextAccessor _httpContext;
        private readonly IAuthDataAccess _authDataAccess;
		private readonly IUsersDataAccess _usersDataAccess;
        private readonly IConfiguration _config;

        public UsersBusinessLogic(
			ILogger<UsersBusinessLogic> logger,
			IHttpContextAccessor httpContext,
			IAuthDataAccess authDataAccess,
			IUsersDataAccess usersDataAccess,
            IConfiguration configuration)
        {
			_logger = logger;
			_httpContext = httpContext;
			_authDataAccess = authDataAccess;
			_usersDataAccess = usersDataAccess;
            _config = configuration;
		}

		/// <inheritdoc />
		public void EditUser(EditUserMessage message)
		{
			// Getting the user ID claim of the requester.
			Claim? userIDClaim = _httpContext.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "ID");

            // If the user claim is not found, or otherwise it doesn't exist.
            if (userIDClaim == null)
            {
                _logger.LogError($"Unable to find the user ID claim for request");

                throw new HttpResponseException((int)HttpStatusCode.Unauthorized);
            }

            // Getting the requesting user.
            User? matchedUser = _authDataAccess.GetUserByID(Guid.Parse(userIDClaim.Value));

            // If the user doesn't exist.
            if (matchedUser == null)
            {
                _logger.LogError($"Authenticated user with claim doesn't exist in database, user ID is [{userIDClaim.Value}]");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

			// Editing the user.
			_usersDataAccess.EditUser(matchedUser.ID, message);
        }

        /// <inheritdoc />
        public async Task UploadProfileImage(IFormFile imageFile)
        {
            // Getting the user ID claim of the requester.
            Claim? userIDClaim = _httpContext.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "ID");

            // If the user claim is not found, or otherwise it doesn't exist.
            if (userIDClaim == null)
            {
                _logger.LogError($"Unable to find the user ID claim for request");

                throw new HttpResponseException((int)HttpStatusCode.Unauthorized);
            }

            Guid userID = Guid.Parse(userIDClaim.Value);

            // Getting the requesting user.
            User? matchedUser = _authDataAccess.GetUserByID(userID);

            // If the user doesn't exist.
            if (matchedUser == null)
            {
                _logger.LogError($"Authenticated user with claim doesn't exist in database, user ID is [{userIDClaim.Value}]");

                throw new HttpResponseException((int)HttpStatusCode.Forbidden);
            }

            // Defining image specific file name.
            string imageName = "ProfileImage-" + matchedUser.EmailAddress + "-" + Guid.NewGuid().ToString() + ".png";

            // Setting up memory stream.
            await using MemoryStream memoryStream = new MemoryStream();
            await imageFile.CopyToAsync(memoryStream);

            string bucketName = _config["AWS:ProfilePicsBucketName"];

            // Setting up the transfer utility request.
            TransferUtilityUploadRequest request = new TransferUtilityUploadRequest()
            {
                BucketName = bucketName,
                Key = imageName,
                InputStream = memoryStream,
                CannedACL = S3CannedACL.PublicRead, // This is critical for users viewing images.
            };

            // Authenticating the API to write to bucket.
            BasicAWSCredentials awsCreds = new BasicAWSCredentials(_config["AWS:AccessKey"], _config["AWS:SecretKey"]);

            // Setting up the S3 client.
            IAmazonS3 client = new AmazonS3Client(awsCreds, Amazon.RegionEndpoint.USWest2);

            TransferUtility transferUtility = new TransferUtility(client);

            try
            { 
                // Uploading to S3.
                await transferUtility.UploadAsync(request);

                // Getting the pre-defined profile picture URL.
                string profilePictureURL = $"https://{bucketName}.s3.amazonaws.com/{imageName}";

                await _usersDataAccess.EditUserProfilePicture(userID, profilePictureURL);
            } catch (Exception e)
            {
                _logger.LogError(e.Message);

                throw new HttpResponseException((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}   

