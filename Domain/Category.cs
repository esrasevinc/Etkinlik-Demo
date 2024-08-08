namespace Domain
{
  public class Category
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public ICollection<Activity> Activities { get; set; }
  }
}