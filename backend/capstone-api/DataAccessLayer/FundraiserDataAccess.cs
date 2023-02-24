using System;
using capstone_api.Models.DatabaseEntities;

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
    }
}
