using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using WebGrease;

namespace WN.ProductStore.Controllers
{
    public class ImageController : ApiController
    {
        
        /// <summary>
        /// 图片上传  [FromBody]string token
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        //[Route("api/Upload/ImgUpload")]
        public Task<Hashtable> ImgUpload1()
        {
            // 检查是否是 multipart/form-data 
            if (!Request.Content.IsMimeMultipartContent("form-data"))
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            // 文件保存目录路径 
            const string saveTempPath = "~/UploadFiles/";
            var dirTempPath = HttpContext.Current.Server.MapPath(saveTempPath);

            // 设置上传目录 
            var provider = new MultipartFormDataStreamProvider(dirTempPath);

            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<Hashtable>(o =>
                {
                    var hash = new Hashtable();
                    var file = provider.FileData[0];
                    // 最大文件大小
                    const int maxSize = 10000000;
                    // 定义允许上传的文件扩展名 
                    const string fileTypes = "gif,jpg,jpeg,png,bmp";

                    // token验证
                    var token = string.Empty;
                    try
                    {
                        token = provider.FormData["token"].ToString();
                    }
                    catch (Exception exception)
                    {
                        throw new Exception("未附带token，非法访问!", exception);
                    }

                    if (!string.IsNullOrEmpty(token))
                    {
                        //if (!CacheManager.TokenIsExist(token))
                        //{
                        //    throw new UserLoginException("Token已失效，请重新登陆!");
                        //}
                        //if (accountInfoService.Exist_User_IsForzen(AccountHelper.GetUUID(token)))
                        //{
                        //    CacheManager.RemoveToken(token);
                        //    tempCacheService.Delete_OneTempCaches(new Guid(token));
                        //    throw new UserLoginException("此用户已被冻结,请联系管理员（客服）!");
                        //}
                    }
                    else
                    {
                        throw new Exception("token为空，非法访问!");
                    }

                    string orfilename = file.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                    var fileinfo = new FileInfo(file.LocalFileName);
                    if (fileinfo.Length <= 0)
                    {
                        hash["Code"] = -1;
                        hash["Message"] = "请选择上传文件。";
                    }
                    else if (fileinfo.Length > maxSize)
                    {
                        hash["Code"] = -1;
                        hash["Message"] = "上传文件大小超过限制。";
                    }
                    else
                    {
                        var fileExt = orfilename.Substring(orfilename.LastIndexOf('.'));

                        if (String.IsNullOrEmpty(fileExt) ||
                            Array.IndexOf(fileTypes.Split(','), fileExt.Substring(1).ToLower()) == -1)
                        {
                            hash["Code"] = -1;
                            hash["Message"] = "不支持上传文件类型。";
                        }
                        else
                        {
                            try
                            {
                                //AttachmentFileResultDTO attachmentFileResult;
                                //attachmentFileService.UploadAttachmentFile(fileinfo, dirTempPath, fileExt,
                                //    Path.GetFileNameWithoutExtension(file.LocalFileName), out attachmentFileResult);

                                hash["Code"] = 0;
                                hash["Message"] = "上传成功";
                                //hash["FileId"] = attachmentFileResult.ID;
                                //hash["FileName"] = attachmentFileResult.FileName + attachmentFileResult.FileType;
                                //hash["NetImageUrl"] = attachmentFileResult.FileUrl;
                            }
                            catch (Exception exception)
                            {
                                throw new Exception("上传失败!", exception);
                            }
                        }
                    }
                    return hash;
                });
            return task;
        }

        [HttpPost]
        public Task<Hashtable> ImgUpload()
        {
            // 检查是否是 multipart/form-data
            if (!Request.Content.IsMimeMultipartContent("form-data"))
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            //文件保存目录路径
            string monthpath = DateTime.Now.ToString("yyyyMM")+"/";
            string SaveTempPath = "~/UpLoadFiles/ProductImgs/"+ monthpath;
                 
            if (!Directory.Exists(HttpContext.Current.Server.MapPath(SaveTempPath)))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath(SaveTempPath));
            }
            String dirTempPath = HttpContext.Current.Server.MapPath(SaveTempPath);
            // 设置上传目录
            var provider = new MultipartFormDataStreamProvider(dirTempPath);
            //var queryp = Request.GetQueryNameValuePairs();//获得查询字符串的键值集合
            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<Hashtable>(o =>
                {
                    Hashtable hash = new Hashtable();
                    hash["error"] = 1;
                    hash["errmsg"] = "上传出错";
                    var file = provider.FileData[0];//provider.FormData
                    string orfilename = file.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                    FileInfo fileinfo = new FileInfo(file.LocalFileName);
                    //最大文件大小
                    int maxSize = 10000000;
                    if (fileinfo.Length <= 0)
                    {
                        hash["error"] = 1;
                        hash["errmsg"] = "请选择上传文件。";
                    }
                    else if (fileinfo.Length > maxSize)
                    {
                        hash["error"] = 1;
                        hash["errmsg"] = "上传文件大小超过限制。";
                    }
                    else
                    {
                        string fileExt = orfilename.Substring(orfilename.LastIndexOf('.'));
                        //定义允许上传的文件扩展名
                        String fileTypes = "gif,jpg,jpeg,png,bmp,ico";
                        if (String.IsNullOrEmpty(fileExt) || Array.IndexOf(fileTypes.Split(','), fileExt.Substring(1).ToLower()) == -1)
                        {
                            hash["error"] = 1;
                            hash["errmsg"] = "上传文件扩展名是不允许的扩展名。";
                        }
                        else
                        {
                            String ymd = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            String newFileName = DateTime.Now.ToString("yyyyMMddHHmmss_ffff", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            fileinfo.CopyTo(Path.Combine(dirTempPath, newFileName + fileExt), true);
                            fileinfo.Delete();
                            hash["error"] = 0;
                            hash["errmsg"] = "上传成功";
                            var _SaveTempPath = SaveTempPath.Replace('~',' ');
                            hash["imgUrl"] = _SaveTempPath + newFileName + fileExt;
                        }
                    }
                    return hash;
                });
            return task;
        }

        public void DeleteImage(List<string> images)
        {
            
        }

        public Task<HttpResponseMessage> PostFormData()
        {
            // Check if the request contains multipart/form-data.
            // 检查该请求是否含有multipart/form-data
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/userImage");
            var provider = new MultipartFormDataStreamProvider(root);

            // Read the form data and return an async task.
            // 读取表单数据，并返回一个async任务
            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<HttpResponseMessage>(t =>
                {
                    if (t.IsFaulted || t.IsCanceled)
                    {
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                    }

                    // This illustrates how to get the file names.
                    // 以下描述了如何获取文件名
                    foreach (MultipartFileData file in provider.FileData)
                    {
                        //新文件夹路径
                        string newRoot = root + "\\" + provider.FormData.GetValues(1)[0].ToString();
                        if (!Directory.Exists(newRoot))
                        {
                            Directory.CreateDirectory(newRoot);
                        }
                        Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                        Trace.WriteLine("Server file path: " + file.LocalFileName);
                        if (File.Exists(file.LocalFileName))
                        {
                            //原文件名称
                            string fileName = file.Headers.ContentDisposition.FileName.Substring(1, file.Headers.ContentDisposition.FileName.Length - 2);
                            //新文件名称   随机数
                            string newFileName = provider.FormData.GetValues(0)[0] + "." + fileName.Split(new char[] { '.' })[1];
                            File.Move(file.LocalFileName, newRoot + "\\" + newFileName);
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.OK);
                });

            return task;
        }
    }
}
