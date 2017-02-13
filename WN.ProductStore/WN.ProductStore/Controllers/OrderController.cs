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
        public OrderListView GetOrderList(int pageIndex, int pageSize)
        {
            OrderListView view = new OrderListView();
            view.Orders = db.Order.OrderByDescending(o=>o.CreateTime).Skip(pageIndex).Take(pageSize).ToList();
            view.TotalCount = db.Order.Count();
            return view;
        }

        // GET: api/Order/5
        public Order GetOrderDetail(Guid id)
        {
            var Order= db.Order.FirstOrDefault(i => i.Id == id);
            return Order;
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

        /// <summary>
        /// 下订单
        /// </summary>
        /// <param name="order"></param>
        public void PlaceOrder(Order order)
        {
            db.Order.Add(order);
            db.SaveChanges();
        }
    }
}
