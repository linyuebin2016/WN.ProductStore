﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WN.ProductStore.Models
{
    //[Serializable]
    [Table("Product")]
    public class Product : BaseEntity
    {
        public Product()
        {
            this.CreateTime = DateTime.Now;
        }
        /// <summary>
        /// 名称
        /// </summary>
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }
        /// <summary>
        /// 产品编号
        /// </summary>
        [MaxLength(30)]
        public string ProductNo { get; set; }

        /// <summary>
        /// 价格(现价)
        /// </summary>
        public decimal Price { get; set; }
        /// <summary>
        /// 原价
        /// </summary>
        public decimal OriginalPrice { get; set; }

        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 介绍
        /// </summary>
        [MaxLength(200)]
        public string Introduction { get; set; }

        [MaxLength(50)]
        public string Color { get; set; }
        [MaxLength(20)]
        public string Size { get; set; }

        //public virtual List<ProductImage> ProductImages { get; set; }
        /// <summary>
        /// 产品内容
        /// </summary>
        public string Content { get; set; }

        [MaxLength(250)]
        public string ImageUrl { get; set; }

        /// <summary>
        /// 销量
        /// </summary>
        //public int SaleVale{get;set;}
    }
}