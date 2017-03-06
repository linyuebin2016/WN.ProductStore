using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;

namespace WN.ProductStore.Controllers
{
    public class HomeController : Controller
    {
        ProductController p = new ProductController();
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            //var db = new DBContext();
            //var products = db.Product.ToList();

           
            var list= p.GetProductList(1, 10, "");
            return View();
        }

        public void AddProduct()
        {
            //Models.Product model = new Models.Product();
            //model.Introduction = "11111";
            //model.Name = "computer";
            //model.Price = 123;

            //List<ProductImage> listImg = new List<ProductImage>();

            //ProductImage img = new ProductImage();
            //img.Url = "111111";
            //listImg.Add(img);
            ////model.ProductImages = listImg;
            //p.Add(model);
        }
    }
}
