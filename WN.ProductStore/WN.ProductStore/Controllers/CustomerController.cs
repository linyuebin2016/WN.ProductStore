using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;

namespace WN.ProductStore.Controllers
{
    public class CustomerController : ApiController
    {
        DBContext db = new DBContext();
        public object GetCustomerList(int pageIndex, int pageSize, string queryString)
        {
            IQueryable<Customer> queryCustomer = db.Customer;
            if (!string.IsNullOrEmpty(queryString))
                queryCustomer = queryCustomer.Where(p => p.Name.Contains(queryString) || p.Phone.Contains(queryString));
            var reslut = new
            {
                TotalCount = queryCustomer.Count(),
                ProductStockList = queryCustomer.OrderBy(p => p.Name).ToPage<Customer>(pageIndex, pageSize)
            };
            return reslut;
        }

        public void AddCustomer(Customer customer)
        {
            customer.Id = Guid.NewGuid();
            db.Customer.Add(customer);
            db.SaveChanges();
        }

        public void DeleteCustomer(Guid id)
        {
          var   customer = db.Customer.FirstOrDefault(i => i.Id == id);
            db.Customer.Remove(customer);
        }

        public void Update(Customer customer)
        {
            db.Entry(customer).State = System.Data.Entity.EntityState.Modified;
            db.Customer.Attach(customer);
            db.SaveChanges();
        }
    }
}
