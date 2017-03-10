using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WN.ProductStore.Models;

namespace WN.ProductStore.Repository
{
    public class CarDal:BaseDal<Car>
    {
        public Car GetCar(Guid productId)
        {
          return  dbContext.Car.FirstOrDefault(i => i.ProductId == productId);
        }

        public void DeleteCars(IEnumerable<Guid> productIds)
        {
            foreach (var productId in productIds)
            {
                var car = GetCar(productId);
                this.Remove(car);

            }
        
        }
    }
}