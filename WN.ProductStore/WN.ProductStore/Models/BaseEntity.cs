﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WN.ProductStore.Models
{

    public class BaseEntity
    {
        [Key]
        public Guid Id { get; set; }

    }
}