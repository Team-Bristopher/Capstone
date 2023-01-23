using System;
using static capstone_api.Helpers.Helpers;

namespace capstone_api.Models.OutgoingMessages
{
	/// <summary>
	/// Contains information about the
	/// healthcheck of the capstone API.
	/// </summary>
	public class HealthcheckMessage
	{
		public HealthcheckMessage(string health)
		{
			VerifyIsNotNull(health, nameof(health));

			Health = health;
		}

		/// <summary>
		/// The current health of the API.
		/// </summary>
		public string Health { get; }
    }
}

