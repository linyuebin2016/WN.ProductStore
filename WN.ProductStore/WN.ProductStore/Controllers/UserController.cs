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
    public class UserController : ApiController
    {
        DBContext db = new DBContext();
        public object GetCustomerList(int pageIndex, int pageSize, string queryString)
        {
            IQueryable<User> queryCustomer = db.User;
            if (!string.IsNullOrEmpty(queryString))
                queryCustomer = queryCustomer.Where(p => p.Name.Contains(queryString) || p.Phone.Contains(queryString));
            var reslut = new
            {
                TotalCount = queryCustomer.Count(),
                List = queryCustomer.OrderBy(p => p.Name).ToPage<User>(pageIndex, pageSize)
            };
            return reslut;
        }
        [HttpPost]
        public void AddCustomer(User user)
        {
            user.Id = Guid.NewGuid();
            db.User.Add(user);
            db.SaveChanges();
        }

        public void DeleteCustomer(Guid id)
        {
            var customer = db.User.FirstOrDefault(i => i.Id == id);
            db.User.Remove(customer);
        }

        public void Update(User user)
        {
            db.Entry(user).State = System.Data.Entity.EntityState.Modified;
            db.User.Attach(user);
            db.SaveChanges();
        }
    }
}
