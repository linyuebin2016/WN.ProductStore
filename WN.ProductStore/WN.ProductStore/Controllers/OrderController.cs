using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WN.ProductStore.Enums;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;
using WN.ProductStore.ViewModel;

namespace WN.ProductStore.Controllers
{
    public class OrderController : ApiController
    {
        DBContext db = new DBContext();
        CarDal carDal = new CarDal();
        [HttpGet]
        // GET: api/Order
        public object GetOrderList(int pageIndex, int pageSize, string queryString)
        {
            var query = from o in db.Order.OrderByDescending(o => o.CreateTime).ToPage(pageIndex, pageSize).ToList()
                        select new 
                        {
                            o.Id,
                            o.OrderNo,
                            o.Total,
                            o.OrderDetails,
                            o.CreateTime,
                            OrderState = o.OrderState.DisplayName()
                        };
          

            var Orders = query.ToList();

            var TotalCount = db.Order.Count();
            return new { Orders, TotalCount };
        }

        public object GetOrderListByState(int pageIndex, int pageSize, string queryString,OrderState orderState)
        {
            var query = from o in db.Order.Where(i=>i.OrderState== orderState)
                        .OrderByDescending(o => o.CreateTime).ToPage(pageIndex, pageSize).ToList()
                        select new
                        {
                            o.Id,
                            o.OrderNo,
                            o.Total,
                            o.OrderDetails,
                            o.CreateTime,
                            OrderState = o.OrderState.DisplayName()
                        };


            var Orders = query.ToList();

            var TotalCount = db.Order.Count();
            return new { Orders, TotalCount };

        }

        // GET: api/Order/5
        public Order GetOrderDetail(Guid id)
        {
            var Order = db.Order.FirstOrDefault(i => i.Id == id);
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
        [HttpGet]
        public void DeleteOrder(Guid id)
        {
           var order= db.Order.FirstOrDefault(i => i.Id == id);
            db.Order.Remove(order);
            db.SaveChanges();
        }

        /// <summary>
        /// 下订单
        /// </summary>
        /// <param name="order"></param>
        [HttpPost]
        public void AddOrder(Order order)
        {
            order.Id = Guid.NewGuid();
            order.CustomerId = db.Customer.FirstOrDefault().Id;
            order.OrderNo = DateTime.Now.ToString("yyMMddhhmmss");
            order.CreateTime = DateTime.Now;
            order.OrderState = OrderState.Obligation;
            order.Total = order.OrderDetails.Sum(i => i.Product.Price * i.Quantity);
            db.Order.Add(order);

            carDal.DeleteCars(order.OrderDetails.Select(i=>i.ProductId));


            db.SaveChanges();
        }
    }
}
