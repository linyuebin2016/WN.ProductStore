﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;

using System.Web.Http.Cors;


namespace WN.ProductStore
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务
            // 将 Web API 配置为仅使用不记名令牌身份验证。
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            //跨域配置
            config.EnableCors(new EnableCorsAttribute("*", "*", "*"));

            // Web API 路由
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            //config.EnableSystemDiagnosticsTracing();
            //config.Formatters.JsonFormatter.SerializerSettings preserveReferencesHandling = preserveReferencesHandling.None;
            //config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            //config.Formatters.JsonFormatter.SerializerSettings.Formatting = Formatting.Indented;
            //config.Formatters.Remove(config.Formatters.XmlFormatter);

        }
    }
}
