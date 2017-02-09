using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("OrderDetail")]
    public class OrderDetail:BaseEntiy
    {
        public Guid ProductId { get; set; }
    }
}