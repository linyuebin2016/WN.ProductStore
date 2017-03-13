using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("Address")]
    public class Address:BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string AddressName { get; set; }
        /// <summary>
        /// 默认
        /// </summary>
        public bool IsDefault { get; set; }
    }
}