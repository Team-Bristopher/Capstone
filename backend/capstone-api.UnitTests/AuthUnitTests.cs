using capstone_api.BusinessLogic;
using Xunit;
using Moq;
using capstone_api.DataAccessLayer;
using Bogus;
using capstone_api.Models.DatabaseEntities;
using capstone_api.IncomingMessages;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace UnitTests
{
    public class AuthUnitTests
    {
        // Fake data library.
        Faker faker;

        // Mocked data access layer.
        private readonly Mock<IAuthDataAccess> _authDataAccess;

        // Mocked but instantiated business layer.
        private readonly IAuthBusinessLogic _authBusinessLogic;

        public AuthUnitTests()
        {
            Mock<ILogger<AuthBusinessLogic>> mockLogger = new Mock<ILogger<AuthBusinessLogic>>();
            Mock<IHttpContextAccessor> mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            Mock<IAuthDataAccess> mockDataAccess = new Mock<IAuthDataAccess>();
            Mock<IConfiguration> mockConfiguration = new Mock<IConfiguration>();

            _authBusinessLogic = new AuthBusinessLogic(
                mockLogger.Object,
                mockHttpContextAccessor.Object,
                mockDataAccess.Object,
                mockConfiguration.Object);

            _authDataAccess = mockDataAccess;

            faker = new Faker("en");
        }

        [Fact]
        public void LoginUser_FAIL_UserNotFound()
        {
            // Declare.
            string fakeEmail = faker.Person.Email;
            string fakePassword = faker.Random.Word();

            LoginUserMessage loginUserMesage = new LoginUserMessage
            {
                Email = fakeEmail,
                Password = fakePassword,
            };

            // Setup.
            _authDataAccess.Setup(a => a.GetUserByEmail(fakeEmail)).Returns<User?>(null);

            // Act.
            Assert.Throws<HttpResponseException>(() => _authBusinessLogic.LoginUser(loginUserMesage));
        }
    }
}
