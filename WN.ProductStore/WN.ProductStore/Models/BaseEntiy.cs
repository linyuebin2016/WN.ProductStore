﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    public class BaseEntiy
    {
        [Key]
        public Guid Id { get; set; }

    }
}