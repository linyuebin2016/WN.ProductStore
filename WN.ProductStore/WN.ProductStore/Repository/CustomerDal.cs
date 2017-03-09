using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WN.ProductStore.Models;

namespace WN.ProductStore.Repository
{
	public class CustomerDal:BaseDal<Customer>
	{
        public Customer GetCurrentCustomer()
        {
           return dbContext.Customer.FirstOrDefault();
        }
	}
}