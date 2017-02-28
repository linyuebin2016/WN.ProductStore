using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("OrderDetail")]
    public class OrderDetail:BaseEntity
    {
        public Guid ProductId { get; set; }
        /// <summary>
        /// 数量
        /// </summary>
        public int Quantity { get; set; }
        public Guid OrderId { get; set; }

    }
}