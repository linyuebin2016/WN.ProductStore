using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WN.ProductStore.Repository;

namespace WN.ProductStore.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            //var db = new DBContext();
            //var products = db.Product.ToList();
            return View();
        }
    }
}
