using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web;

namespace WN.ProductStore
{
    public static class EnumsExtend
    {
        ///获取描述信息方法
        public static string DisplayName(this Enum Enumtype)
        {
            if (Enumtype == null) throw new ArgumentNullException("Enumtype");
            if (!Enumtype.GetType().IsEnum) throw new Exception("参数类型不正确");

            FieldInfo[] fieldinfo = Enumtype.GetType().GetFields();
            foreach (FieldInfo item in fieldinfo)
            {
                Object[] obj = item.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (obj != null && obj.Length != 0)
                {
                    DescriptionAttribute des = (DescriptionAttribute)obj[0];

                    return des.Description;
                }
            }
            return string.Empty;
        }
    }
}