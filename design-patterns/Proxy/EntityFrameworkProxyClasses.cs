using System;
using System.Collections.Generic;

namespace ConsoleApp
{
    class EntityFrameworkProxyClasses
    {
        static void Main(string[] args)
        {
            UserDBSet userDbSet = new UserDBSet();
            User u = userDbSet.Create();

            IEnumerable<object> userClasses = u.Classes;
            u.Classes = new List<object>();
        }
    }

    class UserDBSet
    {
        public User Create()
        {
            return new UserProxy();
        }
    }

    class User
    {
        public int ID { get; set; }

        public virtual ICollection<object> Classes { get; set; }
    }

    class UserProxy : User
    {
        public override ICollection<object> Classes
        {
            get
            {
                Console.WriteLine("SELECT * from Classes WHERE ID = base.ID");
                return new List<object>();
            }

            set
            {
                Console.WriteLine("Update classes into the DB");
            }
        }
    }
}
