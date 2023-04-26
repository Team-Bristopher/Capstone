using System.Security.Claims;
using Bogus;
using capstone_api.BusinessLogic;
using capstone_api.DataAccessLayer;
using capstone_api.IncomingMessages;
using capstone_api.Models.Constants;
using capstone_api.Models.DatabaseEntities;
using capstone_api.OutgoingMessages;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

namespace capstone_api.UnitTests
{
	public class FundraiserUnitTests
	{
        // Fake data library.
        Faker faker;

		// Mocked data access layer and business layer;
		private readonly Mock<IFundraiserDataAccess> _mockFundraiserDataAccess;
        private readonly Mock<IAuthBusinessLogic> _mockAuthBusinessLogic;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IHttpContextAccessor> _mockHttpContext;

        // Mocked but instantiated business layer.
        private readonly IFundraiserBusinessLogic _fundraiserBusinessLogic;

        public FundraiserUnitTests()
		{
            Mock<ILogger<FundraiserBusinessLogic>> mockLogger = new Mock<ILogger<FundraiserBusinessLogic>>();
			Mock<IFundraiserDataAccess> mockedFundraiserDataAccess = new Mock<IFundraiserDataAccess>();
            Mock<IHttpContextAccessor> mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            Mock<IAuthBusinessLogic> mockedAuthBusinessLogic = new Mock<IAuthBusinessLogic>();
            Mock<IConfiguration> mockedConfiguration = new Mock<IConfiguration>();

            _fundraiserBusinessLogic = new FundraiserBusinessLogic(
                mockedFundraiserDataAccess.Object,
                mockLogger.Object,
                mockHttpContextAccessor.Object,
                mockedAuthBusinessLogic.Object,
                mockedConfiguration.Object);

			_mockFundraiserDataAccess = mockedFundraiserDataAccess;
            _mockAuthBusinessLogic = mockedAuthBusinessLogic;
            _mockConfiguration = mockedConfiguration;
            _mockHttpContext = mockHttpContextAccessor;

            faker = new Faker();
		}

        [Fact]
        public void GetFundraiserDonations_FAIL_InvalidFundraiserID()
        {
            // Declare.
            Guid invalidFundraiserID = Guid.NewGuid();

            // Setup.
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiser(invalidFundraiserID)).Returns<Fundraiser?>(null);

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.GetFundraiserDonations(Models.Constants.DonationTimeSort.LATEST, invalidFundraiserID));
        }

        [Fact]
        public void GetFundraiserDonations_Success()
        {
            // Declare.
            Fundraiser mockFundraiser = new Fundraiser()
            {
                ID = Guid.NewGuid(),
                Type = new FundraiserType
                {
                    Type = FundraiserTypes.Medical,
                    ID = Guid.NewGuid(),
                },
                Title = faker.Random.Words(),
                Description = faker.Random.Words(),
                Target = faker.Random.Double(1, 2000),
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(2),
                CreatedByUserID = Guid.NewGuid()
            };

            List<Donation> mockedDonations = new List<Donation>();

            mockedDonations.Add(new Donation()
            {
                ID = Guid.NewGuid(),
                UserID = Guid.NewGuid(),
                FundraiserID = mockFundraiser.ID,
                DonatedOn = DateTime.UtcNow,
                Amount = faker.Random.Float(1, 500),
                Message = faker.Random.Words(),
                DonatedBy = new User()
                {
                    ID = Guid.NewGuid(),
                    FirstName = faker.Name.FirstName(),
                    LastName = faker.Name.LastName(),
                    EmailAddress = faker.Person.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(faker.Random.Word()),
                }
            });

            // Setup.
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiser(mockFundraiser.ID)).Returns(mockFundraiser);
            _mockFundraiserDataAccess.Setup(a => a.GetDonatedAmount(mockFundraiser.ID)).Returns(mockedDonations[0].Amount);
            _mockFundraiserDataAccess.Setup(a => a.GetRecentDonations(DonationTimeSort.LATEST, mockFundraiser.ID)).Returns(mockedDonations);

            // Act.
            FundraiserDonationAmountMessage message = _fundraiserBusinessLogic.GetFundraiserDonations(DonationTimeSort.LATEST, mockFundraiser.ID);

            Assert.True(message.TotalAmount.Equals(mockedDonations[0].Amount));
            Assert.True(message.RecentDonations.ToArray().Length.Equals(1));
            Assert.True(message.RecentDonations[0].FirstName.Equals(mockedDonations[0].DonatedBy.FirstName));
            Assert.True(message.RecentDonations[0].LastName.Equals(mockedDonations[0].DonatedBy.LastName));
        }

        [Fact]
        public void CreateFundraiser_FAIL_NoUserClaim()
        {
            // Declare.
            CreateFundraiserMessage mockCreateFundraiserMessage = new CreateFundraiserMessage()
            {
                Title = faker.Random.Words(),
                Description = faker.Random.Words(),
                Goal = faker.Random.Double(1, 999),
                ExpirationDate = DateTime.UtcNow.AddDays(10),
                Category = FundraiserTypes.Medical,
            };

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new List<Claim>() { });

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.CreateFundraiser(mockCreateFundraiserMessage));
        }

        [Fact]
        public void CreateFundraiser_FAIL_InvalidUserClaim()
        {
            // Declare.
            CreateFundraiserMessage mockCreateFundraiserMessage = new CreateFundraiserMessage()
            {
                Title = faker.Random.Words(),
                Description = faker.Random.Words(),
                Goal = faker.Random.Double(1, 999),
                ExpirationDate = DateTime.UtcNow.AddDays(10),
                Category = FundraiserTypes.Medical,
            };

            Guid invalidUserID = Guid.NewGuid();

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new List<Claim>() { new Claim(type: "ID", value: invalidUserID.ToString()) });
            _mockAuthBusinessLogic.Setup(a => a.GetUserByID(invalidUserID)).Returns<User?>(null);

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.CreateFundraiser(mockCreateFundraiserMessage));
        }

        [Fact]
        public void CreateFundraiser_Success()
        {
            // Declare.
            CreateFundraiserMessage mockCreateFundraiserMessage = new CreateFundraiserMessage()
            {
                Title = faker.Random.Words(),
                Description = faker.Random.Words(),
                Goal = faker.Random.Double(1, 999),
                ExpirationDate = DateTime.UtcNow.AddDays(10),
                Category = FundraiserTypes.Medical,
            };

            User mockUser = new User()
            {
                ID = Guid.NewGuid(),
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                EmailAddress = faker.Person.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(faker.Random.Word()),
            };

            Guid mockFundraiserID = Guid.NewGuid();

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new List<Claim>() { new Claim(type: "ID", value: mockUser.ID.ToString()) });
            _mockAuthBusinessLogic.Setup(a => a.GetUserByID(mockUser.ID)).Returns(mockUser);
            _mockFundraiserDataAccess.Setup(a => a.CreateFundraiser(mockCreateFundraiserMessage, mockUser.ID)).Returns(mockFundraiserID);

            // Act.
            CreateFundraiserResponseMessage createFundraiserResponseMessage = _fundraiserBusinessLogic.CreateFundraiser(mockCreateFundraiserMessage);

            Assert.True(createFundraiserResponseMessage.FundraiserID.Equals(mockFundraiserID));
        }

        [Fact]
        public void EditFundraiser_FAIL_NoUserClaim()
        {
            // Declare.
            Guid invalidFundraiserID = Guid.NewGuid();

            EditFundraiserMessage mockEditFundraiserMesage = new EditFundraiserMessage()
            {
                Category = FundraiserTypes.Medical,
                Description = faker.Random.Words(),
                ExpirationDate = DateTime.UtcNow.AddDays(1),
                Goal = faker.Random.Double(1, 999),
                Title = faker.Random.Words(),
            };

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.EditFundraiser(invalidFundraiserID, mockEditFundraiserMesage));
        }

        [Fact]
        public void EditFundraiser_FAIL_InvalidUserClaim()
        {
            // Declare.
            Guid invalidFundraiserID = Guid.NewGuid();

            Guid invalidUserID = Guid.NewGuid();

            EditFundraiserMessage mockEditFundraiserMesage = new EditFundraiserMessage()
            {
                Category = FundraiserTypes.Medical,
                Description = faker.Random.Words(),
                ExpirationDate = DateTime.UtcNow.AddDays(1),
                Goal = faker.Random.Double(1, 999),
                Title = faker.Random.Words(),
            };

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new List<Claim>() {  });

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.EditFundraiser(invalidFundraiserID, mockEditFundraiserMesage));
        }

        [Fact]
        public void EditFundraiser_FAIL_UserNotFoundByClaim()
        {
            // Declare.
            Guid invalidFundraiserID = Guid.NewGuid();

            Guid invalidUserID = Guid.NewGuid();

            EditFundraiserMessage mockEditFundraiserMesage = new EditFundraiserMessage()
            {
                Category = FundraiserTypes.Medical,
                Description = faker.Random.Words(),
                ExpirationDate = DateTime.UtcNow.AddDays(1),
                Goal = faker.Random.Double(1, 999),
                Title = faker.Random.Words(),
            };

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new[] { new Claim(type: "ID", value: invalidUserID.ToString() )});
            _mockAuthBusinessLogic.Setup(a => a.GetUserByID(invalidUserID)).Returns<User?>(null);

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.EditFundraiser(invalidFundraiserID, mockEditFundraiserMesage));
        }

        [Fact]
        public void EditFundraiser_FAIL_FundraiserNotFound()
        {
            // Declare.
            Guid invalidFundraiserID = Guid.NewGuid();

            EditFundraiserMessage mockEditFundraiserMesage = new EditFundraiserMessage()
            {
                Category = FundraiserTypes.Medical,
                Description = faker.Random.Words(),
                ExpirationDate = DateTime.UtcNow.AddDays(1),
                Goal = faker.Random.Double(1, 999),
                Title = faker.Random.Words(),
            };

            User mockUser = new User()
            {
                ID = Guid.NewGuid(),
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                EmailAddress = faker.Person.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(faker.Random.Word()),
            };

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new[] { new Claim(type: "ID", value: mockUser.ID.ToString()) });
            _mockAuthBusinessLogic.Setup(a => a.GetUserByID(mockUser.ID)).Returns(mockUser);
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiser(invalidFundraiserID)).Returns<Fundraiser?>(null);

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.EditFundraiser(invalidFundraiserID, mockEditFundraiserMesage));
        }

        [Fact]
        public void EditFundraiser_FAIL_UserNotAuthorizedToEditFundraiser()
        {
            // Declare.
            EditFundraiserMessage mockEditFundraiserMesage = new EditFundraiserMessage()
            {
                Category = FundraiserTypes.Medical,
                Description = faker.Random.Words(),
                ExpirationDate = DateTime.UtcNow.AddDays(1),
                Goal = faker.Random.Double(1, 999),
                Title = faker.Random.Words(),
            };

            User mockUser = new User()
            {
                ID = Guid.NewGuid(),
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                EmailAddress = faker.Person.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(faker.Random.Word()),
            };

            Fundraiser mockFundraiser = new Fundraiser()
            {
                ID = Guid.NewGuid(),
                Type = new FundraiserType
                {
                    Type = FundraiserTypes.Medical,
                    ID = Guid.NewGuid(),
                },
                Title = faker.Random.Words(),
                Description = faker.Random.Words(),
                Target = faker.Random.Double(1, 2000),
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(2),
                CreatedByUserID = Guid.NewGuid()
            };

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new[] { new Claim(type: "ID", value: mockUser.ID.ToString()) });
            _mockAuthBusinessLogic.Setup(a => a.GetUserByID(mockUser.ID)).Returns(mockUser);
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiser(mockFundraiser.ID)).Returns(mockFundraiser);

            // Act.
            Assert.Throws<HttpResponseException>(() => _fundraiserBusinessLogic.EditFundraiser(mockFundraiser.ID, mockEditFundraiserMesage));
        }

        [Fact]
        public void EditFundraiser_Success()
        {
            // Declare.
            EditFundraiserMessage mockEditFundraiserMesage = new EditFundraiserMessage()
            {
                Category = FundraiserTypes.Medical,
                Description = faker.Random.Words(),
                ExpirationDate = DateTime.UtcNow.AddDays(1),
                Goal = faker.Random.Double(1, 999),
                Title = faker.Random.Words(),
            };

            User mockUser = new User()
            {
                ID = Guid.NewGuid(),
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                EmailAddress = faker.Person.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(faker.Random.Word()),
            };

            Fundraiser mockFundraiser = new Fundraiser()
            {
                ID = Guid.NewGuid(),
                Type = new FundraiserType
                {
                    Type = FundraiserTypes.Medical,
                    ID = Guid.NewGuid(),
                },
                Title = faker.Random.Words(),
                Description = faker.Random.Words(),
                Target = faker.Random.Double(1, 2000),
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(2),
                CreatedByUserID = mockUser.ID
            };

            // Setup.
            _mockHttpContext.Setup(a => a.HttpContext.User.Claims).Returns(new[] { new Claim(type: "ID", value: mockUser.ID.ToString()) });
            _mockAuthBusinessLogic.Setup(a => a.GetUserByID(mockUser.ID)).Returns(mockUser);
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiser(mockFundraiser.ID)).Returns(mockFundraiser);

            // Act.
            _fundraiserBusinessLogic.EditFundraiser(mockFundraiser.ID, mockEditFundraiserMesage);
        }

        [Fact]
        public void GetFundraisers_Success_NoFilters()
        {
            // Declare.
            int mockPage = 0;

            List<Fundraiser> mockFundraisers = new List<Fundraiser>()
            {
                new Fundraiser()
                {
                    ID = Guid.NewGuid(),
                    Type = new FundraiserType
                    {
                        Type = FundraiserTypes.Medical,
                        ID = Guid.NewGuid(),
                    },
                    Title = faker.Random.Words(),
                    Description = faker.Random.Words(),
                    Target = faker.Random.Double(1, 2000),
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(2),
                    CreatedByUserID = Guid.NewGuid()
                }
            };

            int mockViewCount = faker.Random.Int(0, 100);

            // Setup.
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiserViews(mockFundraisers[0].ID)).Returns(mockViewCount);
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiserImages(mockFundraisers[0].ID)).Returns(new List<FundraiserImages>());
            _mockFundraiserDataAccess.Setup(a => a.GetFundraisers(mockPage, null, null)).Returns(mockFundraisers);

            // Act.
            IEnumerable<FundraiserMessage> fundraiserMessages = _fundraiserBusinessLogic.GetFundraisers(mockPage, null, null);

            Assert.True(fundraiserMessages.ToArray().Length.Equals(1));
            Assert.True(fundraiserMessages.ToArray()[0].ID.Equals(mockFundraisers[0].ID));
            Assert.True(fundraiserMessages.ToArray()[0].Views.Equals(mockViewCount));
        }

        [Fact]
        public void GetFundraisers_Success_WithFilters()
        {
            // Declare.
            int mockPage = 0;

            string fundraiserTitleSearchTerm = "Specific";

            List<Fundraiser> mockFundraisers = new List<Fundraiser>()
            {
                new Fundraiser()
                {
                    ID = Guid.NewGuid(),
                    Type = new FundraiserType
                    {
                        Type = FundraiserTypes.Medical,
                        ID = Guid.NewGuid(),
                    },
                    Title = "A not interesting fundraiser",
                    Description = faker.Random.Words(),
                    Target = faker.Random.Double(1, 2000),
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(2),
                    CreatedByUserID = Guid.NewGuid()
                },
                new Fundraiser()
                {
                    ID = Guid.NewGuid(),
                    Type = new FundraiserType
                    {
                        Type = FundraiserTypes.Medical,
                        ID = Guid.NewGuid(),
                    },
                    Title = "Specific Title",
                    Description = faker.Random.Words(),
                    Target = faker.Random.Double(1, 2000),
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(2),
                    CreatedByUserID = Guid.NewGuid()
                }
            };

            int mockViewCount = faker.Random.Int(0, 100);

            // Setup.
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiserViews(mockFundraisers[0].ID)).Returns(mockViewCount);
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiserImages(mockFundraisers[0].ID)).Returns(new List<FundraiserImages>());
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiserViews(mockFundraisers[1].ID)).Returns(mockViewCount);
            _mockFundraiserDataAccess.Setup(a => a.GetFundraiserImages(mockFundraisers[1].ID)).Returns(new List<FundraiserImages>());
            _mockFundraiserDataAccess.Setup(a => a.GetFundraisers(mockPage, fundraiserTitleSearchTerm, null)).Returns(new List<Fundraiser>() { mockFundraisers[1] });

            // Act.
            IEnumerable<FundraiserMessage> fundraiserMessages = _fundraiserBusinessLogic.GetFundraisers(mockPage, fundraiserTitleSearchTerm, null);

            Assert.True(fundraiserMessages.ToArray().Length.Equals(1));
            Assert.True(fundraiserMessages.ToArray()[0].ID.Equals(mockFundraisers[1].ID));
            Assert.True(fundraiserMessages.ToArray()[0].Views.Equals(mockViewCount));
        }
    }
}

