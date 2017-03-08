using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("Car")]
    public class Car:BaseEntity
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
          
        public Guid CustomerId { get; set; }
        public DateTime CreateTime { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual Product Product { get; set; }

        public Car()
        {
            this.CreateTime = DateTime.Now;
        }
    }
}