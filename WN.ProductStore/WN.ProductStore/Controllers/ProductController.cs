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
            int startRow = (pageIndex - 1) * pageSize;
            if (!string.IsNullOrEmpty(name))
            {
                products= db.Product.Where(p => p.Name.Contains(name)).OrderBy(i => i.Id).Skip(startRow).Take(pageSize).ToList();
                list.TotalCount = db.Product.Where(p => p.Name.Contains(name)).Count();
            }
            else
            {
                products = db.Product.OrderBy(i => i.Id).Skip(startRow).Take(pageSize).ToList();
                list.TotalCount = db.Product.Count();
            }

            list.Products = products;
      
            return list;
        }

        /// <summary>
        /// 获取产品
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public Product GetProduct(Guid id)
        {
            //var view = new ProductView();
            //var images = db.ProductImage.Where(i => i.ProductId == id).ToList();
            var product = db.Product.FirstOrDefault(i => i.Id == id);
            //view.Product = product;
            //view.ProductImage = images;
            return product;
        }

        // PUT api/<controller>/5
        [HttpPost]
        public void Add(Product product)
        {
            product.Id = Guid.NewGuid();
            product.ProductNo = DateTime.Now.ToString("yyMMddss");
            db.Product.Add(product);
            db.SaveChanges();
        }

        [HttpPost]
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

        public void DeleteProductImage(Guid[] imageIds)
        {
            foreach (var item in imageIds)
            {
                var image = db.ProductImage.FirstOrDefault(i => i.Id == item);
                String dirTempPath = HttpContext.Current.Server.MapPath("~"+ image.Url);
                File.Delete(dirTempPath);
                db.ProductImage.Remove(image);
            }
            db.SaveChanges();
        }
    }
}