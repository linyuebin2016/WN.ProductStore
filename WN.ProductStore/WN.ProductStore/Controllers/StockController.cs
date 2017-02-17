using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;
using WN.ProductStore.ViewModel;

namespace WN.ProductStore.Controllers
{
    public class StockController : ApiController
    {
        DBContext db = new DBContext();
        // GET: api/Stock
        [HttpPost]
        public StockListView GetStockList(int pageIndex, int pageSize)
        {
            var view = new StockListView();
            view.Stocks = db.Stock.OrderByDescending(s => s.CreateTime).Skip(pageIndex).Take(pageSize).ToList();
            view.TotalCount = db.Stock.Count();
            return view;
        }

        //获取产品库存关系
        [HttpGet]
        public object GetProductStockList(string queryString)
        {
            IQueryable<Product> queryProduct = db.Product;
            if (!string.IsNullOrEmpty(queryString))
                queryProduct = queryProduct.Where(p => p.Name.Contains(queryString) || p.ProductNo.Contains(queryString));
            var query = from p in queryProduct
                        join s in db.Stock on p.Id equals s.ProductId into tempS
                        from tt in tempS.DefaultIfEmpty()
                        select new
                        {
                            Product = p,
                            Quantity = tt == null ? 0 : tt.Quantity,
                            StockId = tt == null ? Guid.Empty : tt.Id
                        };

            var reslut = new
            {
                TotalCount = query.Count(),
                ProductStockList = query.ToList()
            };
            return reslut;

        }

        [HttpGet]
        public void SaveStock(Guid productId, int quantity, Guid StockId)
        {
            var stock = new Stock();


            if (StockId == Guid.Empty)
            {
                stock.Id = Guid.NewGuid();
                stock.ProductId = productId;
                stock.Quantity = quantity;
                db.Stock.Add(stock);
            }
            else
            {
                var newStock = db.Stock.First(i => i.Id == StockId);
                newStock.Quantity = newStock.Quantity + quantity;
                db.Entry(newStock).State = System.Data.Entity.EntityState.Modified;
            }
            db.SaveChanges();
        }
    }
}
