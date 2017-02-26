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
    }
}
