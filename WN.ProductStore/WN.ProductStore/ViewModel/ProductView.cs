using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WN.ProductStore.Models;

namespace WN.ProductStore.ViewModel
{
    public class ProductView
    {
        public Product Product { get; set; }
        public List<ProductImage> ProductImage { get; set; }
    }
}