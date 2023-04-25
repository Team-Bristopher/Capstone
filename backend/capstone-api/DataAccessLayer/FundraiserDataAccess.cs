using System;
using System.Linq;
using System.Net;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
using capstone_api.Models.DatabaseEntities;
using Microsoft.EntityFrameworkCore;

namespace capstone_api.DataAccessLayer
{
	/// <summary>
	/// The data access layer for fundraiser
	/// operations.
	/// </summary>
	public interface IFundraiserDataAccess
	{
        /// <summary>
        /// Gets a fundraiser by ID.
        /// </summary>
        /// <param name="fundraiserID">The unique identifier of the fundraiser.</param>
        /// <returns>The fundraiser if found. Otherwise, it will return null.</returns>
        public Fundraiser? GetFundraiser(Guid fundraiserID);

		/// <summary>
		/// Gets the amount donated so far to a fundraiser.
		/// </summary>
		/// <param name="fundraiserID">The unique identifier of the fundraiser.</param>
		/// <returns>The amount donated.</returns>
		public double GetDonatedAmount(Guid fundraiserID);

		/// <summary>
		/// Creates the fundraiser database object.
		/// </summary>
		/// <param name="message">The information about the fundraiser.</param>
		/// <param name="userID">The unique identifier of the user posting this fundraiser.</param>
		/// <returns>The ID of the newly created fundraiser.</returns>
		public Guid CreateFundraiser(CreateFundraiserMessage message, Guid userID);

		/// <summary>
		/// Edits a fundraiser.
		/// </summary>
		/// <param name="fundraiserID">The ID of the fundraiser to edit.</param>
		/// <param name="message">The information by which to edit the fundraiser.</param>
		public void EditFundraiser(Guid fundraiserID, EditFundraiserMessage message);

        /// <summary>
        /// Gets the fundraiser feed.
        /// </summary>
        /// <param name="page">The current page, used for pagination.</param>
        /// <param name="fundraiserTitle">Optional. The filter term for the fundraiser title.</param>
        /// <param name="fundraiserCategory">Optional. The filter term for the fundraiser category.</param>
        /// <returns>The list of fundraisers.</returns>
        public List<Fundraiser> GetFundraisers(int page, string? fundraiserTitle, int? fundraiserCategory);

        /// <summary>
        /// Gets the donations feed.
        /// </summary>
        /// <param name="page">The current page, used for pagination.</param>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
		/// <param name="onlyComments">Indicates whether or not to only include donations with comments.</param>
        /// <returns>The list of donations.</returns>
        public List<Donation> GetAllDonations(Guid fundraiserID, int page, bool onlyComments);

        /// <summary>
        /// Submits a view for a fundraiser.
        /// </summary>
        /// <param name="fundraiserID">The ID of the fundraiser to submit a view for.</param>
        /// <param name="userID">The ID of the user.</param>
        public void AddFundraiserView(Guid fundraiserID, Guid userID);

		/// <summary>
		/// Gets the total number of unique fundraiser views.
		/// </summary>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
		/// <returns>The amount of total unique fundraiser views.</returns>
		public long GetFundraiserViews(Guid fundraiserID);

		/// <summary>
		/// Donates to a fundraiser.
		/// </summary>
		/// <param name="fundraiser">The fundraiser.</param>
		/// <param name="message">The donation message.</param>
		/// <param name="user">The user donating.</param>
		/// <param name="amount">The amount to be donated.</param>
		public void DonateToFundraiser(Fundraiser fundraiser, string message, User user, double amount);

		/// <summary>
		/// Returns the last 6 most recent donations to a fundraiser.
		/// </summary>
		/// <param name="fundraiserID">The unique identifier of the fundraiser.</param>
		/// <param name="sortOption">The sort option of the donations.</param>
		/// <returns>The last 6 most recent donations, by date/time.</returns>
		public List<Donation> GetRecentDonations(DonationTimeSort sortOption, Guid fundraiserID);

		/// <summary>
		/// Gets the amount of comments a fundraiser has.
		/// </summary>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
		/// <returns>The amount of comments.</returns>
		public long GetFundraiserCommentCount(Guid fundraiserID);

		/// <summary>
		/// Gets the amount of donations a fundraiser has.
		/// </summary>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
		/// <returns>The amount of donations.</returns>
		public long GetFundraiserDonationCount(Guid fundraiserID);

		/// <summary>
		/// Saves the URL of the image regarding a fundraiser that has been uploaded.
		/// </summary>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
		/// <param name="imageURL">The image that has been uploaded to S3.</param>
		public void SaveFundraiserImageURL(Guid fundraiserID, string imageURL);

		/// <summary>
		/// Gets the list of images uploaded regarding this fundraiser.
		/// </summary>
		/// <param name="fundraiserID"></param>
		/// <returns></returns>
		public List<FundraiserImages> GetFundraiserImages(Guid fundraiserID);

		/// <summary>
		/// Removes the list of images that are being replaced
		/// during a fundraiser edit.
		/// </summary>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
		public void RemoveFundraiserImages(Guid fundraiserID);
	}

	/// <inheritdoc />
	public class FundraiserDataAccess : IFundraiserDataAccess
	{
		private readonly DatabaseContext _databaseContext;

		/// <summary>
		/// Constructor.
		/// </summary>
		public FundraiserDataAccess(
			DatabaseContext databaseContext)
		{
			_databaseContext = databaseContext;
		}

		/// <inheritdoc />
        public double GetDonatedAmount(Guid fundraiserID)
		{
			IEnumerable<Donation> allDonations = _databaseContext.Donations
				.Where(a => a.FundraiserID.Equals(fundraiserID));

			double donationSum = 0;

			allDonations.ToList().ForEach(d => donationSum += d.Amount);

			return donationSum;
		}

		/// <inheritdoc />
		public Fundraiser? GetFundraiser(Guid fundraiserID)
		{
			return _databaseContext.Fundraisers
				.Where(a => a.ID.Equals(fundraiserID))
				.Include(a => a.CreatedByUser)
				.Include(a => a.Type)
				.FirstOrDefault();
		}

		/// <inheritdoc />
        public Guid CreateFundraiser(CreateFundraiserMessage message, Guid userID)
		{
			FundraiserType? fundraiserType = _databaseContext.FundraiserType
				.Where(a => a.Type.Equals(message.Category))
				.FirstOrDefault();

			if (fundraiserType == null)
			{
				throw new HttpResponseException((int)HttpStatusCode.BadRequest);
			}

			Fundraiser fundraiser = new Fundraiser()
			{
				ID = new Guid(),
				Type = fundraiserType,
				Title = message.Title,
				Description = message.Description,
				Target = message.Goal,
				CreatedOn = DateTime.UtcNow,
				ModifiedOn = DateTime.UtcNow,
				CreatedByUserID = userID,
				EndDate = message.ExpirationDate.ToUniversalTime(),
			};

			_databaseContext.Add(fundraiser);

			_databaseContext.SaveChanges();

			return fundraiser.ID;
		}

		/// <inheritdoc />
        public void EditFundraiser(Guid fundraiserID, EditFundraiserMessage message)
		{
			Fundraiser? matchedFundraiser = _databaseContext.Fundraisers
				.Where(a => a.ID.Equals(fundraiserID))
				.First();

			FundraiserType fundraiserType = _databaseContext.FundraiserType
				.Where(a => a.Type.Equals(message.Category))
				.First();

			matchedFundraiser.Title = message.Title;
			matchedFundraiser.Description = message.Description;
			matchedFundraiser.Target = message.Goal;
			matchedFundraiser.EndDate = message.ExpirationDate.ToUniversalTime();
			matchedFundraiser.Type = fundraiserType;
			matchedFundraiser.ModifiedOn = DateTime.UtcNow;

			_databaseContext.SaveChanges();
		}

        /// <inheritdoc />
        public List<Fundraiser> GetFundraisers(int page, string? fundraiserTitle, int? fundraiserCategory)
		{
			IQueryable<Fundraiser> fundraisers = _databaseContext.Fundraisers;

			if (!string.IsNullOrWhiteSpace(fundraiserTitle))
			{
				fundraisers = fundraisers
					.Where(a => a.Title.Contains(fundraiserTitle));
			}

			if (fundraiserCategory.HasValue)
			{
				fundraisers = fundraisers
					.Include(a => a.Type)
					.Where(a => (int)a.Type.Type == fundraiserCategory.Value);
			}

            return fundraisers
				.Include(a => a.Type)
                .Include(a => a.FundraiserImages)
                .OrderByDescending(a => a.CreatedOn)
                .Skip(page * 6)
                .Take(6)
                .ToList();
		}

		/// <inheritdoc />
        public List<Donation> GetAllDonations(Guid fundraiser, int page, bool onlyComments)
		{
			if (onlyComments)
			{
                return _databaseContext.Donations
					.Where(a => a.FundraiserID.Equals(fundraiser))
					.Where(a => !string.IsNullOrEmpty(a.Message))
					.Include(a => a.DonatedBy)
                    .OrderByDescending(a => a.DonatedOn)
                    .Skip(page * 6)
					.Take(6)
					.ToList();
            }

			return _databaseContext.Donations
				.Where(a => a.FundraiserID.Equals(fundraiser))
                .Include(a => a.DonatedBy)
                .OrderByDescending(a => a.DonatedOn)
                .Skip(page * 6)
                .Take(6)
                .ToList();
        }

        /// <inheritdoc />
        public void AddFundraiserView(Guid fundraiserID, Guid userID)
		{
			FundraiserView? existingView = _databaseContext.FundraiserViews
				.Where(a => a.ViewedByID.Equals(userID))
				.Where(a => a.FundraiserID.Equals(fundraiserID))
				.FirstOrDefault();

			// If no view was found for the particular
			// fundraiser from the particular person.
			if (existingView == null)
			{
				FundraiserView view = new FundraiserView()
				{
					ID = Guid.NewGuid(),
					ViewedByID = userID,
					FundraiserID = fundraiserID,
					ViewedOn = DateTime.UtcNow
				};

				_databaseContext.Add(view);
			}
			else
			{
				existingView.ViewedOn = DateTime.UtcNow;
            }

            _databaseContext.SaveChanges();
        }

        /// <inheritdoc />
        public long GetFundraiserViews(Guid fundraiserID)
		{
			return _databaseContext.FundraiserViews
					.Where(a => a.FundraiserID.Equals(fundraiserID))
					.Count();
		}

		/// <inheritdoc />
        public void DonateToFundraiser(Fundraiser fundraiser, string message, User user, double amount)
		{
			Donation donation = new Donation()
			{
				ID = Guid.NewGuid(),
				DonatedBy = user,
				Fundraiser = fundraiser,
				Amount = amount,
				DonatedOn = DateTime.UtcNow,
				Message = message,
			};

			_databaseContext.Add(donation);

			_databaseContext.SaveChanges();
		}

		/// <inheritdoc />
        public List<Donation> GetRecentDonations(DonationTimeSort sortOption, Guid fundraiserID)
		{
			if (sortOption == DonationTimeSort.LATEST)
			{
				return _databaseContext.Donations
					.Where(a => a.FundraiserID.Equals(fundraiserID))
					.Include(a => a.DonatedBy)
					.OrderBy(a => a.DonatedOn)
					.Take(6)
					.ToList();
            }

			return _databaseContext.Donations
				.Where(a => a.FundraiserID.Equals(fundraiserID))
				.Include(a => a.DonatedBy)
				.OrderByDescending(a => a.DonatedOn)
				.Take(6)
				.ToList();
        }

		/// <inheritdoc />
        public long GetFundraiserCommentCount(Guid fundraiserID)
		{
			return _databaseContext.Donations
				.Where(a => a.FundraiserID.Equals(fundraiserID))
				.Where(a => !string.IsNullOrEmpty(a.Message))
				.Distinct()
				.Count();
		}

		/// <inheritdoc />
        public long GetFundraiserDonationCount(Guid fundraiserID)
		{
			return _databaseContext.Donations
				.Where(a => a.FundraiserID.Equals(fundraiserID))
				.Distinct()
				.Count();
		}

		/// <inheritdoc />
        public void SaveFundraiserImageURL(Guid fundraiserID, string imageURL)
		{
			Fundraiser matchedFundraiser = _databaseContext.Fundraisers
				.Where(a => a.ID.Equals(fundraiserID))
				.First();

			FundraiserImages fundraiserImages = new FundraiserImages
			{
				Fundraiser = matchedFundraiser,
				FundraiserID = matchedFundraiser.ID,
				FundraiserImageURL = imageURL,
				ID = Guid.NewGuid(),
				UploadedAt = DateTime.UtcNow,
			};

			_databaseContext.Add(fundraiserImages);

			_databaseContext.SaveChanges();
		}

		/// <inheritdoc />
        public List<FundraiserImages> GetFundraiserImages(Guid fundraiserID)
		{
			return _databaseContext.FundraiserImages
				.Where(a => a.FundraiserID.Equals(fundraiserID))
				.OrderBy(a => a.UploadedAt)
				.ToList();
		}

		/// <inheritdoc />
        public void RemoveFundraiserImages(Guid fundraiserID)
		{
			List<FundraiserImages> existingImages = _databaseContext.FundraiserImages
				.Where(a => a.FundraiserID.Equals(fundraiserID))
				.ToList();

			if (existingImages.Count > 0)
			{
				existingImages.ForEach((image) =>
				{
					_databaseContext.Remove(image);
				});
			}

			_databaseContext.SaveChanges();
		}
    }
}
