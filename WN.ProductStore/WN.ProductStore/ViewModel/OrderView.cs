using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WN.ProductStore.Models;

namespace WN.ProductStore.ViewModel
{
    public class OrderView
    {
        public Order Order { get; set; }
        public OrderDetail OrderDetail { get; set; }
    }
}