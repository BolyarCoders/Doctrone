namespace DoctroneAPI.Models
{
    public class UserActivity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DrugId { get; set; }
        public  DateTime Date { get; set; }
        public double TakenQuantity { get; set; }
    }
}
