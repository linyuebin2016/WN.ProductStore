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
        public DbSet<Stock> Stock { get; set; }
        public DbSet<StockHistroy> StockHistroy { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<OrderDetail> OrderDetail { get; set; }
        public DbSet<Car> Car { get; set; }
        public DbSet<Address> Address { get; set; }

    }
}