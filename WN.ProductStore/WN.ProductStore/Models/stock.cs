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
        public Stock()
        {
            this.CreateTime = DateTime.Now;
        }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public DateTime CreateTime { get; set; }
    }
}