using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    [Table("Product")]
    public class Product
    {
        [Key]
        public Guid Id { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }
        /// <summary>
        /// 价格
        /// </summary>
        public decimal Price { get; set; }
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        [MaxLength(200)]
        public string Remark { get; set; }

        public Product()
        {
            this.CreateTime = DateTime.Now;
        }

        [MaxLength(50)]
        public string Color { get; set; }

    }
}