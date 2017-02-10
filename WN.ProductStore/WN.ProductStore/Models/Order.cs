using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using WN.ProductStore.Enums;

namespace WN.ProductStore.Models
{
    [Table("Order")]
    public class Order:BaseEntiy
    {
        public Order()
        {
            this.CreateTime = new DateTime();
        }
        public DateTime CreateTime { get; set; }
        public decimal Total { get; set; }
        public OrderState OrderState { get; set; }
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }
    }
}