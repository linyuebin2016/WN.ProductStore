using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("Address")]
    public class Address:BaseEntiy
    {
        public Guid CustomerId { get; set; }
        public string AddressName { get; set; }
    }
}