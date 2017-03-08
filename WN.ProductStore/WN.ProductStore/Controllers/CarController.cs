using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;

namespace WN.ProductStore.Controllers
{
    public class CarController : ApiController
    {
        public bool Add(Car car)
        {
            CarDal dal = new CarDal();
            dal.Save(car);
            return true;
        }
    }
}
