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
    public class AddressController : ApiController
    {
        DBContext db = new DBContext();
        AddressDal dal = new AddressDal();
        public List<Address> GetAddress(Guid customerId)
        {
            return db.Address.Where(i => i.CustomerId == customerId).ToList();
        }

        public bool SetDefaultAddress(Guid addressId)
        {
            var address = db.Address.Where(i => i.Id == addressId).FirstOrDefault();
    

            var addressList= db.Address.Where(i => i.CustomerId == address.CustomerId);

            foreach (Address item in addressList)
            {
                item.IsDefault = false;
                dal.Update(item);
            }

            address.IsDefault = true;
            dal.Update(address);
            return true;
        }

        public bool Add(Address address)
        {
            address.Id = Guid.NewGuid();
            dal.Add(address);
            return true;
        }

        public bool Delete(Guid id)
        {
            var model = dal.GetEntity(id);
            dal.Remove(model);
            return true;
        }
    }
}
