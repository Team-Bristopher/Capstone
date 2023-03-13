using System;

namespace capstone_api.OutgoingMessages
{
	/// <summary>
	/// Contains information about fundraisers
	/// sent while querying the dashboard page.
	/// </summary>
	public class FundraiserMessage
	{
		/// <summary>
		/// The ID of the fundraiser.
		/// </summary>
		public Guid ID { get; set; }

		/// <summary>
		/// The title of the fundraiser.
		/// </summary>
		public string Title { get; set; }

		/// <summary>
		/// The description of the fundraiser.
		/// </summary>
		public string Description { get; set; }

		/// <summary>
		/// The type of the fundraiser.
		/// </summary>
		public int Type { get; set; }

		/// <summary>
		/// The views of the fundraiser.
		/// </summary>
		public long Views { get; set; }

		/// <summary>
		/// The goal amount of the fundraiser.
		/// </summary>
		public double Target { get; set; }

		/// <summary>
		/// The author of this fundraiser.
		/// </summary>
		public UserMessage Author { get; set; }

		/// <summary>
		/// The time the fundraiser was created on.
		/// </summary>
		public DateTime CreatedOn { get; set; }

		/// <summary>
		/// The last time the fundraiser was edited.
		/// </summary>
		public DateTime ModifiedOn { get; set; }

		/// <summary>
		/// The date the fundraiser expires.
		/// </summary>
		public DateTime EndDate { get; set; }

		/// <summary>
		/// The ID of the user that created the fundraiser.
		/// </summary>
		public Guid CreatedBy { get; set; }

		/// <summary>
		/// The amount of comments this fundraiser has.
		/// </summary>
		public long CommentCount { get; set; }
	}
}

