using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WN.ProductStore
{
    public static class Page
    {
        public static IQueryable<T> ToPage<T>(this IQueryable<T> list,int pageIndex,int pageSize)
        {
            int startRow = (pageIndex - 1) * pageSize;
            return list.Skip(startRow).Take(pageSize);
        }
    }
}