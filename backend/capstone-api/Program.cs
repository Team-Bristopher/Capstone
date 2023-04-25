using System.Security.Claims;
using System.Text;
using capstone_api;
using capstone_api.BusinessLogic;
using capstone_api.DataAccessLayer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMvc();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddDbContextFactory<DatabaseContext>();

builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Registering data access.
builder.Services.AddScoped<IAuthDataAccess, AuthDataAccess>();
builder.Services.AddTransient<IUsersDataAccess, UsersDataAccess>();
builder.Services.AddScoped<IFundraiserDataAccess, FundraiserDataAccess>();

// Registering business logic.
builder.Services.AddScoped<IAuthBusinessLogic, AuthBusinessLogic>();
builder.Services.AddTransient<IUsersBusinessLogic, UsersBusinessLogic>();
builder.Services.AddScoped<IFundraiserBusinessLogic, FundraiserBusinessLogic>();

// Registering filters.
builder.Services.AddControllers(options =>
{
    options.Filters.Add<HttpResponseExceptionFilter>();
});

// Registering JWT.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Registering authorization settings.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RegisteredUser",
        policy => policy.RequireAssertion(
            context => context.User.HasClaim(
                c => c.Type == "Role")));
});

var app = builder.Build();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"));

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseCors();

app.UseStaticFiles();

app.Run();

