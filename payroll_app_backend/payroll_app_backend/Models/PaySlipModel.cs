namespace payroll_app_backend.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class PaySlipModel : DbContext
    {
        public PaySlipModel()
            : base("name=PaySlipModel")
        {
        }

        public virtual DbSet<PaySlip> PaySlips { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PaySlip>()
                .Property(e => e.FirstName)
                .IsUnicode(false);

            modelBuilder.Entity<PaySlip>()
                .Property(e => e.LastName)
                .IsUnicode(false);

            modelBuilder.Entity<PaySlip>()
                .Property(e => e.PayDate)
                .IsUnicode(false);

            modelBuilder.Entity<PaySlip>()
                .Property(e => e.PayFrequency)
                .IsUnicode(false);
        }
    }
}
