﻿using System;
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
        CustomerDal custDal = new CustomerDal();
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
            IQueryable<Order> dbOrder=db.Order;
            if (orderState == OrderState.All)
            {
                dbOrder = db.Order.Where(i => i.OrderState == orderState);
            }
            var query = from o in dbOrder
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


            var query = from o in order.OrderDetails
                    join p in db.Product on o.ProductId equals p.Id
                    select new
                    {
                        o.ProductId,
                        o.Quantity,
                        p.Price,

                    };
            order.Total = query.Sum(i => i.Price * i.Quantity);
            db.Order.Add(order);

            carDal.DeleteCars(order.OrderDetails.Select(i=>i.ProductId));


            db.SaveChanges();
        }

        /// <summary>
        /// 订单状态数量
        /// </summary>
        /// <returns></returns>
        public object GetOrderStateCount()
        {
            var customer = custDal.GetCurrentCustomer();
            var query = from o in db.Order.Where(i => i.CustomerId == customer.Id)
                        group o by o.OrderState into oo
                        
                        select new
                        {
                           OrderState= oo.FirstOrDefault().OrderState,
                           Count=  oo.Count(),
                        };
            return query.ToList();
        }
    }
}
