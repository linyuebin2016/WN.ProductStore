﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Models
{
    public class User:BaseEntiy
    {
        public string Name { get; set; }
        public string Account { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}