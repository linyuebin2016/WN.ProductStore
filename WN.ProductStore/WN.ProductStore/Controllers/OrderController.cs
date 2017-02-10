using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;
using WN.ProductStore.ViewModel;

namespace WN.ProductStore.Controllers
{
    public class OrderController : ApiController
    {
        DBContext db = new DBContext();
        // GET: api/Order
        public OrderView GetOrderList(int pageIndex, int pageSize)
        {
            OrderView view = new OrderView();
            view.Orders = db.Order.OrderByDescending(o=>o.CreateTime).Skip(pageIndex).Take(pageSize).ToList();
            return view;
        }

        // GET: api/Order/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Order
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Order/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Order/5
        public void Delete(int id)
        {
        }
    }
}
