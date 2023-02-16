using System;
using capstone_api.Models.DatabaseEntities;
using Microsoft.EntityFrameworkCore;

namespace capstone_api
{
    public class DatabaseContext : DbContext
	{
        /// <summary>
        /// The database connection string.
        /// </summary>
        private static readonly string _databaseConnectionString = "User ID=capstone;Password=capstone123;Host=localhost;Port=5432;Database=capstone";

        /// <summary>
        /// The name of the database schema.
        /// </summary>
        private static readonly string _schema = "Capstone";

        /// <summary>
        /// The Fundraisers database context.
        /// </summary>
        public DbSet<Fundraiser> Fundraisers { get; set; }

        /// <summary>
        /// The Users database context.
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// The Donations database context.
        /// </summary>
        public DbSet<Donation> Donations { get; set; }

        /// <summary>
        /// The Comments database context.
        /// </summary>
        public DbSet<Comment> Comments { get; set; }

        /// <summary>
        /// The FundraiserAdmins database context.
        /// </summary>
        public DbSet<FundraiserAdmin> FundraiserAdmins { get; set; }

        /// <summary>
        /// The GlobalAdmins database context.
        /// </summary>
        public DbSet<GlobalAdmin> GlobalAdmins { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_databaseConnectionString, options =>
            {
                options.MigrationsHistoryTable("__EFMigrationsHistory", _schema);
                options.MigrationsAssembly("capstone-api");
            });

            // TODO: Remove before release.
            optionsBuilder.EnableDetailedErrors();
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema(_schema);

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.ID);

                entity.HasOne(e => e.Fundraiser).WithMany(e => e.Comments);
                entity.HasOne(e => e.User).WithMany(e => e.Comments);
            });

            modelBuilder.Entity<Donation>(entity =>
            {
                entity.HasKey(e => e.ID);

                entity.HasOne(e => e.DonatedBy).WithMany(e => e.Donations);
                entity.HasOne(e => e.Fundraiser).WithMany(e => e.Donations);
            });

            modelBuilder.Entity<Fundraiser>(entity =>
            {
                entity.HasKey(e => e.ID);

                entity.HasOne(e => e.CreatedByUser).WithMany(e => e.CreatedFundraisers);
                entity.HasOne(e => e.Type);

                entity.HasMany(e => e.Comments).WithOne(e => e.Fundraiser);
                entity.HasMany(e => e.Donations).WithOne(e => e.Fundraiser);
                entity.HasMany(e => e.Admins).WithOne(e => e.Fundraiser);
            });

            modelBuilder.Entity<FundraiserAdmin>(entity =>
            {
                entity.HasKey(e => new
                {
                    e.UserID,
                    e.FundraiserID
                });

                entity.HasOne(e => e.Fundraiser).WithMany(e => e.Admins);
                entity.HasOne(e => e.User);
            });

            modelBuilder.Entity<GlobalAdmin>(entity =>
            {
                entity.HasKey(e => new
                {
                    e.UserID
                });

                entity.HasOne(e => e.User);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.ID);

                entity.HasMany(e => e.Donations).WithOne(e => e.DonatedBy);
                entity.HasMany(e => e.CreatedFundraisers).WithOne(e => e.CreatedByUser);
            });

            // Seeding anonymous user.
            modelBuilder.Entity<User>().HasData(new List<User>()
            {
                new User()
                {
                    ID = Guid.Parse("93d9ad71-19eb-4a08-94aa-50f2123c1f52"),
                    FirstName = "Anonymous",
                    LastName = "User",
                    EmailAddress = "anonymous@user.org",
                    Password = "SuperSecretPassw0rd!",
                }
            });

            // Seeding FundraiserTypes.
            modelBuilder.Entity<FundraiserType>().HasData(new List<FundraiserType>
            {
                new FundraiserType()
                {
                    ID = Guid.Parse("64c75b27-e6c1-4214-822e-0ba901e59b03"),
                    Type = FundraiserTypes.Medical,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("8a688175-7482-4d01-b5be-f701b6a34b20"),
                    Type = FundraiserTypes.Education,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("90a7b31a-f52a-425e-910f-bee4dd2eb634"),
                    Type = FundraiserTypes.Disaster_Relief,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("205da614-45da-4d86-8046-ab64eb9ffa1f"),
                    Type = FundraiserTypes.Environment,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("612d03cf-5b04-4ee4-8699-b3d88595c08c"),
                    Type = FundraiserTypes.Animal_Welfare,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("71f1a1c7-3954-498f-ac25-f710d72b9f6c"),
                    Type = FundraiserTypes.Financial_Assistance,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("a07bf21e-17d5-48c6-abf9-3154d8e4387a"),
                    Type = FundraiserTypes.Religion,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("ee5eb6bd-135c-4a02-b0ac-b9a1097ffd0a"),
                    Type = FundraiserTypes.Community,
                },
                new FundraiserType()
                {
                    ID = Guid.Parse("64d3f6df-5597-4856-9627-e72aadd323e9"),
                    Type = FundraiserTypes.Political,
                },
            });
        }
    }
}

