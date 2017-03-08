
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
        public DBContext db;
        public BaseDal()
        {
            db = new DBContext();
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="entity">实体</param>
        protected void Add(T entity)
        {
            var query = db.Set<T>().Add(entity);
            db.SaveChanges();
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="entity"></param>
        public void Update(T entity)
        {
            db.Set<T>().Attach(entity);
            db.Entry(entity).State = EntityState.Modified;
            db.SaveChanges();
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
            db.Set<T>().Remove(entity);
            db.SaveChanges();
        }

        /// <summary>
        /// 获取实体
        /// </summary>
        /// <param name="id"></param>
        public T GetEntity(Guid id)
        {
            var model = db.Set<T>().Find(id);
            return model;
        }

        public List<T> ToList()
        {
            return db.Set<T>().ToList();
        }
    }
}
