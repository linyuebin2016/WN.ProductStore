using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WN.ProductStore.Models;

namespace WN.ProductStore.ViewModel
{
    public class StockListView
    {
        public List<Stock> Stocks { get; set; }
        public int TotalCount { get; set; }
    }
}