using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WN.ProductStore.Models;

namespace WN.ProductStore.ViewModel
{
    public class ProductListView
    {
        public List<Product> Products { get; set; }
        public int TotalCount { get; set; }
    }
}