using System;

namespace FacadeAndMediator
{
    class MediatorWithObservables
    {
        static void Main(string[] args)
        {
            Mediator mediator = new Mediator();

            Manager nanager = new Manager(mediator);
            TeamLead teamLead = new TeamLead(mediator);
            Client client = new Client(mediator);
            Programmer gosheto = new Programmer(mediator);

            gosheto.JobIsDone();
        }
    }

    class Mediator
    {
        private Action OnTaskDone;

        public void SubsribeForTaskDone(Action action)
        {
            // this.OnTaskDone.GetInvocationList()
            this.OnTaskDone += action;
        }

        public void JobIsDone()
        {
            this.OnTaskDone();
        }
    }

    class Manager
    {
        private Mediator m;
        public Manager(Mediator m)
        {
            this.m = m;
            this.m.SubsribeForTaskDone(this.BuyWine);
        }
        private void BuyWine()
        {
            Console.WriteLine("Manager: drinking wine like a boss");
        }

        private void ShowHappyFace()
        {
            Console.WriteLine("Manager: giggle giggle");
        }
    }

    class TeamLead
    {
        private Mediator m;
        public TeamLead(Mediator m)
        {
            this.m = m;
            this.m.SubsribeForTaskDone(this.SayGoodJob);
        }
        private void SayGoodJob()
        {
            Console.WriteLine("Team Lead: saying 'Good job young padawan'");
        }
    }

    class Client
    {
        private Mediator m;
        public Client(Mediator m)
        {
            this.m = m;
            this.m.SubsribeForTaskDone(this.GiveMoney);
        }
        private void GiveMoney()
        {
            Console.WriteLine("Client: giving you 100$ for the job");
        }
    }

    class Programmer
    {
        private Mediator m;
        public Programmer(Mediator m)
        {
            this.m = m;
        }

        public void JobIsDone()
        {
            this.m.JobIsDone();
        }
    }
}
