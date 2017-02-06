using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Data.Entity.Core.EntityClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;

namespace WN.ProductStore.Controllers
{
    public class ProductController : ApiController
    {
        DBContext db = new DBContext();
        // GET api/<controller>
        public IEnumerable<Product> GetProductList(int pageIndex, int pageSize, string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                return db.Product.Where(p => p.Name.Contains(name)).OrderBy(i => i.Id).Skip(pageIndex).Take(pageSize).ToList();
            }
            else
            {
                var products = db.Product.OrderBy(i => i.Id).Skip(pageIndex).Take(pageSize).ToList();
                return products;

            }
        }

        // GET api/<controller>/5
        public string GetProduct(int id)
        {
            return "value";
        }

        // PUT api/<controller>/5
        public void Add(Product product)
        {
            db.Product.Add(product);
            db.SaveChanges();
        }

        // DELETE api/<controller>/5
        public void DeleteProduct(int id)
        {
        }
    }
}