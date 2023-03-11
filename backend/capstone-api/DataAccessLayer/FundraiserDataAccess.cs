using System;
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
		/// Gets the fundraiser feed.
		/// </summary>
		/// <param name="page">The current page, used for pagination.</param>
		/// <returns>The list of fundraisers.</returns>
		public List<Fundraiser> GetFundraisers(int page);

        /// <summary>
        /// Gets the donations feed.
        /// </summary>
        /// <param name="page">The current page, used for pagination.</param>
		/// <param name="fundraiserID">The ID of the fundraiser.</param>
        /// <returns>The list of donations.</returns>
        public List<Donation> GetAllDonations(Guid fundraiserID, int page);

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
		/// <param name="user">The user donating.</param>
		/// <param name="amount">The amount to be donated.</param>
		public void DonateToFundraiser(Fundraiser fundraiser, User user, double amount);

		/// <summary>
		/// Returns the last 6 most recent donations to a fundraiser.
		/// </summary>
		/// <param name="fundraiserID">The unique identifier of the fundraiser.</param>
		/// <param name="sortOption">The sort option of the donations.</param>
		/// <returns>The last 6 most recent donations, by date/time.</returns>
		public List<Donation> GetRecentDonations(DonationTimeSort sortOption, Guid fundraiserID);
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
        public List<Fundraiser> GetFundraisers(int page)
		{
			return _databaseContext.Fundraisers
				.Include(a => a.Type)
                .Skip(page * 6)
                .Take(6)
				.OrderBy(a => a.CreatedOn)
				.ToList();
		}

		/// <inheritdoc />
        public List<Donation> GetAllDonations(Guid fundraiser, int page)
		{
			return _databaseContext.Donations
                .Include(a => a.DonatedBy)
                .Skip(page * 6)
                .Take(6)
                .OrderBy(a => a.DonatedOn)
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
        public void DonateToFundraiser(Fundraiser fundraiser, User user, double amount)
		{
			Donation donation = new Donation()
			{
				ID = Guid.NewGuid(),
				DonatedBy = user,
				Fundraiser = fundraiser,
				Amount = amount,
				DonatedOn = DateTime.UtcNow,
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
	}
}
