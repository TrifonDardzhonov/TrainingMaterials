using System;
using System.Collections.Generic;

namespace FacadeAndMediator
{
    public class Chat
    {
        static void Main(string[] args)
        {
            IChatRoom chatroom = new ChatRoom();

            User user1 = new ChatUser(chatroom, "1", "Alex");
            User user2 = new ChatUser(chatroom, "2", "Brian");
            User user3 = new ChatUser(chatroom, "3", "Charles");
            User user4 = new ChatUser(chatroom, "4", "David");

            chatroom.addUser(user1);
            chatroom.addUser(user2);
            chatroom.addUser(user3);
            chatroom.addUser(user4);

            user1.send("Hello brian", "2");
            user2.send("Hey buddy", "1");
        }
    }

    public interface IChatRoom
    {
        void sendMessage(string msg, string userId);

        void addUser(User user);
    }

    public class ChatRoom : IChatRoom
    {
        private Dictionary<string, User> usersMap = new Dictionary<string, User>();

        public void sendMessage(string msg, string userId)
        {
            User u = usersMap[userId];
            u.receive(msg);
        }
        public void addUser(User user)
        {
            this.usersMap.Add(user.getId(), user);
        }
    }

    public abstract class User
    {
        private IChatRoom mediator;

        private string id;
        private string name;

        public User(IChatRoom room, string id, string name)
        {
            this.mediator = room;
            this.name = name;
            this.id = id;
        }

        public abstract void send(string msg, string userId);
        public abstract void receive(string msg);

        public IChatRoom getMediator()
        {
            return mediator;
        }

        public string getId()
        {
            return id;
        }

        public String getName()
        {
            return name;
        }
    }

    public class ChatUser : User
    {
        public ChatUser(IChatRoom room, string id, string name) : base(room, id, name)
        {
        }

        public override void send(string msg, string userId)
        {
            Console.WriteLine(this.getName() + " :: Sending Message : " + msg);
            getMediator().sendMessage(msg, userId);
        }
        public override void receive(string msg)
        {
            Console.WriteLine(this.getName() + " :: Received Message : " + msg);
        }

    }
}
