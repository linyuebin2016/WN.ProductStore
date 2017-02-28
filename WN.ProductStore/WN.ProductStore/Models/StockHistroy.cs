using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WN.ProductStore.Enums;

namespace WN.ProductStore.Models
{
    /// <summary>
    /// 库存历史记录
    /// </summary>
    public class StockHistroy:BaseEntity
    {
        public StockHistroy()
        {
            this.CreateTime = DateTime.Now;
        }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public StockState StockState { get; set; }
        public DateTime CreateTime { get; set; }

        public virtual Product Product { get; set; }
    }
}