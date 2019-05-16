//using System;

//namespace FacadeAndMediator
//{
//    public class Program
//    {
//        static void Main(string[] args)
//        {
//            FoodPanda fp = new FoodPanda(new ViaOrderProgram());
//            fp.OrderFood("fish + salad");

//            Console.ReadLine();
//        }
//    }

//    public class FoodPanda
//    {
//        Waiter waiter;
//        Kitchen kitchen;

//        public FoodPanda(FoodOrderCommunicationChannel communicationChannel)
//        {
//            this.waiter = new Waiter(communicationChannel);
//            this.kitchen = new Kitchen(communicationChannel);

//            communicationChannel.SetWaiter(this.waiter);
//            communicationChannel.SetKitchen(this.kitchen);
//        }

//        public void OrderFood(string order)
//        {
//            waiter.writeOrder(order);
//            waiter.sendToKitchen();
//            kitchen.prepareFood();
//            kitchen.callWaiter();
//            waiter.getTheFoodFromKitchen();
//            waiter.serveCustomer();
//            kitchen.washDishes();
//        }
//    };

//    public class Waiter
//    {
//        WaiterToKitchenCommunicationChannel communicationChannel;
//        public Waiter(WaiterToKitchenCommunicationChannel communicationChannel)
//        {
//            this.communicationChannel = communicationChannel;
//        }
//        private string order;
//        public string lastOrder() { return this.order; }
//        public void writeOrder(string order)
//        {
//            this.order = order;
//            Console.WriteLine($" Waiter writes client's order: {order}");
//        }
//        public void sendToKitchen()
//        {
//            this.communicationChannel.NotifyKitchen(this.order);
//            Console.WriteLine(" Send order to kitchen");
//        }
//        public void getTheFoodFromKitchen() { } // get is ok because we really GET the food
//        public void serveCustomer() { Console.WriteLine(" Yeeei customer is served!!!"); }
//    };

//    public class Kitchen
//    {
//        KitchenToWaiterCommunicationChannel communicationChannel;
//        public Kitchen(KitchenToWaiterCommunicationChannel communicationChannel)
//        {
//            this.communicationChannel = communicationChannel;
//        }
//        public void takeOrder(string order)
//        {
//            // keep the order
//        }
//        public void prepareFood() { Console.WriteLine(" Cook food"); }
//        public void callWaiter()
//        {
//            this.communicationChannel.CallWaiterWhenOrderIsReady();
//            Console.WriteLine(" Call Waiter");
//        }
//        public void washDishes() { Console.WriteLine(" Wash the dishes"); }
//    };

//    public interface FoodOrderCommunicationChannel
//        : WaiterToKitchenCommunicationChannel, KitchenToWaiterCommunicationChannel
//    {
//        void SetWaiter(Waiter w);
//        void SetKitchen(Kitchen k);
//    }

//    public interface WaiterToKitchenCommunicationChannel
//    {
//        void NotifyKitchen(string order);
//    }

//    public interface KitchenToWaiterCommunicationChannel
//    {
//        void CallWaiterWhenOrderIsReady();
//    }

//    // each chef can call a waiter and each waiter can give the order to a specific chef
//    public class PersonToPerson : FoodOrderCommunicationChannel
//    {
//        private Waiter waiter;
//        private Kitchen kitchen;

//        public void SetWaiter(Waiter w)
//        {
//            this.waiter = w;
//        }

//        public void SetKitchen(Kitchen k)
//        {
//            this.kitchen = k;
//        }

//        public void CallWaiterWhenOrderIsReady()
//        {
//            Console.WriteLine(" Go to the kitchen directly");
//        }

//        public void NotifyKitchen(string order)
//        {
//            Console.WriteLine(" Go walking");
//            Console.WriteLine(" Say the order directly to the chefs");
//        }
//    }

//    public class ViaOrderProgram : FoodOrderCommunicationChannel
//    {
//        private Waiter waiter;
//        private Kitchen kitchen;
//        private object orderProgram;

//        public void SetWaiter(Waiter w)
//        {
//            this.waiter = w;
//        }

//        public void SetKitchen(Kitchen k)
//        {
//            this.kitchen = k;
//        }

//        public void CallWaiterWhenOrderIsReady()
//        {
//            Console.WriteLine(" Send message");
//        }

//        public void NotifyKitchen(string order)
//        {
//            Console.WriteLine(" Enter the order into the program");
//            Console.WriteLine(" Send Notification to the kitchen's terminal");
//        }
//    }
//}
