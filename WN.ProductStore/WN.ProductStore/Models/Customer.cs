using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("Customer")]
    public class Customer:BaseEntity
    {
        [MaxLength(120)]
        public string Name { get; set; }
        [MaxLength(20)]
        public string Phone { get; set; }

        [MaxLength(120)]
        public string Account { get; set; }
        [MaxLength(120)]
        public string Password { get; set; }
    }
}