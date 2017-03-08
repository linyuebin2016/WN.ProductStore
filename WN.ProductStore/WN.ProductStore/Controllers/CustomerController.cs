using System;
using System.Collections.Generic;
using System.Data.Entity;
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
        [HttpGet]
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
        [HttpPost]
        public void AddCustomer(Customer customer)
        {
            customer.Id = Guid.NewGuid();
 
            db.Customer.Add(customer);
            db.SaveChanges();
        }

        //[HttpDelete]
        [HttpGet]
        public void DeleteCustomer(string id)
        {
          var   customer = db.Customer.FirstOrDefault(i => i.Id.ToString() == id);
            db.Customer.Remove(customer);
            db.SaveChanges();
        }

        [HttpPost]
        public void Update(Customer customer)
        {
            //db.Entry(customer).State = System.Data.Entity.EntityState.Modified;
            //db.Customer.Attach(customer);
            //db.SaveChanges();

            db.Set<Customer>().Attach(customer);
            db.Entry(customer).State = EntityState.Modified;
            db.SaveChanges();
        }

        [HttpGet]
        public Customer GetCustomer(Guid id)
        {
           return db.Customer.FirstOrDefault(i => i.Id == id);

        }

        /// <summary>
        /// 获取当前登录客户
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public Customer GetCurrentCustomer()
        {
            return db.Customer.FirstOrDefault();
        }

        public bool Login(string account,string password)
        {
           var customer= db.Customer.FirstOrDefault(i => i.Account == account && i.Password == password);
            if (customer != null)
            {
                
                return true;
            }else
            {
                return false;
            }
        }
    }
}
