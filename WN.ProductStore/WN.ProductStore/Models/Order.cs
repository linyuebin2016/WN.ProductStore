using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using WN.ProductStore.Enums;

namespace WN.ProductStore.Models
{
    [Table("Order")]
    public class Order:BaseEntity
    {
        public Order()
        {
            this.CreateTime = new DateTime();
        }
        /// <summary>
        /// 订单编号
        /// </summary>
        [MaxLength(50)]
        public string OrderNo { get; set; }
        public DateTime CreateTime { get; set; }
        public decimal Total { get; set; }
        /// <summary>
        /// 订单状态
        /// </summary>
        public OrderState OrderState { get; set; }
        public Guid CustomerId { get; set; }

        /// <summary>
        /// 快递单号
        /// </summary>
        public string ExpressNumber { get; set; }
        public virtual Customer Customer { get; set; }

        public virtual List<OrderDetail> OrderDetails { get; set; }
    }
}