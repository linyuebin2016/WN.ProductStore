using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WN.ProductStore.Models
{

    [Table("ProductImage")]
    public class ProductImage:BaseEntity
    {
        public ProductImage()
        {
            this.Id = Guid.NewGuid();
        }
        [MaxLength(250)]
        public string Url { get; set; }
        public Guid ProductId { get; set; }
        public virtual Product Product { get; set; }
    }
}