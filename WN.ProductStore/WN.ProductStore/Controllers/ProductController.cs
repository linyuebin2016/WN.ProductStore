using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
        ProductDal dal = new ProductDal();
        // GET api/<controller>
        public ProductListView GetProductList(int pageIndex, int pageSize, string queryString)
        {
            ProductListView list = new ProductListView();
            List<Product> products;
            
            if (!string.IsNullOrEmpty(queryString))
            {
                var query = db.Product.Where(p => p.Name.Contains(queryString)||p.ProductNo.Contains(queryString));
                products = query.OrderBy(i => i.Id).ToPage<Product>(pageIndex, pageSize).ToList();
                list.TotalCount = query.Count();
            }
            else
            {
                products = db.Product.OrderBy(i => i.Id).ToPage<Product>(pageIndex, pageSize).ToList();
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
        public ProductView GetProduct(Guid id)
        {
            var view = new ProductView();
            var images = db.ProductImage.Where(i => i.ProductId == id).ToList();
            view.Product = db.Product.FirstOrDefault(i => i.Id == id);
            view.ProductImages = images;
            return view;
        }

        // PUT api/<controller>/5
        //[HttpPost]
        //public void Add(Product product)
        //{
        //    product.Id = Guid.NewGuid();
        //    product.ProductNo = DateTime.Now.ToString("yyMMddss");
        //    db.Product.Add(product);
        //    db.SaveChanges();
        //}

        // PUT api/<controller>/5
        [HttpPost]
        public void Add(Product product)
        {
            product.Id = Guid.NewGuid();
            product.ProductNo = DateTime.Now.ToString("yyMMddss");
            db.Product.Add(product);
            if (product.ProductImages != null)
            {
                foreach (var item in product.ProductImages)
                {
                    var image = new ProductImage();
                    image.Url = item;
                    image.ProductId = product.Id;
                    db.ProductImage.Add(image);
                }
            }
   

            db.SaveChanges();
        }

        [HttpPost]
        public bool Update(Product product)
        {
            dal.Update(product);
            return true;
        }

        [HttpGet]
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