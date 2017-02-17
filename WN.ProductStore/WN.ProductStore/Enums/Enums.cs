using System;
using System.Collections.Generic;
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
        Obligation,
        /// <summary>
        /// 待发货
        /// </summary>
        Delivery,
        /// <summary>
        /// 待收货
        /// </summary>
        Receiving,
        /// <summary>
        /// 待评价
        /// </summary>
        Pending,
        /// <summary>
        /// 退款/售后
        /// </summary>
        CustomerService
    }
}