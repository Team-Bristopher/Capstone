using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

/// <summary>
/// Types of Funraisers.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum FundraiserTypes
{
	Medical = 0,
	Education = 1,
	Disaster_Relief = 2,
	Environment = 3,
	Animal_Welfare = 4,
	Financial_Assistance = 5,
	Religion = 6,
	Community = 7,
	Political = 8,
	Other = 9,
}

namespace capstone_api.Models.DatabaseEntities
{
	/// <summary>
	/// Contains informationa about the
	/// FundraiserTypes databse entity.
	/// </summary>
	[Table("FundraiserTypes")]
	public class FundraiserType
	{
        /// <summary>
        /// The unique identifier of the FundraiserType.
        /// </summary>
        [Key]
		[Required]
        public Guid ID { get; set; } = Guid.NewGuid();

		/// <summary>
		/// The FundraiserType of the Fundraiser.
		/// </summary>
		[Required]
		public FundraiserTypes Type { get; set; }
    }
}

