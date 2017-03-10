using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace WN.ProductStore.Enums
{
    /// <summary>
    /// 订单状态
    /// </summary>
    public enum OrderState
    {
        /// <summary>
        /// 待付款
        /// </summary>
        [Description("待付款")]
        Obligation,
        /// <summary>
        /// 待发货
        /// </summary>
        [Description("待发货")]
        Delivery,
        /// <summary>
        /// 待收货
        /// </summary>
        [Description("待收货")]
        Receiving,
        /// <summary>
        /// 待评价
        /// </summary>
        [Description("待评价")]
        Pending,
        /// <summary>
        /// 退款/售后
        /// </summary>
        [Description("退款/售后")]
        CustomerService
    }

    public enum StockState
    {
        /// <summary>
        /// 入库
        /// </summary>
        In,
        /// <summary>
        /// 出库
        /// </summary>
        Out
    }

    //public static object GetEnumsSource()
    //{
    //    Type enumType = typeof(CostEnum); // 获取类型对象  
    //    var enumFields = enumType.GetFields();    //获取字段信息对象集合  
    //    List<object> list = new List<object>();
    //    foreach (FieldInfo field in enumFields)
    //    {
    //        var e1 = new ee()
    //        {
    //            Name = field.Name,
    //            Value = (int)field.GetRawConstantValue()
    //        };
    //        list.Add(e1); ;
    //        ;
    //    }
    //    return list;
    //}


}