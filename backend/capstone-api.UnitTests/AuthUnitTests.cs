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
using System.Text;
using capstone_api.Models.Constants;

namespace UnitTests
{
    public class AuthUnitTests
    {
        // Fake data library.
        Faker faker;

        // Mocked data access layer.
        private readonly Mock<IUsersDataAccess> _userDataAccess;
        private readonly Mock<IAuthDataAccess> _authDataAccess;

        // Mocked but instantiated business layer.
        private readonly IAuthBusinessLogic _authBusinessLogic;

        public AuthUnitTests()
        {
            Mock<ILogger<AuthBusinessLogic>> mockLogger = new Mock<ILogger<AuthBusinessLogic>>();
            Mock<IHttpContextAccessor> mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            Mock<IAuthDataAccess> mockDataAccess = new Mock<IAuthDataAccess>();
            Mock<IUsersDataAccess> mockUsersDataAccess = new Mock<IUsersDataAccess>();

            string mockAppSettings = @"{
                ""Jwt"" : {
                    ""Key"": ""GfVltGZoJSSSDW321AARYgYgJ9p5"",
                    ""Issuer"": ""http://localhost:5018"",
                    ""Audience"": ""http://localhost:5018""
                }
            }";

            ConfigurationBuilder builder = new ConfigurationBuilder();

            builder.AddJsonStream(new MemoryStream(Encoding.UTF8.GetBytes(mockAppSettings)));

            IConfiguration configuration = builder.Build();

            _authBusinessLogic = new AuthBusinessLogic(
                mockLogger.Object,
                mockHttpContextAccessor.Object,
                mockDataAccess.Object,
                configuration,
                mockUsersDataAccess.Object);

            _userDataAccess = mockUsersDataAccess;
            _authDataAccess = mockDataAccess;

            faker = new Faker();
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
            _userDataAccess.Setup(a => a.GetUserByEmail(fakeEmail)).Returns<User?>(null);

            // Act.
            Assert.Throws<HttpResponseException>(() => _authBusinessLogic.LoginUser(loginUserMesage));
        }

        [Fact]
        public void LoginUser_FAIL_WrongPassword()
        {
            // Declare.
            User fakeUser = new User()
            {
                ID = Guid.NewGuid(),
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                EmailAddress = faker.Person.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(faker.Random.Word()),
            };

            LoginUserMessage loginUserMesage = new LoginUserMessage
            {
                Email = fakeUser.EmailAddress,
                Password = "NotActualPassword",
            };

            // Setup.
            _userDataAccess.Setup(a => a.GetUserByEmail(fakeUser.EmailAddress)).Returns(fakeUser);

            // Act.
            Assert.Throws<HttpResponseException>(() => _authBusinessLogic.LoginUser(loginUserMesage));
        }

        [Fact]
        public void LoginUser_Success()
        {
            // Declare.
            string plainTextPassword = "secret_word";

            User fakeUser = new User()
            {
                ID = Guid.NewGuid(),
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                EmailAddress = faker.Person.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(plainTextPassword),
            };

            LoginUserMessage loginUserMesage = new LoginUserMessage
            {
                Email = fakeUser.EmailAddress,
                Password = plainTextPassword,
            };

            // Setup.
            _userDataAccess.Setup(a => a.GetUserByEmail(fakeUser.EmailAddress)).Returns(fakeUser);
            _authDataAccess.Setup(a => a.GetUserRole(fakeUser.ID)).Returns(UserRoles.USER);

            // Act.
            string authToken = _authBusinessLogic.LoginUser(loginUserMesage);

            Assert.True(!string.IsNullOrWhiteSpace(authToken));
        }
    }
}
