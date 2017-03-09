
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using WN.ProductStore.Models;
using WN.ProductStore.Repository;

namespace WN.ProductStore.Repository
{
    public abstract class BaseDal<T> where T : BaseEntity
    {
        public DBContext dbContext;
        public BaseDal()
        {
            dbContext = new DBContext();
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="entity">实体</param>
        public void Add(T entity)
        {
            var query = dbContext.Set<T>().Add(entity);
            dbContext.SaveChanges();
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="entity"></param>
        public void Update(T entity)
        {
            dbContext.Set<T>().Attach(entity);
            dbContext.Entry(entity).State = EntityState.Modified;
            dbContext.SaveChanges();
        }

        public void Save(T entity)
        {
            if (entity.Id == Guid.Empty)
            {
                entity.Id = Guid.NewGuid();
                this.Add(entity);
            }
            else
            {
                this.Update(entity);
            }
        }
 

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="entity"></param>
        public void Remove(T entity)
        {
            dbContext.Set<T>().Remove(entity);
            dbContext.SaveChanges();
        }

        /// <summary>
        /// 获取实体
        /// </summary>
        /// <param name="id"></param>
        public T GetEntity(Guid id)
        {
            var model = dbContext.Set<T>().Find(id);
            return model;
        }

        public List<T> ToList()
        {
            return dbContext.Set<T>().ToList();
        }
    }
}
