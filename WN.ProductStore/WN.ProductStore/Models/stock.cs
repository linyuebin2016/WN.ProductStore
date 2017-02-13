using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("Stock")]
    public class Stock:BaseEntiy
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}