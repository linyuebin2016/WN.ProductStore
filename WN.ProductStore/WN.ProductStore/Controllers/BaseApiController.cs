using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WN.ProductStore.Repository;

namespace WN.ProductStore.Controllers
{
    public class BaseApiController : ApiController
    {
        public DBContext db = new DBContext();
    }
}
