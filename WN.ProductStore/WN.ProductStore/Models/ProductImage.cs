using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WN.ProductStore.Models
{

    [Table("ProductImage")]
    public class ProductImage:BaseEntiy
    {
        public string Url { get; set; }
        public Guid ProductId { get; set; }

        public Product Product { get; set; }

    }
}