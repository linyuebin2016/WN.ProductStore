using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WN.ProductStore.Models;

namespace WN.ProductStore.Repository
{
    public class DBContext : DbContext
    {
        public DBContext() : base("DefaultConnection") { }
  

        public DbSet<Product> Product { get; set; }
        public DbSet<ProductImage> ProductImage { get; set; }
        public DbSet<Order> Order { get; set; }

        public DbSet<Customer> Customer { get; set; }

    }
}