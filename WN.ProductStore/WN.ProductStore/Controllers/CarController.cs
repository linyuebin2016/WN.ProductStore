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
        CarDal db = new CarDal();
        CustomerDal customerDb = new CustomerDal();
        [HttpPost]
        public bool Add(Car car)
        {
            car.Id = Guid.NewGuid();
            car.CustomerId = customerDb.GetCurrentCustomer().Id;
            var isEdit = db.dbContext.Car.FirstOrDefault(i => i.ProductId == car.ProductId && i.CustomerId == car.CustomerId);
            if (isEdit!=null)
            {
                isEdit.Quantity++;
                db.Save(isEdit);
            }
            else
            {
                db.Add(car);
            }
            
            return true;
        }

        [HttpGet]
        public bool Delete(Guid id)
        {
            var car = db.GetEntity(id);
            db.Remove(car);
            return true;
        }

        [HttpGet]
        public object GetCarList(int pageIndex, int pageSize, string queryString)
        {
            IQueryable<Car> queryCustomer = db.dbContext.Car;
            if (!string.IsNullOrEmpty(queryString))
                queryCustomer = queryCustomer.Where(p => p.Product.Name.Contains(queryString) || p.Product.ProductNo.Contains(queryString));
            var reslut = new
            {
                TotalCount = queryCustomer.Count(),
                List = queryCustomer.OrderByDescending(p => p.CreateTime).ToPage<Car>(pageIndex, pageSize).ToList()
            };
            return reslut;
        }
    }
}
