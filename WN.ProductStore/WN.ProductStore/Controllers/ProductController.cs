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
using WN.ProductStore.ViewModel;

namespace WN.ProductStore.Controllers
{
    public class ProductController : ApiController
    {
        DBContext db = new DBContext();
        // GET api/<controller>
        public ProductListView GetProductList(int pageIndex, int pageSize, string name)
        {
            ProductListView list = new ProductListView();
            List<Product> products = new List<Product>();
            if (!string.IsNullOrEmpty(name))
            {
                products= db.Product.Where(p => p.Name.Contains(name)).OrderBy(i => i.Id).Skip(pageIndex).Take(pageSize).ToList();
                list.TotalCount = db.Product.Where(p => p.Name.Contains(name)).Count();
            }
            else
            {
                products = db.Product.OrderBy(i => i.Id).Skip(pageIndex).Take(pageSize).ToList();
                list.TotalCount = db.Product.Count();
            }

            list.Products = products;
      
            return list;
        }

        // GET api/<controller>/5
        public ProductView GetProduct(Guid id)
        {
            var view = new ProductView();
            var images = db.ProductImage.Where(i => i.ProductId == id).ToList();
            var product = db.Product.FirstOrDefault(i => i.Id == id);
            view.Product = product;
            view.ProductImage = images;
            return view;
        }

        // PUT api/<controller>/5
        public void Add(Product product)
        {
            db.Product.Add(product);
            db.SaveChanges();
        }

        public void Update(Product product)
        {
            db.Entry(product).State = System.Data.Entity.EntityState.Modified;
            db.Product.Attach(product);
            db.SaveChanges();
        }

        // DELETE api/<controller>/5
        public void Delete(Guid id)
        {
            var product = db.Product.FirstOrDefault(i => i.Id == id);
            db.Product.Remove(product);
            db.SaveChanges();
        }
    }
}