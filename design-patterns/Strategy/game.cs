using System;

namespace Game
{
    class Program
    {
        private const string MOVE_COMMAND = "move";
        private const string ATTACK_COMMAND = "attack";
        private const string INFO_COMMAND = "info";
        private const string QUIT_COMMAND = "quit";

        private const int METERS_REQUIRED_LEVEL_2 = 5;
        private const int METERS_REQUIRED_LEVEL_3 = 12;
        private const int FAR_FAR_AWAY = 25;

        static void Main(string[] args)
        {
            string command = string.Empty;
            int meters = 0;
            Hero svetiGeorgi = new Hero(new SmallSword(), new Walking());
            Console.WriteLine("Hello Goshe");
            Console.WriteLine(string.Format("Second level: after {0} meters", METERS_REQUIRED_LEVEL_2));
            Console.WriteLine(string.Format("Third level: after {0} meters", METERS_REQUIRED_LEVEL_3));
            Console.WriteLine(string.Format("God level: after {0} meters", FAR_FAR_AWAY));

            while (!command.Equals(QUIT_COMMAND))
            {
                command = Console.ReadLine();

                switch (command)
                {
                    case MOVE_COMMAND:
                        meters += svetiGeorgi.Move();
                        ChooseGear(meters, svetiGeorgi);
                        Console.WriteLine(string.Format("Current distance: {0} meters", meters));
                        break;
                    case ATTACK_COMMAND:
                        svetiGeorgi.Attack();
                        break;
                    case INFO_COMMAND:
                        Console.WriteLine(svetiGeorgi.Preview());
                        break;
                }
            }

            Console.WriteLine("The game is over.");
            Console.ReadLine();
        }

        private static void ChooseGear(int meters, Hero player)
        {
            if (METERS_REQUIRED_LEVEL_2 <= meters && meters < METERS_REQUIRED_LEVEL_3 && player.Level == 1)
            {
                player.LevelUp(new BigSword(), new Teleporting());
            }
            else if (meters >= METERS_REQUIRED_LEVEL_3 && player.Level == 2)
            {
                player.LevelUp(new Bow(), new Flying());
            }
            else if (meters >= FAR_FAR_AWAY && player.Level == 3)
            {
                player.UseWeapon(new Gun());
            }
        }
    }

    public class Hero
    {
        public Hero(Weapon startUpWeapon, Movement startUpMovement)
        {
            this.Level = 1;
            this.Weapon = startUpWeapon;
            this.Movement = startUpMovement;
            this.Rank = "Fisherman";
        }

        public string Rank { get; private set; }
        public int Level { get; private set; }
        public Weapon Weapon { get; private set; }
        public Movement Movement { get; private set; }

        public void UseWeapon(Weapon newWeapon)
        {
            if (newWeapon != null)
            {
                this.Weapon = newWeapon;
            }
        }

        public void SetMovement(Movement newMovement)
        {
            if (newMovement != null)
            {
                this.Movement = newMovement;
            }
        }

        public void LevelUp()
        {
            this.LevelUp(null, null);
        }

        public void LevelUp(Movement newMovement)
        {
            this.LevelUp(null, newMovement);
        }

        public void LevelUp(Weapon newWeapon)
        {
            this.LevelUp(newWeapon, null);
        }

        public void LevelUp(Weapon newWeapon, Movement newMovement)
        {
            this.Level++;
            this.UseWeapon(newWeapon);
            this.SetMovement(newMovement);

            if (Level == 2)
            {
                this.Rank = "Hunter";
            }
            else if (Level == 3)
            {
                this.Rank = "Dragon Slayer";
            }
        }

        public string Preview()
        {
            return string.Format(
                "Rank: {0}, Weapon: {1}, Moving: {2}",
                this.Rank,
                this.Weapon.Type,
                this.Movement.Type
            );
        }

        public int Attack()
        {
            Console.WriteLine(string.Format(
                "Rank: {0} ; Attack with {1} damage via {2}", this.Rank, this.Weapon.Damage, this.Weapon.Type));
            return this.Weapon.Damage;
        }

        public int Move()
        {
            Console.WriteLine(string.Format(
                "Rank: {0} ; Moved {1} meters via {2}", this.Rank, this.Movement.Distance, this.Movement.Type));
            return this.Movement.Distance;
        }
    }

    public interface Weapon
    {
        string Type { get; }
        int Damage { get; }
        int Range { get; }
        bool IsOneHandWeapon { get; }
    }

    public class SmallSword : Weapon
    {
        public string Type => "Small Sword";
        public int Damage => 1;
        public int Range => 2;
        public bool IsOneHandWeapon => true;
    }

    public class BigSword : Weapon
    {
        public string Type => "Big Sword";
        public int Damage => 2;
        public int Range => 3;
        public bool IsOneHandWeapon => true;
    }

    public class Bow : Weapon
    {
        public string Type => "Bow";
        public int Damage => 3;
        public int Range => 4;
        public bool IsOneHandWeapon => false;
    }

    public class Gun : Weapon
    {
        public string Type => "Gun";
        public int Damage => 20;
        public int Range => 20;
        public bool IsOneHandWeapon => false;
    }

    public interface Movement
    {
        string Type { get; }
        int Distance { get; }
    }

    public class Walking : Movement
    {
        public string Type => "Walking";
        public int Distance => 2;
    }

    public class Teleporting : Movement
    {
        public string Type => "Teleporting";
        public int Distance => 50;
    }

    public class Running : Movement
    {
        public string Type => "Running";
        public int Distance => 4;
    }

    public class Flying : Movement
    {
        public string Type => "Flying";
        public int Distance => 10;
    }
}
