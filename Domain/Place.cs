namespace Domain
{
  public class Place
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public ICollection<Activity> Activities { get; set; }
  }
}