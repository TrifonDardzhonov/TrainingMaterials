using System;
using System.Threading.Tasks;

namespace ConsoleApp
{
    class ProxyChaining
    {
        public static void Main()
        {
            Console.WriteLine("Without permission to save changes");
            UnitOfWork uowDisabled = new UnitOfWorkProxy(false);
            uowDisabled.CurrentUser();
            uowDisabled.CurrentUser();
            uowDisabled.SaveChanges();

            Console.WriteLine();
            Console.WriteLine("With permission to save changes");
            UnitOfWork uowAllowed = new UnitOfWorkProxy(true);
            uowAllowed.CurrentUser();
            uowAllowed.CurrentUser();
            uowAllowed.SaveChanges();
        }
    }

    interface UnitOfWork
    {
        object CurrentUser();
        Task SaveChanges();
    }

    class UnitOfWorkProxy : UnitOfWork
    {
        UnitOfWork uow;
        public UnitOfWorkProxy(bool canSaveChanges)
        {
            uow = new EntityFrameworkUnitOfWork();
            uow = new UnitOfWorkVirtualProxy(uow);
            uow = new UnitOfWorkProtectionProxy(canSaveChanges, uow);
        }

        public object CurrentUser()
        {
            return uow.CurrentUser();
        }

        public Task SaveChanges()
        {
            return uow.SaveChanges();
        }
    }

    class EntityFrameworkUnitOfWork : UnitOfWork
    {
        public object CurrentUser()
        {
            Console.WriteLine("Fetch the User From the Database");
            return new object();
        }

        public async Task SaveChanges()
        {
            Console.WriteLine("Save all changes into the database");
        }
    }

    class UnitOfWorkProtectionProxy : UnitOfWork
    {
        private UnitOfWork uow;
        private bool canSaveChanges;

        public UnitOfWorkProtectionProxy(bool canSaveChanges, UnitOfWork uow)
        {
            this.canSaveChanges = canSaveChanges;
            this.uow = uow;
        }

        public object CurrentUser()
        {
            return this.uow.CurrentUser();
        }

        public async Task SaveChanges()
        {
            if (this.canSaveChanges)
                await this.uow.SaveChanges();
        }
    }

    class UnitOfWorkVirtualProxy : UnitOfWork
    {
        private UnitOfWork uow;
        private object cachedUser;

        public UnitOfWorkVirtualProxy(UnitOfWork uow)
        {
            this.uow = uow;
        }

        public object CurrentUser()
        {
            // Why? Always think about it first :)
            //object cu;
            //if (this.cachedUser != null)
            //{
            //    cu = this.cachedUser;
            //}
            //else
            //{
            //    cu = this.uow.CurrentUser();
            //    this.cachedUser = cu;
            //}

            //return cu;

            if (this.cachedUser == null)
                this.cachedUser = this.uow.CurrentUser();

            return this.cachedUser;
        }

        public async Task SaveChanges()
        {
            await this.uow.SaveChanges();
        }
    }
}
