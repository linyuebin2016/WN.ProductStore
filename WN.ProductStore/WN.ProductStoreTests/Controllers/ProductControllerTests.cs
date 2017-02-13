using Microsoft.VisualStudio.TestTools.UnitTesting;
using WN.ProductStore.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WN.ProductStore.Controllers.Tests
{
    [TestClass()]
    public class ProductControllerTests
    {
        [TestMethod()]
        public void GetTest()
        {
            ProductController p = new ProductController();
            var reslut = p.GetProductList(0, 1, null);

        }

        [TestMethod()]
        public void GetProductTest()
        {
            ProductController p = new ProductController();
            var product = p.GetProductList(0, 1, null);
            var reslut = p.GetProduct(product.FirstOrDefault().Id);
        }
    }
}