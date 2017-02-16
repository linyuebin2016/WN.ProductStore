using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WN.ProductStore.Repository;
using WN.ProductStore.ViewModel;

namespace WN.ProductStore.Controllers
{
    public class StockController : ApiController
    {
        DBContext db = new DBContext();
        // GET: api/Stock
        public StockListView GetStockList(int pageIndex,int pageSize)
        {
            var view = new StockListView();
            view.Stocks = db.Stock.OrderByDescending(s=>s.CreateTime).Skip(pageIndex).Take(pageSize).ToList();
            view.TotalCount = db.Stock.Count();
            return view;
        }

        //获取产品库存关系
        public object GetProductStockList()
        {
            var query = from p in db.Product
                        join s in db.Stock on p.Id equals s.ProductId
                        select new
                        {
                            Porduct=p,
                            Quantity = s.Quantity
                        };
            return new
            {
                TotalCount = query.Count(),
                ProductStockList = query
            };

        }

        // GET: api/Stock/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Stock
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Stock/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Stock/5
        public void Delete(int id)
        {
        }
    }
}
