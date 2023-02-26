using System;
using System.Net;
using capstone_api.IncomingMessages;
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
    }
}
