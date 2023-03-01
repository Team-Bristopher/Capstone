﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using capstone_api;

#nullable disable

namespace capstoneapi.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20230301155839_AddedViewTable")]
    partial class AddedViewTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("Capstone")
                .HasAnnotation("ProductVersion", "7.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.Comment", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("CommentText")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<Guid>("FundraiserID")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserID")
                        .HasColumnType("uuid");

                    b.HasKey("ID");

                    b.HasIndex("FundraiserID");

                    b.HasIndex("UserID");

                    b.ToTable("Comments", "Capstone");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.Donation", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<double>("Amount")
                        .HasColumnType("double precision");

                    b.Property<Guid>("FundraiserID")
                        .HasColumnType("uuid");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<Guid>("UserID")
                        .HasColumnType("uuid");

                    b.HasKey("ID");

                    b.HasIndex("FundraiserID");

                    b.HasIndex("UserID");

                    b.ToTable("Donations", "Capstone");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.Fundraiser", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CreatedByUserID")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2048)
                        .HasColumnType("character varying(2048)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("ModifiedOn")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("Target")
                        .HasColumnType("double precision");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<Guid>("TypeID")
                        .HasColumnType("uuid");

                    b.HasKey("ID");

                    b.HasIndex("CreatedByUserID");

                    b.HasIndex("TypeID");

                    b.ToTable("Fundraisers", "Capstone");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.FundraiserAdmin", b =>
                {
                    b.Property<Guid>("UserID")
                        .HasColumnType("uuid");

                    b.Property<Guid>("FundraiserID")
                        .HasColumnType("uuid");

                    b.HasKey("UserID", "FundraiserID");

                    b.HasIndex("FundraiserID");

                    b.ToTable("FundraiserAdmins", "Capstone");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.FundraiserType", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.ToTable("FundraiserTypes", "Capstone");

                    b.HasData(
                        new
                        {
                            ID = new Guid("64c75b27-e6c1-4214-822e-0ba901e59b03"),
                            Type = 0
                        },
                        new
                        {
                            ID = new Guid("8a688175-7482-4d01-b5be-f701b6a34b20"),
                            Type = 1
                        },
                        new
                        {
                            ID = new Guid("90a7b31a-f52a-425e-910f-bee4dd2eb634"),
                            Type = 2
                        },
                        new
                        {
                            ID = new Guid("205da614-45da-4d86-8046-ab64eb9ffa1f"),
                            Type = 3
                        },
                        new
                        {
                            ID = new Guid("612d03cf-5b04-4ee4-8699-b3d88595c08c"),
                            Type = 4
                        },
                        new
                        {
                            ID = new Guid("71f1a1c7-3954-498f-ac25-f710d72b9f6c"),
                            Type = 5
                        },
                        new
                        {
                            ID = new Guid("a07bf21e-17d5-48c6-abf9-3154d8e4387a"),
                            Type = 6
                        },
                        new
                        {
                            ID = new Guid("ee5eb6bd-135c-4a02-b0ac-b9a1097ffd0a"),
                            Type = 7
                        },
                        new
                        {
                            ID = new Guid("64d3f6df-5597-4856-9627-e72aadd323e9"),
                            Type = 8
                        });
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.FundraiserView", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("FundraiserID")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ViewedByID")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("ViewedOn")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("ID");

                    b.HasIndex("FundraiserID");

                    b.HasIndex("ViewedByID");

                    b.ToTable("FundraiserViews", "Capstone");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.GlobalAdmin", b =>
                {
                    b.Property<Guid>("UserID")
                        .HasColumnType("uuid");

                    b.HasKey("UserID");

                    b.ToTable("GlobalAdmins", "Capstone");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.User", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("EmailAddress")
                        .IsRequired()
                        .HasMaxLength(48)
                        .HasColumnType("character varying(48)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(24)
                        .HasColumnType("character varying(24)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(24)
                        .HasColumnType("character varying(24)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.HasKey("ID");

                    b.ToTable("Users", "Capstone");

                    b.HasData(
                        new
                        {
                            ID = new Guid("93d9ad71-19eb-4a08-94aa-50f2123c1f52"),
                            EmailAddress = "anonymous@user.org",
                            FirstName = "Anonymous",
                            LastName = "User",
                            Password = "SuperSecretPassw0rd!"
                        });
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.Comment", b =>
                {
                    b.HasOne("capstone_api.Models.DatabaseEntities.Fundraiser", "Fundraiser")
                        .WithMany("Comments")
                        .HasForeignKey("FundraiserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("capstone_api.Models.DatabaseEntities.User", "User")
                        .WithMany("Comments")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Fundraiser");

                    b.Navigation("User");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.Donation", b =>
                {
                    b.HasOne("capstone_api.Models.DatabaseEntities.Fundraiser", "Fundraiser")
                        .WithMany("Donations")
                        .HasForeignKey("FundraiserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("capstone_api.Models.DatabaseEntities.User", "DonatedBy")
                        .WithMany("Donations")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DonatedBy");

                    b.Navigation("Fundraiser");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.Fundraiser", b =>
                {
                    b.HasOne("capstone_api.Models.DatabaseEntities.User", "CreatedByUser")
                        .WithMany("CreatedFundraisers")
                        .HasForeignKey("CreatedByUserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("capstone_api.Models.DatabaseEntities.FundraiserType", "Type")
                        .WithMany()
                        .HasForeignKey("TypeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CreatedByUser");

                    b.Navigation("Type");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.FundraiserAdmin", b =>
                {
                    b.HasOne("capstone_api.Models.DatabaseEntities.Fundraiser", "Fundraiser")
                        .WithMany("Admins")
                        .HasForeignKey("FundraiserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("capstone_api.Models.DatabaseEntities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Fundraiser");

                    b.Navigation("User");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.FundraiserView", b =>
                {
                    b.HasOne("capstone_api.Models.DatabaseEntities.Fundraiser", "ViewedFundraiser")
                        .WithMany("Views")
                        .HasForeignKey("FundraiserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("capstone_api.Models.DatabaseEntities.User", "ViewedByUser")
                        .WithMany("ViewedFundraisers")
                        .HasForeignKey("ViewedByID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ViewedByUser");

                    b.Navigation("ViewedFundraiser");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.GlobalAdmin", b =>
                {
                    b.HasOne("capstone_api.Models.DatabaseEntities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.Fundraiser", b =>
                {
                    b.Navigation("Admins");

                    b.Navigation("Comments");

                    b.Navigation("Donations");

                    b.Navigation("Views");
                });

            modelBuilder.Entity("capstone_api.Models.DatabaseEntities.User", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("CreatedFundraisers");

                    b.Navigation("Donations");

                    b.Navigation("ViewedFundraisers");
                });
#pragma warning restore 612, 618
        }
    }
}
