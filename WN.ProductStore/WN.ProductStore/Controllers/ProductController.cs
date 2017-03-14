﻿using System;
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
        public object GetProductList(int pageIndex, int pageSize, string queryString)
        {
            var TotalCount = 0;
 
            var queryOrderDetail = from o in db.OrderDetail
                                   group o by o.ProductId into oo
                                   select new
                                   {
                                       ProductId = oo.Key,
                                       SaleValue = oo.Sum(i => i.Quantity)

                                   };

            var queryList = from p in db.Product
                            join qo in queryOrderDetail on p.Id equals qo.ProductId into pp
                            from ppp in pp.DefaultIfEmpty()
                            select new
                            {
                                //SaleValue = pp.FirstOrDefault() != null ? pp.FirstOrDefault().SaleValue : 0,
                                ppp.SaleValue,
                                Content = p.Content,
                                CreateTime = p.CreateTime,
                                ImageUrl = p.ImageUrl,
                                Introduction = p.Introduction,
                                Name = p.Name,
                                OriginalPrice = p.OriginalPrice,
                                Price = p.Price,
                                //ProductImages = p.ProductImages,
                                ProductNo = p.ProductNo,
                                Size = p.Size,
                            };

            if (!string.IsNullOrEmpty(queryString))
            {
                queryList = queryList.Where(p => p.Name.Contains(queryString) || p.ProductNo.Contains(queryString));
                TotalCount = queryList.Count();
            }
            else
            {
                TotalCount = db.Product.Count();
            }
            int startRow = (pageIndex - 1) * pageSize;

            var products = queryList.OrderByDescending(i => i.CreateTime).Skip(startRow).Take(pageSize).ToList();

            var result = new
            {
                Products = products,
                TotalCount = TotalCount
            };
            return result;
        }

        /// <summary>
        /// 获取产品
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public object GetProduct(Guid id)
        {
            //var view = new ProductView();
            var images = db.ProductImage.Where(i => i.ProductId == id).ToList();
            var result = new
            {
                Product = db.Product.FirstOrDefault(i => i.Id == id),
                ProductImages = images
            };

            return result;
        }

 

        // PUT api/<controller>/5
        [HttpPost]
        public void Add(Product product)
        {
            product.Id = Guid.NewGuid();
            product.ProductNo = DateTime.Now.ToString("yyMMddss");
            db.Product.Add(product);
            //if (product.ProductImages != null)
            //{
            //    foreach (var item in product.ProductImages)
            //    {
            //        var image = new ProductImage();
            //        image.Url = item.Url;
            //        image.ProductId = product.Id;
            //        db.ProductImage.Add(image);
            //    }
            //}


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
                String dirTempPath = HttpContext.Current.Server.MapPath("~" + image.Url);
                File.Delete(dirTempPath);
                db.ProductImage.Remove(image);
            }
            db.SaveChanges();
        }
    }
}